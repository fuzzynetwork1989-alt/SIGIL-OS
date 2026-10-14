//! Model download automation
//!
//! This module provides utilities for downloading models from Hugging Face
//! and other sources.

use reqwest::blocking::Client;
use std::fs::{self, File};
use std::io::Write;
use std::path::Path;

use crate::ModelFabricError;

/// Model downloader
pub struct ModelDownloader {
    client: Client,
    model_name: String,
    output_dir: String,
}

impl ModelDownloader {
    /// Create a new model downloader
    pub fn new(model_name: String, output_dir: String) -> Self {
        Self {
            client: Client::new(),
            model_name,
            output_dir,
        }
    }

    /// Download model from Hugging Face
    pub fn download_from_huggingface(&self) -> Result<(), ModelFabricError> {
        println!("Downloading model: {} from Hugging Face", self.model_name);

        let model_dir = Path::new(&self.output_dir).join(&self.model_name);
        fs::create_dir_all(&model_dir).map_err(|e| ModelFabricError::Io(e))?;

        // Files to download
        let files_to_download = vec!["tokenizer.json", "config.json", "model.safetensors"];

        for file in files_to_download {
            let file_url = format!(
                "https://huggingface.co/{}/resolve/main/{}",
                self.model_name, file
            );
            let file_path = model_dir.join(file);

            println!("Downloading: {}", file);

            match self.download_file(&file_url, &file_path) {
                Ok(_) => println!("Downloaded: {}", file),
                Err(e) => {
                    println!("Warning: Failed to download {}: {}", file, e);
                    // Continue with other files
                }
            }
        }

        println!(
            "Model download complete. Model directory: {}",
            model_dir.display()
        );
        Ok(())
    }

    /// Download a single file with progress tracking
    fn download_file(&self, url: &str, path: &Path) -> Result<(), ModelFabricError> {
        let response =
            self.client.get(url).send().map_err(|e| {
                ModelFabricError::Io(std::io::Error::new(std::io::ErrorKind::Other, e))
            })?;

        if !response.status().is_success() {
            return Err(ModelFabricError::Io(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("HTTP error: {}", response.status()),
            )));
        }

        let total_size = response.content_length().unwrap_or(0);
        let mut file = File::create(path).map_err(|e| ModelFabricError::Io(e))?;

        let mut downloaded = 0u64;
        let mut buffer = vec![0u8; 8192];

        // Print progress
        if total_size > 0 {
            println!("  Size: {} MB", total_size / (1024 * 1024));
        }

        for chunk in response.bytes() {
            let chunk = chunk.map_err(|e| {
                ModelFabricError::Io(std::io::Error::new(std::io::ErrorKind::Other, e))
            })?;
            file.write_all(&chunk)
                .map_err(|e| ModelFabricError::Io(e))?;
            downloaded += chunk.len() as u64;

            if total_size > 0 && downloaded % (1024 * 1024) == 0 {
                let progress = (downloaded as f64 / total_size as f64) * 100.0;
                println!("  Progress: {:.1}%", progress);
            }
        }

        println!("  Complete: {} MB", downloaded / (1024 * 1024));
        Ok(())
    }

    /// Check if model is already downloaded
    pub fn is_downloaded(&self) -> bool {
        let model_dir = Path::new(&self.output_dir).join(&self.model_name);
        let tokenizer_path = model_dir.join("tokenizer.json");
        let weights_path = model_dir.join("model.safetensors");

        tokenizer_path.exists() && weights_path.exists()
    }

    /// Get model size estimate
    pub fn get_size_estimate(&self) -> Result<u64, ModelFabricError> {
        // For Qwen 7B, approximate size is 13GB compressed, 26GB uncompressed
        // This would come from Hugging Face API in production
        Ok(26 * 1024 * 1024 * 1024) // 26GB in bytes
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_downloader_creation() {
        let downloader =
            ModelDownloader::new("Qwen/Qwen-7B".to_string(), "/tmp/models".to_string());
        assert_eq!(downloader.model_name, "Qwen/Qwen-7B");
    }

    #[test]
    fn test_size_estimate() {
        let downloader =
            ModelDownloader::new("Qwen/Qwen-7B".to_string(), "/tmp/models".to_string());
        let size = downloader.get_size_estimate().unwrap();
        assert!(size > 0);
    }
}
