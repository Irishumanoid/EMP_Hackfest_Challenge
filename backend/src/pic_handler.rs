use futures::executor::block_on;
use rand::Rng;
use rocket::form::Form;
use rocket::fs::TempFile;
use rocket::http::ContentType;
use rocket::tokio::fs::File;
use std::fmt;

use crate::{APIResponse, error_string};

extern crate rand;

//take pic (multipart form data), upload to server w/ name and make accessible, return url
#[derive(FromForm)]
pub struct Picture<'f> {
    extension: String,
    image: TempFile<'f>,
}


#[derive(Debug)]
enum CustomError {
    FileNotFound(String),
    InvalidInput,
}

impl fmt::Display for CustomError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CustomError::FileNotFound(path) => write!(f, "File not found: {}", path),
            CustomError::InvalidInput => write!(f, "Invalid input"),
        }
    }
}

#[post("/image/upload_image", format = "multipart/data", data = "<data>")]
fn uploader(mut data: Form<Picture<'_>>) -> (ContentType, String) {

    let mut rng = rand::thread_rng();
    let id = rng.gen::<u32>();

    let url = format!("localhost:8000/image/{}.{}", id, data.extension);
    let extension = data.extension.clone();
    block_on(save_image(&mut data.image, url.clone(), extension));
    let serialized_posts = serde_json::to_string(&APIResponse {success: true, error: None, data: Some(format!("{{url:\"{}\"}}", url))});
    return match serialized_posts {
        Ok(posts_string) => (ContentType::JSON, posts_string),
        Err(e) => {println!("{e}"); return (ContentType::JSON, error_string("something was wrong on the server side".to_string()));}
    }
}


async fn save_image<'f>(data: &mut TempFile<'f>, image_id: String, image_ext: String) {
    println!("copying to images/{}", image_id);
    match data.move_copy_to(format!("./images/{}.{}", image_id, image_ext)).await {
        Ok(()) => {
            println!("saved image")
        }
        Err(e) => {
            println!("error saving image {e}")
        }
    };
}


#[get("/image/get_image/<id>")]
async fn get_image(id: String) -> Option<File> {
    let filename = format!("localhost:8000/image/{}", id);
    File::open(&filename).await.ok()
}