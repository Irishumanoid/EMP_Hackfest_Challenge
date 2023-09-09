use rocket::{serde::json::Json, http::ContentType};
use serde::{Deserialize, Serialize};

mod sightings;
mod macros;

use sightings::UserPost;

#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[post("/backend/post_post", data = "<post>")]
fn post_post(post: Json<UserPost>) {
    //Miles here
}

#[derive(Deserialize)]
struct GetPostFilters {
    location: [f32; 2],
    location_range: f32,
    tags: Vec<String>,
    price_range: i32,
}

#[derive(Serialize)]
struct APIResponse<T> {
    success: bool,
    error: Option<String>,
    data: Option<T>,
}

pub fn error_string(message: String) -> String {
    return format!("{{\"success\":true, \"error\": \"{message}\"}}");
}

pub fn sort_ports() -> Vec<UserPost> {
    todo!();
}

#[post["/backend/get_posts", data = "<filters>"]]
fn get_posts(filters: Json<GetPostFilters>) -> (ContentType, String) {
    let posts = sort_ports();

    let serialized_posts = serde_json::to_string(&APIResponse {success: true, error: None, data: Some(posts)});
    return match serialized_posts {
        Ok(posts_string) => (ContentType::JSON, posts_string),
        Err(e) => {println!("{e}"); return (ContentType::JSON, error_string("something was wrong on the server side".to_string()));}
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![
            index,
            post_post,
            get_posts,
        ])
}