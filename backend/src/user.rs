#[derive(Debug)]
pub struct User {
    pub username: String,
    password: String,
}

#[macro_use] extern crate rocket;

use rocket::data::{FromData, Outcome};
use rocket::{Data, Request};
use rocket_contrib::uuid::Uuid;
use rocket::http::Status;
use rocket::tokio::io::AsyncReadExt;

impl<'r> FromData<'r> for AdminUser {
    type Error = std::io::Error;

    async fn from_data(_req: &'r Request<'_>, data: Data<'r>) -> rocket::data::Outcome<'r, Self> {
        let mut cookie = String::new();
        if let Err(e) = data.open().take(256).read_to_string(&mut cookie).await {
            return Outcome::Failure((Status::InternalServerError, e));
        }

        // get user data from session by parsing some json token


        if let Ok(user) = serde_json::from_str::<AdminUser>(&cookie) {
            Outcome::Success(user)
        } else {
            Outcome::Failure((Status::Unauthorized, ()))
        }
    }
}
