from fastapi import FastAPI

app = FastAPI(
    title="InternPilot AI",
    description="AI-powered internship and career assistant",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to InternPilot AI!",
        "status": "Backend is running"
    }