from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.get("/me")
def get_me(
    user=Depends(get_current_user)
):
    return {
        "id": str(user.id),
        "email": user.email
    }