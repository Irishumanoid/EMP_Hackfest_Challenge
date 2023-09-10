use std::{sync::{Mutex, Arc}, fs::{OpenOptions, File}, path::Path, io::Write};

use pic_handler::uploader;
use rocket::{serde::json::Json, http::{ContentType, Header}, fairing::{Fairing, Info, Kind}, Request, Response, fs::FileServer, State};
use serde::{Deserialize, Serialize};
use sightings::{Database, StaticDatabase};


mod pic_handler;
mod sightings;
mod macros;


#[macro_use]
extern crate rocket;

#[derive(Deserialize, Serialize)]
pub struct ClientUserPost {
    pub display_name: String,
    pub username: String,
    pub description: String,
    pub location: [f64; 2],
    pub tags: Vec<String>,
    pub price_rating: Vec<i32>,
    pub picture: Option<String>,
    pub score_cache : f64,
}

struct ServerState {
    database: Mutex<Database>,
}

impl ServerState {
    pub fn new() -> ServerState {
        ServerState { database: Mutex::new(Database::new()) }
    }
}

#[post("/post_post", data = "<post>")]
fn post_post(post: Json<ClientUserPost>, server_arc: &State<Arc<Mutex<ServerState>>>) -> (ContentType, String){
    let server = server_arc.lock().unwrap();
    server.database.lock().unwrap().add_submission(sightings::UserPost::new(post.0));
    let resp: &APIResponse<i32> = &APIResponse {success: true, error: None, data: None};
    let serialized_res = serde_json::to_string(&resp);
    
    return match serialized_res {
        Ok(posts_string) => {(ContentType::JSON, posts_string)},
        Err(e) => {println!("{e}"); return (ContentType::JSON, error_string("something was wrong on the server side".to_string()));}
    }
}

#[derive(Deserialize)]
pub struct GetPostFilters {
    location: [f64; 2],
    tag: Option<String>,
    max_price: i32,
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

#[options("/<_..>")]
fn all_options() {
    /* Intentionally left empty */
}


#[post["/get_posts", data = "<filters>"]]
fn get_posts(filters: Json<GetPostFilters>, server_arc: &State<Arc<Mutex<ServerState>>>) -> (ContentType, String) {
    let server = server_arc.lock().unwrap();
    let posts: Vec<ClientUserPost> = if filters.tag.is_some() {
        server.database.lock().unwrap().popular_posts(filters.0).iter().map(|entry| entry.lock().unwrap().post.clone().to_ClientUserPost()).collect()
    } else {
        server.database.lock().unwrap().data.iter().map(|entry| entry.lock().unwrap().post.clone().to_ClientUserPost()).collect()
        //TODO: No filter should still sort
    };
    let resp = &APIResponse {success: true, error: None, data: Some(posts)};
    let serialized_posts = serde_json::to_string(&resp);
    
    return match serialized_posts {
        Ok(posts_string) => {(ContentType::JSON, posts_string)},
        Err(e) => {println!("{e}"); return (ContentType::JSON, error_string("something was wrong on the server side".to_string()));}
    }
}

fn create_or_open_file(path: &str) -> Result<std::fs::File, std::io::Error> {
    return OpenOptions::new()
        .write(true)
        .create(!Path::new(path).exists())
        .truncate(true)
        .open(path);
}

#[rocket::main]
async fn main() {
    let server = if Path::new("db.json").exists() {
        let db_file = File::open(Path::new("db.json")).expect("eek!");
        let database: Database = Database::from_static(serde_json::from_reader::<_, StaticDatabase>(db_file).expect("oof not json"));
        Arc::new(Mutex::new(ServerState {database: Mutex::new(database)}))
    } else {
        Arc::new(Mutex::new(ServerState::new()))
    };
    let result = rocket::build()
        .manage(server.clone())
        .attach(CORS)
        .mount(
            "/backend/images",
            FileServer::from("images").rank(1),
        )
        .mount("/backend", routes![
            all_options,
            post_post,
            get_posts,
            uploader,
        ])
        .mount(
            "/",
            FileServer::from("../frontend/dist"),
        ).launch().await;
    match result {
        Ok(_val) => {}
        Err(e) => println!("{e}"),
    }
    let db_json = serde_json::to_string(&server.lock().unwrap().database.lock().unwrap().to_static());
    let db_file = create_or_open_file("db.json");
    if db_json.is_ok() && db_file.is_ok() {
        println!("{}", db_json.as_ref().unwrap().clone());
        db_file.unwrap().write_all(db_json.as_ref().unwrap().as_bytes()).expect("eek!");
        println!("saved database successfully")
    } else {
        if db_json.is_err() {
            println!("{}", db_json.unwrap_err());
        }
        if db_file.is_err() {
            println!("{}", db_file.unwrap_err());
        }
    }
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