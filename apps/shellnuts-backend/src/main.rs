#[macro_use]
extern crate rocket;

use elasticsearch::Elasticsearch;
use env_logger::DEFAULT_FILTER_ENV;
use rocket::{State};
use std::env;

use crate::elastic::elastic::WithElastic;

/// Module that needs initialisation on startup and a living state.
mod elastic {
  pub(crate) mod elastic;
}

#[get("/")]
fn index() -> &'static str {
  "Hello, world!"
}

#[rocket::main]
async fn main() {
  if env::var(DEFAULT_FILTER_ENV).is_err() {
    env::set_var(DEFAULT_FILTER_ENV, "info");
  }
  env_logger::init();

  let app_state = App::new().await;

  rocket::build()
    .manage(app_state)
    .mount("/", routes![index])
    .launch()
    .await
    .expect("Rocket is launching")
}

struct App {
  elasticsearch: Elasticsearch,
}

type AppState<'a> = State<App>;

impl App {
  async fn new() -> Self {
    let elasticsearch = elastic::elastic::new().await;

    Self { elasticsearch }
  }
}

impl WithElastic for AppState<'_> {
  fn elasticsearch(&self) -> &Elasticsearch {
    &self.elasticsearch
  }
}
