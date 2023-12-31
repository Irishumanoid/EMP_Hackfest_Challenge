use futures::executor::block_on;
use rand::Rng;
use rocket::form::Form;
use rocket::fs::TempFile;
use rocket::http::ContentType;
use serde::Serialize;

use crate::{APIResponse, error_string};

extern crate rand;

//take pic (multipart form data), upload to server w/ name and make accessible, return url
#[derive(FromForm)]
pub struct Picture<'f> {
    extension: String,
    image: TempFile<'f>,
}

#[derive(Serialize)]
struct URLResponse {
    url: String,
}

#[post("/upload_image", format = "multipart/form-data", data = "<data>")]
pub fn uploader(mut data: Form<Picture<'_>>) -> (ContentType, String) {

    let mut rng = rand::thread_rng();
    let id = rng.gen::<u32>();

    let url = format!("https://chrissytopher.com/images/{}.{}", id, data.extension);
    let extension = data.extension.clone();
    block_on(save_image(&mut data.image, id, extension));
    let serialized_posts = serde_json::to_string(&APIResponse {success: true, error: None, data: Some(URLResponse {url})});
    return match serialized_posts {
        Ok(posts_string) => (ContentType::JSON, posts_string),
        Err(e) => {println!("{e}"); return (ContentType::JSON, error_string("something was wrong on the server side".to_string()));}
    }
}


async fn save_image<'f>(data: &mut TempFile<'f>, image_id: u32, image_ext: String) {
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