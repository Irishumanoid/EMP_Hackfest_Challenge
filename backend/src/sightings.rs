// A database and handler for all posts.
// Each post holds a location, a time, a username, a description, and a list of tags, each with data associated with the tag.
// The tag types are:
// Clothes: Price rating (1-5)
// Gas: Price per gallon, premium price per gallon, diesel price per gallon
// Food: Price rating (1-5)
// Grocery: Price rating (1-5)
// Parking: Average hourly price, average daily price, average monthly price
// These posts are all stored and then filtered and sorted by score, when searching. 
// When displaying to the map, a certain amount of top score posts are displayed in place.
// The score is calculated with upvotes/downvotes/seconds, and also by distance away, and time ago.
// Similar posts are also clusterd together and their reputations are merged. However, the posts still stay seperate.

use core::panic;
use std::{sync::{Arc, Mutex, Weak}};
use crate::GetPostFilters;
use rocket::time::{PrimitiveDateTime, Duration};
use serde::{Serialize, Deserialize};

use crate::macros::hypot;

pub const AGREE_WEIGHT : f64 = 2.0;
pub const DISAGREE_WEIGHT : f64 = 3.0;
pub const UPVOTE_WEIGHT : f64 = 1.0;
pub const DOWNVOTE_WEIGHT : f64 = 1.0;
pub const MILES_CLUSTER_RANGE : f64 = 0.2;

pub struct Database {
    pub data : Vec<Arc<Mutex<DbEntry>>>,
}

#[derive(Serialize, Deserialize)]
pub struct StaticDatabase {
    pub data: Vec<StaticDbEntry>,
}

#[derive(Clone, std::fmt::Debug)]
pub struct DbEntry {
    pub id : i32,
    pub post : UserPost,
    pub stats : Stats,
}

#[derive(Clone, std::fmt::Debug, Serialize, Deserialize)]
pub struct StaticDbEntry {
    pub id : i32,
    pub post : UserPost,
    pub stats : StaticStats,
}

impl DbEntry {
    pub fn get_score_recursive(&self, 
        recency_multiplier : fn(Option<Duration>) -> f64, 
        nearby_miles_multiplier : fn(f64) -> f64,
        time : Option<()>, //TODO
        home_location : &Coordinates,
    ) -> f64 {
        let mut score = self.get_score(recency_multiplier, nearby_miles_multiplier, time, home_location);
        for i in self.stats.similar_posts_ids.iter() {
            score += i.upgrade().unwrap().lock().unwrap().get_score(recency_multiplier, nearby_miles_multiplier, time, home_location);
        }
        score
    }
    pub fn get_score(&self, 
        recency_multiplier : fn(Option<Duration>) -> f64, 
        nearby_miles_multiplier : fn(f64) -> f64,
        time : Option<()>, //TODO
        home_location : &Coordinates,
    ) -> f64 {
        let nearby_miles = Coordinates::deg_to_miles(self.post.location.deg_dist(&home_location));
        let ret = (self.stats.get_net_votes() + 1.0)
        * recency_multiplier(None) //TODO
        * nearby_miles_multiplier(nearby_miles);
        ret
    }
}

pub fn inverse_distance_multiplier(miles : f64) -> f64 {
    1.0 / (f64::max(miles, 0.00001))//TODO 1.0))
}
pub fn recency_distance_function(duration : Option<Duration>) -> f64 {
    match duration {
        // Some(d) => inverse_distance_multiplier(d.num_seconds() as f64),
        // None => 1.0,
        _ => 1.0,
    }
    //TODO
}

