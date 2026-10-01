import httpx

from supabase import create_client, Client

from app.core.config import settings


class SupabaseService:
    def __init__(self):
        if not settings.supabase_url:
            raise RuntimeError("SUPABASE_URL is not configured.")

        if not settings.supabase_key:
            raise RuntimeError("SUPABASE_KEY is not configured.")

        if not settings.supabase_service_role_key:
            raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is not configured.")

        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )

        self.admin_client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key
        )

    def get_user_client(self, access_token: str) -> Client:
        if not access_token:
            raise ValueError("Access token is required.")

        client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )

        client.postgrest.auth(access_token)

        return client

    def get_user_rest_headers(self, access_token: str) -> dict[str, str]:
        if not access_token:
            raise ValueError("Access token is required.")

        return {
            "apikey": settings.supabase_key,
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

    def get_rest_url(self, table: str) -> str:
        return f"{settings.supabase_url}/rest/v1/{table}"


supabase_service = SupabaseService()