use pic_handler::uploader;
use rocket::{serde::json::Json, http::{ContentType, Header}, fairing::{Fairing, Info, Kind}, Request, Response};
use serde::{Deserialize, Serialize};


mod pic_handler;
mod sightings;
mod macros;

#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Landing page"
}


#[derive(Deserialize, Serialize)]
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

#[derive(Deserialize)]
struct GetPostFilters {
    location: [f32; 2],
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

#[options("/<_..>")]
fn all_options() {
    /* Intentionally left empty */
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(CORS)
        .mount("/", routes![
            all_options,
            index,
            post_post,
            get_posts,
            uploader,
        ])
}

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        if let Some(hostname) = request.headers().get_one("origin") {
            if hostname.contains("http://localhost:") || hostname.contains("https://localhost:")
            {
                response.set_header(Header::new("Access-Control-Allow-Origin", hostname));
            }
        } else {
            response.set_header(Header::new("Access-Control-Allow-Origin", "nothing lmao"));
        }
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}