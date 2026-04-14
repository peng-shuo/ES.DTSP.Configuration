#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

pub mod controllers;
pub mod handlers;
pub mod services;
pub mod models;
pub mod types;
pub mod db;
pub mod repositories;
