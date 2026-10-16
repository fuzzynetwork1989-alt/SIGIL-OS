//! Testing, Validation, and Promotion Frameworks

pub mod validation;
pub mod promotion;

pub use validation::{Validator, ValidationResult};
pub use promotion::{PromotionPipeline, PromotionStage};
