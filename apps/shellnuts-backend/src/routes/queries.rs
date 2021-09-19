#[get("/count")]
fn count(app: AppState<'_>) -> u32 {
    let locations_es_repo = ElasticRepository(&app);
    "Hello, world!"
}
