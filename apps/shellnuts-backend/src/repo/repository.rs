use elasticsearch::cat::CatCountParts;
use elasticsearch::{
    http::response::Response as EsResponse, CountParts, Error as EsError, GetParts::IndexTypeId,
    SearchParts::Index,
};
use rocket::{
    catch,
    http::Status,
    response,
    response::{status::Custom, Responder, Response},
    Error, Request,
};
use rocket_contrib::json::Json;
use serde::{Deserialize, Serialize};
use validator::ValidationErrors;

use crate::state::elastic::WithElastic;
use rocket::futures::io::Cursor;

pub(crate) struct ElasticRepository<'a, S: WithElastic>(pub(crate) &'a S);

impl<S: WithElastic> ElasticRepository<'_, S> {
    pub(crate) async fn get_count(&self) -> HandlerResult<String> {
        let es = self.0.elasticsearch();
        let response = es
            .cat()
            .count(CatCountParts::Index(&[self.0.index()]))
            .send()
            .await?;
        let response = self.logged_error_for_status(response).await?;
        let response_body = response.json::<String>().await?;
        debug!("Elasticsearch response body: {:?}.", response_body);

        Ok(response_body)
    }

    async fn logged_error_for_status(&self, response: EsResponse) -> Result<EsResponse, EsError> {
        match response.error_for_status_code_ref() {
            Ok(_) => Ok(response),
            Err(e) => {
                let resp_text = response.text().await.unwrap_or_default();
                error!("Elasticsearch: {}. \nresponse: {}", e, resp_text);
                Err(e)
            }
        }
    }
}

#[derive(Debug, Deserialize)]
struct SearchResponse<T> {
    hits: HitsResponse<T>,
}

#[derive(Debug, Deserialize)]
struct HitsResponse<T> {
    hits: Vec<Hit<T>>,
}

#[derive(Debug, Deserialize)]
struct Hit<T> {
    _source: T,
}

/// Convenience alias for [Result] whose error is [ErrorResponse], to be used by supportive code.
pub(crate) type HandlerResult<T> = Result<T, ErrorResponse>;

/// Result type to be used by endpoints. Either OK [Json] or error [ErrorResponse].
pub(crate) type JsonResult<T> = HandlerResult<Json<T>>;

/// Possible error endpoint responses.
#[derive(Debug, thiserror::Error)]
pub(crate) enum ErrorResponse {
    /// HTTP 400 Bad Request: client sent something wrong.
    #[error("Bad Request: {0}")]
    BadRequest(String),
    /// HTTP 404 Not Found: this path or entity does not exist.
    #[error("Not Found: {0}")]
    NotFound(String),
    /// HTTP 500 Internal Server Error: something went real wrong on the server.
    #[error("Internal Server Error: {0}")]
    InternalServerError(String),
}

/// Make Rocket understand our error responses.
impl<'r, 'o: 'r> Responder<'r, 'o> for ErrorResponse {
    fn respond_to(self, req: &'r Request<'_>) -> response::Result<'o> {
        let http_status = match self {
            Self::BadRequest(_) => Status::BadRequest,
            Self::NotFound(_) => Status::NotFound,
            Self::InternalServerError(_) => Status::InternalServerError,
        };

        #[derive(Serialize, Async)]
        struct ErrorPayload {
            message: String,
        }

        let payload = ErrorPayload {
            message: self.to_string(),
        };
        let bod = Json(payload);

        Response::build()
            .status(http_status)
            .sized_body(None, Cursor::new(bod))
            .ok()
    }
}

/// Convert Elasticsearch errors into internal server errors.
impl From<elasticsearch::Error> for ErrorResponse {
    fn from(err: elasticsearch::Error) -> Self {
        Self::InternalServerError(format!("Elasticsearch error: {}", err))
    }
}

/// Convert from [validator] errors into bad requests.
impl From<ValidationErrors> for ErrorResponse {
    fn from(err: ValidationErrors) -> Self {
        Self::BadRequest(err.to_string())
    }
}

impl<'f> From<Error> for ErrorResponse {
    fn from(err: Error) -> Self {
        Self::BadRequest(format!("{:?}", err))
    }
}

#[catch(404)]
pub(crate) fn not_found(req: &Request<'_>) -> ErrorResponse {
    ErrorResponse::NotFound(req.uri().to_string())
}

#[catch(500)]
pub(crate) fn internal_server_error() -> ErrorResponse {
    ErrorResponse::InternalServerError("Something went wrong.".into())
}
