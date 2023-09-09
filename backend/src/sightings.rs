use rocket::time::PrimitiveDateTime;

use crate::macros::hypot;

pub struct Database {
    data : Vec<(Submission, Stats)>,
}

pub struct Coordinates {
    pub latitude  : f64,
    pub longitude : f64,
}

pub struct Stats {
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
        }
    }
    pub fn get_net_votes(&self) -> u32 {
        self.upvotes - self.downvotes + self.agree * 2 - self.disagree * 2
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
            latitude : latdeg + latmin/60.0 + latsec/3600.0,
            longitude : longdeg + longmin/60.0 + longsec/3600.0,
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

pub struct ClothesPrices {
    pub avg_shirt : f64,
    pub avg_pants : f64,
    pub avg_shoes : f64,
    pub avg_hat   : f64,
    pub min_shirt : f64,
    pub min_pants : f64,
    pub min_shoes : f64,
    pub min_hat   : f64,
}

pub struct ParkingPrices {
    pub avg_hourly : f64,
    pub avg_daily  : f64,
    pub avg_monthly: f64,
}

pub struct GasPrices {
    pub gas_per_gallon : f64,
    pub quality_gas_per_gallon : f64,
    pub diesel_per_gallon : f64,
}

pub struct FoodPrices {
    pub avg_food_per_person : f64,
    pub min_food_per_person : f64,
    pub min_eggs   : f64,
    pub min_milk   : f64,
    pub min_bread  : f64,
    pub avg_eggs   : f64,
    pub avg_milk   : f64,
    pub avg_bread  : f64,
}

pub enum PostType {
    Clothes(ClothesPrices),
    Gas(GasPrices),
    Food(FoodPrices),
    Parking(ParkingPrices),
}

pub struct Submission {
    pub username    : String,
    pub location    : Coordinates,
    pub time        : PrimitiveDateTime,
    pub post_string : String,
    // pub post_info   : PostInfo,
}