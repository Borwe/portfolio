use axum::{Router, response::Html, routing::get};

async fn index()-> Html<&'static str> {
    Html("<h3>YOLO</h3>")
}

#[tokio::main]
async fn main() {
    let router = Router::new().route("/", get(index));
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080").await.unwrap();
    axum::serve(listener, router).await.unwrap();
}
