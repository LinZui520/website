extern crate lazy_static;

use actix_web::web::Bytes;
use actix_web::{post, App, HttpRequest, HttpResponse, HttpServer, Responder};
use hex;
use hmac::{Hmac, KeyInit, Mac};
use lazy_static::lazy_static;
use regex::Regex;
use serde_json::json;
use sha2::Sha256;
use std::fs;
use std::process::Command;
use std::sync::{Condvar, Mutex};
use std::thread;
use std::thread::sleep;

lazy_static! {
    static ref COUNT: Mutex<i32> = Mutex::new(0);
    static ref CONDVAR: Condvar = Condvar::new();
}

#[post("/api/github/webhook")]
async fn handle_webhook(req: HttpRequest, body: Bytes) -> impl Responder {
    let secret = &Regex::new(r#"GITHUB_WEBHOOK_SECRET="([^"]*)""#)
        .unwrap()
        .captures(&fs::read_to_string("/root/website/nextjs/.env").unwrap())
        .unwrap()[1]
        .to_string();

    let signature = req
        .headers()
        .get("X-Hub-Signature-256")
        .unwrap()
        .to_str()
        .unwrap();

    let mac = (|mac: Hmac<Sha256>| {
        move |data: &[u8]| -> Hmac<Sha256> {
            let mut instance = mac.clone();
            instance.update(data);
            instance
        }
    })(Hmac::<Sha256>::new_from_slice(secret.as_bytes()).unwrap())(&body);

    let digest = "sha256=".to_owned() + &hex::encode(mac.finalize().into_bytes());

    if signature != digest {
        return HttpResponse::Forbidden().json(json!({
            "code": 400,
            "data": null,
            "message": "error"
        }));
    }

    let mut count = COUNT.lock().unwrap();
    *count += 5;
    CONDVAR.notify_one();

    HttpResponse::Ok().json(json!({
        "code": 200,
        "data": null,
        "message": "success"
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    thread::spawn(|| loop {
        {
            let _count = CONDVAR.wait(COUNT.lock().unwrap()).unwrap();
        }
        while { *COUNT.lock().unwrap() } > 0 {
            let output = Command::new("sh")
                .arg("-c")
                .arg("cd /root/website && /bin/sh scripts/restart.sh")
                .output()
                .expect("脚本执行失败");

            if output.status.success() {
                let mut count = COUNT.lock().unwrap();
                *count = 0;
            } else {
                sleep(std::time::Duration::from_secs(60));
                let mut count = COUNT.lock().unwrap();
                *count -= 1;
            }
        }
    });

    HttpServer::new(|| App::new().service(handle_webhook))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
