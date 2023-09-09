async function upload() {
    console.log(document.getElementById("upload-pfp-button"));
    let image = document.getElementById("upload-pfp-button").files[0];
    const formData = new FormData();
    formData.append('image', image);
    formData.append('extension', "png");
    let image_url = (await (await fetch("https://chrissytopher.com:8000/backend/upload_image/", {
        method: 'POST',
        body: formData,
        // If you add this, upload won't work
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // }
    })).json()).data.url;
    let image_element = document.createElement("img");
    document.body.appendChild(image_element);
    image_element.src = image_url;
}