impl Database {
    pub fn new() -> Database {
        Database {
            data : Vec::new(),
        }
    }
    pub fn from_static(static_db : StaticDatabase) -> Database {
        let mut db = Database::new();
        for entry in static_db.data {
            db.data.push(Arc::new(Mutex::new(DbEntry {post : entry.post, stats : Stats {upvotes : entry.stats.upvotes, downvotes : entry.stats.downvotes, agree : entry.stats.agree, disagree : entry.stats.disagree, similar_posts_ids : Vec::new()}, id : entry.id})));
        }
        db.reindex_clusters();
        db
    }
    pub fn to_static(&self) -> StaticDatabase {
        let mut static_db = StaticDatabase {data : Vec::new()};
        for entry in self.data.iter() {
            static_db.data.push(StaticDbEntry {post : entry.lock().unwrap().post.clone(), stats : StaticStats {upvotes : entry.lock().unwrap().stats.upvotes, downvotes : entry.lock().unwrap().stats.downvotes, agree : entry.lock().unwrap().stats.agree, disagree : entry.lock().unwrap().stats.disagree}, id : entry.lock().unwrap().id});
        }
        static_db
    }
    pub fn add_submission(&mut self, submission : UserPost) {
        let last = self.data.len() as usize;
        self.data.push(Arc::new(Mutex::new(DbEntry {post : submission, stats : Stats::new(), id : last as i32})));
        let splitmut = self.data.split_at_mut(last);
        for x in splitmut.0.iter_mut() {
            if x.lock().unwrap().post.location.in_range(&splitmut.1[0].lock().unwrap().post.location, MILES_CLUSTER_RANGE) {
                x.lock().unwrap().stats.similar_posts_ids.push(Arc::downgrade(&splitmut.1[0]));
                splitmut.1[0].lock().unwrap().stats.similar_posts_ids.push(Arc::downgrade(x));
            }
        }
    }
    pub fn reindex_clusters(&mut self) {
        for i in 0..self.data.len() {
            self.data[i].lock().unwrap().stats.similar_posts_ids = Vec::new();
        }
        for i in 0..self.data.len() {
            let splitmut = self.data.split_at_mut(i);
            for x in splitmut.0.iter_mut() {
                if x.lock().unwrap().post.location.in_range(&splitmut.1[0].lock().unwrap().post.location, MILES_CLUSTER_RANGE) {
                    x.lock().unwrap().stats.similar_posts_ids.push(Arc::downgrade(&splitmut.1[0]));
                    splitmut.1[0].lock().unwrap().stats.similar_posts_ids.push(Arc::downgrade(x));
                }
            }
        }
    }
    pub fn popular_posts(&self, filters : GetPostFilters) -> Vec<Arc<Mutex<DbEntry>>> {
        //TODO: Get actual time
        let mut result = self.data.clone()
        .into_iter()
        .filter(|i| i.lock().unwrap().post.check_if_in_filter(&filters))
        .collect::<Vec<Arc<Mutex<DbEntry>>>>();
        result.sort_by(|a : &Arc<Mutex<DbEntry>>, b : &Arc<Mutex<DbEntry>>| {
            let valb = b.lock().unwrap().get_score_recursive(recency_distance_function, inverse_distance_multiplier, None, &Coordinates::new(filters.location[0], filters.location[1]));
            let vala = &a.lock().unwrap().get_score_recursive(recency_distance_function, inverse_distance_multiplier, None, &Coordinates::new(filters.location[0], filters.location[1]));
            valb.partial_cmp(vala).unwrap()
        });
        result
    }
}

#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub struct UserPost {
    pub display_name: String,
    pub username: String,
    pub description: String,
    pub location: Coordinates,
    pub tags: Vec<PostType>,
    pub picture: Option<String>,
}


pub fn conv_to_pt(tags: Vec<String>, price_rating : Vec<i32>) -> Vec<PostType> {
    let mut index = 0;
    let mut pts = Vec::new();
    for tag in tags {
        pts.push(match tag.to_lowercase().as_str() {
            "clothes" => PostType::Clothes(ClothesPrices {price_rating: price_rating[index]} ),
            "food" => PostType::Food(FoodPrices { price_rating: price_rating[index] }),
            "groceries" => PostType::Gas(GasPrices { price_rating: price_rating[index] }),
            "parking" => PostType::Grocery(GroceryPrices { price_rating: price_rating[index] }),
            "gas" => PostType::Parking(ParkingPrices { price_rating: price_rating[index] }),
            _ => panic!("User Submission Error"),
        });
        index += 1;
    };

    pts
}

pub fn conv_to_cpt(tags: Vec<PostType>) -> (Vec<String>, Vec<i32>) {
    let mut pts = Vec::new();
    let mut price_rating = Vec::new();
    for tag in tags {
        match tag {
            PostType::Clothes(ClothesPrices {price_rating: i32}) => {
                pts.push("clothes".to_string());
                price_rating.push(i32);
            },
            PostType::Food(FoodPrices { price_rating: i32 }) => {
                pts.push("food".to_string());
                price_rating.push(i32);
            },
            PostType::Grocery(GroceryPrices { price_rating: i32 }) => {
                pts.push("groceries".to_string());
                price_rating.push(i32);
            },
            PostType::Parking(ParkingPrices { price_rating: i32 }) => {
                pts.push("parking".to_string());
                price_rating.push(i32);
            },
            PostType::Gas(GasPrices { price_rating: i32 }) => {
                pts.push("gas".to_string());
                price_rating.push(i32);
            },
        };
    };

    (pts, price_rating)
}


