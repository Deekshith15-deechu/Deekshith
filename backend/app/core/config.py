import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "ReportSaathi API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    GEMINI_API_KEY: str = Field(default="", env="GEMINI_API_KEY")
    DEMO_MODE: bool = Field(default=True, env="DEMO_MODE")

    SUPABASE_URL: str = Field(default="", env="SUPABASE_URL")
    SUPABASE_KEY: str = Field(default="", env="SUPABASE_KEY")

    TESSERACT_CMD: str = Field(default="", env="TESSERACT_CMD")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
