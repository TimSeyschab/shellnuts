use elasticsearch::http::StatusCode;
use elasticsearch::indices::{IndicesCreateParts, IndicesExistsParts};
use elasticsearch::Elasticsearch;
use serde_json::json;

pub(crate) async fn create(elastic: &Elasticsearch) -> Result<(), Box<dyn std::error::Error>> {
    let index_name = "rezepte";
    let response = elastic
        .indices()
        .exists(IndicesExistsParts::Index(&[index_name]))
        .send()
        .await?;

    if response.status_code() == StatusCode::NOT_FOUND {
        let create_index_response = elastic
            .indices()
            .create(IndicesCreateParts::Index(index_name))
            .include_type_name(true)
            .body(json!({
              "settings": {
                "index": {
                  "number_of_shards": 1,
                  "number_of_replicas": 1
                }
              },
                "mappings" : {
                  "rezepte": {
                    "properties" : {
                      "dauer" : { "type" : "short" },
                      "personen" : { "type" : "short" },
                      "quelle" : { "type" : "string" },
                      "titel" : { "type" : "string" },
                      "kategorie" : { "type" : "keyword" },
                      "zutaten" : {
                        "type" : "nested",
                        "properties" : {
                          "zutat":     { "type": "keyword"   },
                          "einheit":   { "type": "keyword"   },
                          "menge":    { "type": "short"    }
                        }
                      },
                      "zubereitung" : { "type" : "text" },
                    }
                  }
                }
            }))
            .send()
            .await?;

        if !create_index_response.status_code().is_success() {
            panic!("create index failed");
        }
    }
    info!("Index vorhanden");
    Ok(())
}