impl UserPost {
    pub fn from(display_name : String, description : String, username: String, location : [f64; 2], tags : Vec<PostType>, picture : Option<String>) -> UserPost {
        UserPost {
            display_name,
            description,
            username,
            location: Coordinates::new(location[0], location[1]),
            tags,
            picture,
        }
    }
    pub fn new(post: crate::ClientUserPost) -> UserPost {
        UserPost {
            display_name: post.display_name,
            description: post.description,
            username: post.username,
            location: Coordinates::new(post.location[0].into(), post.location[1].into()),
            tags: conv_to_pt(post.tags, post.price_rating.clone()),
            picture: post.picture,
        }
    }
    pub fn to_ClientUserPost(self) -> crate::ClientUserPost {
        let n = conv_to_cpt(self.tags);
        crate::ClientUserPost {
            display_name : self.display_name,
            username : self.username,
            description : self.description,
            location : [self.location.latitude, self.location.longitude],
            tags : n.0,
            price_rating : n.1,
            picture : self.picture,
        }
    }
    pub fn check_if_type_in(&self, tags : &Vec<String>) -> bool {
        crate::macros::bool_or(
            &self.tags.iter().map(|t: &PostType | 
                match t {
                    PostType::Clothes(_) => (tags.iter().map(|i| i.to_lowercase()).collect::<Vec<String>>()).contains(&"clothes".to_string()),
                    PostType::Gas(_)     => (tags.iter().map(|i| i.to_lowercase()).collect::<Vec<String>>()).contains(&"gas".to_string()),
                    PostType::Food(_)    => (tags.iter().map(|i| i.to_lowercase()).collect::<Vec<String>>()).contains(&"food".to_string()),
                    PostType::Grocery(_) => (tags.iter().map(|i| i.to_lowercase()).collect::<Vec<String>>()).contains(&"grocery".to_string()),
                    PostType::Parking(_) => (tags.iter().map(|i| i.to_lowercase()).collect::<Vec<String>>()).contains(&"parking".to_string()),
                })
            .collect::<Vec<bool>>()
        )
    }
    pub fn same_type(&self, tag : &String) -> bool {
            for self_tag in &self.tags.iter().map(|t: &PostType | 
                t.get_string()
            ).collect::<Vec<String>>() {
                if self_tag.to_lowercase() == tag.to_lowercase() {
                    return true;
                }
            }
            return false;
    }
    pub fn check_if_price_in_range(&self, price_range : i32, tag: String) -> bool {
        let mut price = 0;
        for (i, self_tag) in self.tags.iter().enumerate() {
            if self_tag.get_string() == tag {
                price = match self_tag {
                    PostType::Clothes(ClothesPrices {price_rating}) => *price_rating,
                    PostType::Gas(GasPrices {price_rating}) => *price_rating,
                    PostType::Food(FoodPrices {price_rating}) => *price_rating,
                    PostType::Grocery(GroceryPrices {price_rating}) => *price_rating,
                    PostType::Parking(ParkingPrices {price_rating}) => *price_rating,
                }
            }
        }
        price <= price_range
    }
    pub fn check_if_in_filter(&self, filter : &GetPostFilters) -> bool {
        //Check if any of the posttypes are in the tags; O(n) call to an O(n) function; O(n^2)
        self.same_type(&filter.tag.as_ref().unwrap())
        && self.check_if_price_in_range(filter.max_price, filter.tag.as_ref().unwrap().clone())
    }
}

#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub struct Coordinates {
    pub latitude  : f64,
    pub longitude : f64,
}

#[derive(Clone, std::fmt::Debug)]
pub struct Stats {
    pub upvotes   : u32,
    pub downvotes : u32,
    pub agree     : u32,
    pub disagree  : u32,
    pub similar_posts_ids : Vec<Weak<Mutex<DbEntry>>>,
}

#[derive(Clone, std::fmt::Debug, Serialize, Deserialize)]
pub struct StaticStats {
    pub upvotes   : u32,
    pub downvotes : u32,
    pub agree     : u32,
    pub disagree  : u32,
}

