from supabase import create_client, Client

from app.core.config import settings


class SupabaseService:
    def __init__(self):
        if not settings.supabase_url:
            raise RuntimeError("SUPABASE_URL is not configured.")

        if not settings.supabase_key:
            raise RuntimeError("SUPABASE_KEY is not configured.")

        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )


supabase_service = SupabaseService()