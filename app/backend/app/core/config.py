from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    app_name: str = "InternPilot AI"
    app_version: str = "1.0.0"
    debug: bool = True

    # SerpApi
    serpapi_api_key: str = ""

    # OpenAI
    openai_api_key: str = ""

    # Gemini
    gemini_api_key: str = ""

    # Supabase
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_role_key: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()