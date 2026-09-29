from fastapi import FastAPI

from app.api.routes.internships import router as internships_router
from app.api.routes.learning import router as learning_router
from app.api.routes.aptitude import router as aptitude_router
from app.api.routes.resume import router as resume_router

app = FastAPI(
    title="InternPilot AI",
    description="AI-powered internship and career assistant",
    version="1.0.0"
)


app.include_router(internships_router)
app.include_router(learning_router)
app.include_router(aptitude_router)
app.include_router(resume_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to InternPilot AI!",
        "status": "Backend is running"
    }