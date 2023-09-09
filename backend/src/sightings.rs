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

use rocket::time::{PrimitiveDateTime, Duration};
use serde::Serialize;

use crate::macros::hypot;

pub const AGREE_WEIGHT : f64 = 2.0;
pub const DISAGREE_WEIGHT : f64 = 3.0;
pub const UPVOTE_WEIGHT : f64 = 1.0;
pub const DOWNVOTE_WEIGHT : f64 = 1.0;

pub struct Database {
    data : Vec<DbEntry>,
}

#[derive(Clone)]
pub struct DbEntry {
    pub id : i32,
    pub post : UserPost,
    pub stats : Stats,
}

impl DbEntry {
    pub fn get_score(&self, 
        recency_multiplier : fn(Option<Duration>) -> f64, 
        nearby_miles_multiplier : fn(f64) -> f64,
        duration : Option<Duration>,
        nearby_miles : f64,
    ) -> f64 {
        crate::macros::sigmoid(self.stats.get_net_votes()) //Sigmoid function so that the score is between 0 and 1
        //TODO make this more interesting with statistics
        * recency_multiplier(duration) 
        * nearby_miles_multiplier(nearby_miles)
    }
}

fn inverse_distance_multiplier(miles : f64) -> f64 {
    1.0 / (f64::max(miles, 1.0))
}

// impl Serialize for Database {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
//         let mut s = serializer.serialize_struct("Database", 3)?;
//         s.serialize_field("phones", &self.phones)?;
//         s.end()
//     }
// }

impl Database {
    pub fn new() -> Database {
        Database {
            data : Vec::new(),
        }
    }
    pub fn add_submission(&mut self, submission : UserPost) {
        self.data.push(DbEntry{ post : submission, stats : Stats::new(), id : self.data.len() as i32 });
    }
    // pub fn popular_posts(&self, filters : GetPostFilters, range : f64) -> Vec<DbEntry> {
    //     let mut result = self.data
    //     .iter()
    //     .filter(|i| i.post.check_if_in_filter(filters))
    //     .collect::<Vec<DbEntry>>();
    //     result.sort_by(|a, b| b.get_score().partial_cmp(&a.get_score()).unwrap());
    //     result
    // }
}

#[derive(Clone, Serialize)]
pub struct UserPost {
    pub display_name: String,
    pub description: String,
    pub location: Coordinates,
    pub tags: Vec<PostType>,
    pub picture: Option<String>,
}

pub fn conv_to_pt(tags: Vec<String>, price_rating : i32) -> Vec<PostType> {
    return tags.iter().map(|tag_string| {
        match tag_string.to_lowercase().as_str() {
            "clothes" => PostType::Clothes(ClothesPrices { price_rating } ),
            "food" => PostType::Food(FoodPrices { price_rating }),
            "groceries" => PostType::Gas(GasPrices { price_rating }),
            "parking" => PostType::Grocery(GroceryPrices { price_rating }),
            "gas" => PostType::Parking(ParkingPrices { price_rating }),
            _ => panic!("balls"),
        }
    }).collect();
}

impl UserPost {
    pub fn new(post: crate::DeprecatedUserPost) -> UserPost {
        UserPost {
            display_name: post.display_name,
            description: post.description,
            location: Coordinates::new(post.location[0].into(), post.location[1].into()),
            tags: conv_to_pt(post.tags, post.price),
            picture: post.picture,
        }
    }
    // pub fn check_if_type_in(&self, tags : &Vec<String>) -> bool {
    //     crate::macros::bool_or(
    //         tags.iter().map(|t: String | {
    //             return match (t) {
    //                 PostType::Clothes(_) => tags.iter().map(|i| i.to_lowercase()).collect<Vec<String>>.contains("clothes"),
    //                 PostType::Gas(_)     => tags.iter().map(|i| i.to_lowercase()).collect<Vec<String>>.contains("gas"),
    //                 PostType::Food(_)    => tags.iter().map(|i| i.to_lowercase()).collect<Vec<String>>.contains("food"),
    //                 PostType::Grocery(_) => tags.iter().map(|i| i.to_lowercase()).collect<Vec<String>>.contains("grocery"),
    //                 PostType::Parking(_) => tags.iter().map(|i| i.to_lowercase()).collect<Vec<String>>.contains("parking"),
    //             }
    //         }
    //         .collect::<Vec<bool>>())
    //     )
    // }
    pub fn check_if_price_in_range(&self, price_range : i32) -> bool {
        true
        //TODO
    }
    // pub fn check_if_in_filter(&self, filter : &GetPostFilters) -> bool {
    //     //Check if any of the posttypes are in the tags; O(n) call to an O(n) function; O(n^2)
    //     self.check_if_type_in(&filter.tags) 
    //     && Coordinates::new(filter.location[0], filter.location[1]).in_range(&self.location, filter.location_range)
    //     && self.check_if_price_in_range(filter.price_range)
    // }
}

#[derive(Clone, Serialize)]
pub struct Coordinates {
    pub latitude  : f64,
    pub longitude : f64,
}

#[derive(Clone)]
pub struct Stats {
    pub upvotes   : u32,
    pub downvotes : u32,
    pub agree     : u32,
    pub disagree  : u32,
    pub similar_posts_ids : Vec<u32>,
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
    pub fn get_tuple(&self) -> (f64, f64) {
        (self.latitude, self.longitude)
    }
}

#[derive(Clone, Serialize)]
pub struct ClothesPrices {
    pub price_rating : i32, //1-5
}

#[derive(Clone, Serialize)]
pub struct ParkingPrices {
    pub price_rating : i32,
    //pub avg_hourly : f64,
    //pub avg_daily  : f64,
    //pub avg_monthly: f64,
}

#[derive(Clone, Serialize)]
pub struct GasPrices {
    pub price_rating : i32,
    //pub per_gallon : f64,
    //pub permium_per_gallon : f64,
    //pub diesel_per_gallon : f64,
}

#[derive(Clone, Serialize)]
pub struct FoodPrices {
    pub price_rating : i32,
    //pub avg_food_per_person : f64,
    //pub min_food_per_person : f64,
}

//TODO: Make each of the fields optional and only filter with things that have the optional field filled in
#[derive(Clone, Serialize)]
pub struct GroceryPrices {
    pub price_rating : i32, //1-5
}

#[derive(Clone, Serialize)]
pub enum PostType {
    Clothes(ClothesPrices),
    Gas(GasPrices),
    Food(FoodPrices),
    Grocery(GroceryPrices),
    Parking(ParkingPrices),
}


// #[cfg(test)]
// mod tests {
//     #[test]
//     //Run with -- --nocapture
//     fn integ_test() {
//         post1 = UserPost::new("John Billy", "Gas station here only 4.99 / gal", Coordinates::new(47.6720145,-122.3539607), vec![PostType::Gas(GasPrices {per_gallon : 4.99, premium_per_gallon : 5.19, diesel_per_gallon : 5.49})], None);
//         db = Database::new();
//         db.add_submission(post1);
//         println!(db.get_popular_posts(GetPostFilters {location : [47.6720145,-122.3539607], location_range : 1.0, tags : vec!["gas".to_string()], price_range : 1}));
//     }
// }