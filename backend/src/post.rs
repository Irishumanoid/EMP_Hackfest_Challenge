#[macro_use] extern crate rocket;

use rocket::data::{FromData, Outcome};
use rocket::{Data, Request};
use rocket_contrib::uuid::Uuid;
use rocket::http::Status;
use rocket::tokio::io::AsyncReadExt;

use rocket::serde::{Deserialize, json::Json};

//include name, tags, location, price, description
#[derive(Debug, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Post { 
    name: String,
    loc: Vec<usize>,
    tags: Vec<f64>,
    price: f64, 
    description: String,
}


impl<'r> FromData<'r> for Post {
    type Error = std::io::Error;

    async fn from_data(_req: &'r Request<'_>, data: Data<'r>) -> rocket::data::Outcome<'r, Self> {
        let mut vals = String::new();
        if let Err(e) = data.open().take(256).read_to_string(&mut vals).await {
            return Outcome::Failure((Status::InternalServerError, e));
        }

        //deserialize user data
        if let Ok(user) = serde_json::from_str::<Post>(&vals) {
            Outcome::Success(user)
        } else {
            Outcome::Failure((Status::Unauthorized, ()))
        }
    }
}