impl Stats {
    pub fn new() -> Stats {
        Stats {
            upvotes : 0,
            downvotes : 0,
            agree : 0,
            disagree : 0,
            similar_posts_ids : Vec::new(),
        }
    }
    pub fn get_net_votes(&self) -> f64 {
        0.0
        + self.upvotes    as f64 * UPVOTE_WEIGHT 
        - self.downvotes  as f64 * DOWNVOTE_WEIGHT 
        + self.agree      as f64 * AGREE_WEIGHT 
        - self.disagree   as f64 * DISAGREE_WEIGHT
    }
}

impl Coordinates {
    pub fn new(lat : f64, long : f64) -> Coordinates {
        Coordinates {
            latitude : lat,
            longitude : long,
        }
    }
    pub fn new_precise(latdeg : f64, latmin : f64, latsec : f64, longdeg : f64, longmin : f64, longsec : f64) -> Coordinates {
        Coordinates {
            latitude : latdeg + latmin / 60.0 + latsec / 3600.0,
            longitude : longdeg + longmin / 60.0 + longsec / 3600.0,
        }
    }
    pub fn in_range(&self, other : &Coordinates, range : f64) -> bool {
        self.deg_dist(other) <= range
    }
    pub fn deg_dist(&self, other : &Coordinates) -> f64 {
        hypot(self.latitude - other.latitude, self.longitude - other.longitude)
    }
    pub fn deg_to_miles(deg : f64) -> f64 {
        deg * 69.0
    }
    pub fn miles_to_deg(miles : f64) -> f64 {
        miles / 69.0
    }
    pub fn get_tuple(&self) -> [f32; 2] {
        [self.latitude as f32, self.longitude as f32]
    }
}

#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub struct ClothesPrices {
    pub price_rating : i32, //1-5
}

#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub struct ParkingPrices {
    pub price_rating : i32,
    //pub avg_hourly : f64,
    //pub avg_daily  : f64,
    //pub avg_monthly: f64,
}

#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub struct GasPrices {
    pub price_rating : i32,
    //pub per_gallon : f64,
    //pub permium_per_gallon : f64,
    //pub diesel_per_gallon : f64,
}

#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub struct FoodPrices {
    pub price_rating : i32,
    //pub avg_food_per_person : f64,
    //pub min_food_per_person : f64,
}

//TODO: Make each of the fields optional and only filter with things that have the optional field filled in
#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub struct GroceryPrices {
    pub price_rating : i32, //1-5
}

#[derive(Clone, Serialize, std::fmt::Debug, Deserialize)]
pub enum PostType {
    Clothes(ClothesPrices),
    Gas(GasPrices),
    Food(FoodPrices),
    Grocery(GroceryPrices),
    Parking(ParkingPrices),
}

impl PostType {
    pub fn get_string(&self) -> String {
        return match self {
            PostType::Clothes(_) => "clothes".to_string(),
            PostType::Gas(_)     => "gas".to_string(),
            PostType::Food(_)    => "food".to_string(),
            PostType::Grocery(_) => "grocery".to_string(),
            PostType::Parking(_) => "parking".to_string(),
        }
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    //Run with -- --nocapture
    fn integ_test() {
        let mut db = Database::new();

        let post1 = UserPost::from(
            "7 11".to_string(),
            "John Billy".to_string(),
            "Gas station here only 4.99 / gal".to_string(), 
            [47.6720145,-122.3539607], 
            // vec![PostType::Gas(GasPrices {per_gallon : 4.99, premium_per_gallon : 5.19, diesel_per_gallon : 5.49})], 
            vec![PostType::Gas(GasPrices {price_rating : 3})],
            None
        );
        db.add_submission(post1);

        let post2 = UserPost::from(
            "Big parking Lot".to_string(),
            "John Billy 2".to_string(),
            "GREAT PARKING PLACE!".to_string(), 
            [47.667762, -122.339747], 
            // vec![PostType::Gas(GasPrices {per_gallon : 4.99, premium_per_gallon : 5.19, diesel_per_gallon : 5.49})], 
            vec![PostType::Gas(GasPrices {price_rating : 3})],
            None
        );
        db.add_submission(post2);

        // let post_filters = GetPostFilters {location : [47.668666, -122.350483], tags : vec!["gas".to_string(), "parking".to_string()], price_range : 1};
        let post_filters = GetPostFilters {location : [47.668666, -122.350483], tag : Some("gas".to_string()), max_price : 3};
        println!("{:?}", db.popular_posts(post_filters));
    }
}