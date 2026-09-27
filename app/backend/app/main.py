from fastapi import FastAPI

from app.api.routes.internships import router as internships_router


app = FastAPI(
    title="InternPilot AI",
    description="AI-powered internship and career assistant",
    version="1.0.0"
)


app.include_router(internships_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to InternPilot AI!",
        "status": "Backend is running"
    }