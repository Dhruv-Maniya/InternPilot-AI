from fastapi import FastAPI

from app.api.routes.internships import router as internships_router
from app.api.routes.learning import router as learning_router
from app.api.routes.aptitude import router as aptitude_router
from app.api.routes.resume import router as resume_router
from app.api.routes.interview import router as interview_router
from app.api.routes.watchlist import router as watchlist_router
from app.api.routes.applications import router as applications_router
from app.api.routes.notifications import router as notifications_router
from app.api.routes.auth import router as auth_router

app = FastAPI(
    title="InternPilot AI",
    description="AI-powered internship and career assistant",
    version="1.0.0"
)


app.include_router(internships_router)
app.include_router(learning_router)
app.include_router(aptitude_router)
app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(watchlist_router)
app.include_router(applications_router)
app.include_router(notifications_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to InternPilot AI!",
        "status": "Backend is running"
    }