#[macro_use]
extern crate rocket;

use std::env;

use elasticsearch::Elasticsearch;
use env_logger::DEFAULT_FILTER_ENV;
use rocket::State;

use crate::state::elastic::WithElastic;

/// Module that needs initialisation on startup and a living state.
mod state {
    pub(crate) mod elastic;
}
/// Module that needs initialisation on startup and a living state.
mod routes {
    pub(crate) mod create;
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[rocket::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    if env::var(DEFAULT_FILTER_ENV).is_err() {
        env::set_var(DEFAULT_FILTER_ENV, "info");
    }
    env_logger::init();

    let app_state = App::new().await;

    routes::create::create(&app_state.elasticsearch).await?;

    rocket::build()
        .mount("/", routes![index])
        .launch()
        .await
        .expect("Rocket is launching");

    Ok(())
}

struct App {
    elasticsearch: Elasticsearch,
}

type AppState<'a> = State<App>;

impl App {
    async fn new() -> Self {
        let elasticsearch = state::elastic::new().await;
        Self { elasticsearch }
    }
}

impl WithElastic for AppState<'_> {
    fn elasticsearch(&self) -> &Elasticsearch {
        &self.elasticsearch
    }
}
