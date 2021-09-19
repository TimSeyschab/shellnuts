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
mod utils {
    pub(crate) mod create;
}

/// Module that needs initialisation on startup and a living state.
mod repo {
    pub(crate) mod repository;
}

#[rocket::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    if env::var(DEFAULT_FILTER_ENV).is_err() {
        env::set_var(DEFAULT_FILTER_ENV, "info");
    }
    env_logger::init();

    let app_state = App::new().await;

    utils::create::create(&app_state.elasticsearch).await?;

    rocket::build()
        .mount("/", routes![index])
        .launch()
        .await
        .expect("Rocket is launching");

    Ok(())
}

struct App {
    elasticsearch: Elasticsearch,
    index: &'static str,
}

type AppState<'a> = State<App>;

impl App {
    async fn new() -> Self {
        let elasticsearch = state::elastic::new().await;
        Self {
            elasticsearch,
            index: "rezept",
        }
    }
}

impl WithElastic for AppState<'_> {
    fn elasticsearch(&self) -> &Elasticsearch {
        &self.elasticsearch
    }
    fn index(&self) -> &str {
        &self.index
    }
}
