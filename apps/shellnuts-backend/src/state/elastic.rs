use elasticsearch::{http::transport::Transport, Elasticsearch};
use log::info;

pub(crate) trait WithElastic {
    fn elasticsearch(&self) -> &Elasticsearch;
    fn index(&self) -> &str;
}

///
/// # Panics
///
/// Panics if it cannot reach elastic search
pub(crate) async fn new() -> Elasticsearch {
    let es_url = "http://localhost:9200/";
    let es_transport = Transport::single_node(&es_url).unwrap();
    let elasticsearch = Elasticsearch::new(es_transport);
    let es_result = elasticsearch.ping().send().await;
    let es_resp = es_result
        .map_err(|e| format!("Cannot ping Elasticsearch: {}.", e))
        .unwrap();
    info!("Elasticsearch ping status: {}.", es_resp.status_code());

    elasticsearch
}
