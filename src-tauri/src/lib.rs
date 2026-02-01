// LoopLab Desktop App - Tauri Entry Point
// Embeds the Rust backend and Python AI pipeline

use std::process::Command;
use tauri::{Manager, Emitter, Listener};
use tauri_plugin_shell::ShellExt;

#[derive(serde::Serialize, serde::Deserialize, Clone)]
struct AuthTokens {
    access_token: String,
    refresh_token: String,
    expires_at: i64,
}

#[tauri::command]
async fn store_auth_tokens(
    app: tauri::AppHandle,
    access_token: String,
    refresh_token: String,
    expires_at: i64,
) -> Result<(), String> {
    // Store in secure storage (Phase 4)
    // For now just logging
    tracing::info!("Storing auth tokens: access_token=..., refresh_token=..., expires_at={}", expires_at);
    
    // Emit event to frontend
    app.emit("auth-state-changed", "authenticated")
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn get_auth_tokens(app: tauri::AppHandle) -> Result<Option<AuthTokens>, String> {
    // Retrieve from secure storage (Phase 4)
    Ok(None)
}

#[tauri::command]
async fn clear_auth_tokens(app: tauri::AppHandle) -> Result<(), String> {
    // Clear from secure storage (Phase 4)
    app.emit("auth-state-changed", "unauthenticated")
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn open_auth_in_browser(app: tauri::AppHandle) -> Result<(), String> {
    let url = "http://localhost:8080/auth?flow=desktop";
    app.shell().open(url, None).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        store_auth_tokens,
        get_auth_tokens,
        clear_auth_tokens,
        open_auth_in_browser,
    ])
    .setup(|app| {
      #[cfg(desktop)]
      app.handle().plugin(tauri_plugin_deep_link::init())?;
      app.handle().plugin(tauri_plugin_shell::init())?;
      app.handle().plugin(tauri_plugin_fs::init())?;

      // Handle deep links checks
      #[cfg(desktop)]
      // Handle deep links checks
      #[cfg(desktop)]
      {
          let handle = app.handle().clone();
          app.listen("deep-link://new-url", move |event| {
              tracing::info!("Deep link received: {:?}", event.payload());
              let payload = event.payload();
              if payload.contains("access_token=") {
                  let _ = handle.emit("auth-deep-link-received", payload);
              }
          });
      }
      // Setup logging plugin
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Start embedded backend in background thread
      tracing::info!("Starting embedded backend...");
      tauri::async_runtime::spawn(async move {
        // Start Python Sidecar
        // Note: The binary name in config is "looplab-ai-pipeline", Tauri adds suffix automatically
        let mut child = Command::new("looplab-ai-pipeline")
            .spawn()
            .expect("Failed to spawn python sidecar");

        tracing::info!("Python sidecar spawned with PID: {}", child.id());

        // Log output from sidecar
        tauri::async_runtime::spawn(async move {
            if let Err(e) = child.wait() {
                tracing::error!("Python sidecar error: {}", e);
            }
        });

        // Start Rust Backend
        if let Err(e) = start_backend().await {
          eprintln!("Failed to start backend: {}", e);
        }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

/// Start the embedded Rust backend
async fn start_backend() -> Result<(), Box<dyn std::error::Error>> {
  // Set default environment variables for development if missing
  set_dev_env();

  // Initialize backend and get router
  let (app, _state) = looplab_backend::init_server().await?;
  
  // Start server on localhost:3000
  let addr = "127.0.0.1:3000";
  tracing::info!("Embedded backend listening on {}", addr);
  
  let listener = tokio::net::TcpListener::bind(addr).await?;
  axum::serve(listener, app).await?;
  
  Ok(())
}

fn set_dev_env() {
    // Database URL (default to localhost if not set)
    if std::env::var("DATABASE_URL").is_err() {
        std::env::set_var("DATABASE_URL", "postgres://looplab_user:123456@localhost:5432/looplab");
        tracing::info!("Setting default DATABASE_URL");
    }

    // Server Port (for config consistency)
    if std::env::var("SERVER_PORT").is_err() {
        std::env::set_var("SERVER_PORT", "3000");
    }

    // JWT Secret (dev only)
    if std::env::var("JWT_SECRET").is_err() {
        std::env::set_var("JWT_SECRET", "dev-secret-key-change-in-prod");
    }

    // Google Auth (placeholders to prevent startup panic)
    if std::env::var("GOOGLE_CLIENT_ID").is_err() {
        std::env::set_var("GOOGLE_CLIENT_ID", "placeholder-client-id");
        std::env::set_var("GOOGLE_CLIENT_SECRET", "placeholder-client-secret");
        std::env::set_var("GOOGLE_REDIRECT_URL", "http://localhost:8080/auth/google/callback");
    }

    // GitHub Auth
    if std::env::var("GITHUB_CLIENT_ID").is_err() {
        std::env::set_var("GITHUB_CLIENT_ID", "placeholder-github-id");
        std::env::set_var("GITHUB_CLIENT_SECRET", "placeholder-github-secret");
        std::env::set_var("GITHUB_REDIRECT_URL", "http://localhost:8080/auth/github/callback");
    }

    // Stripe
    if std::env::var("STRIPE_SECRET_KEY").is_err() {
        std::env::set_var("STRIPE_SECRET_KEY", "sk_test_placeholder");
        std::env::set_var("STRIPE_WEBHOOK_SECRET", "whsec_placeholder");
    }
}
