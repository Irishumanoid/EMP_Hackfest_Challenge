use rocket::serde::json::Json;
use serde::Deserialize;

#[macro_use]
extern crate rocket;


#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[derive(Deserialize)]
pub struct UserPost {
    pub display_name: String,
    pub description: String,
    pub location: [f32; 2],
    pub tags: Vec<String>,
    pub price: [f32; 2],
    pub picture: Option<String>,
}

#[post("/backend/post_post", data = "<post>")]
fn post_post(post: Json<UserPost>) {
    //Miles here
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![
            index,
            post_post,
        ])
}