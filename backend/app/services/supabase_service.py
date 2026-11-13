import logging
from typing import Optional, List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

# In-memory storage fallback for guest mode / when Supabase keys are not provided
_local_report_store: Dict[str, Dict[str, Any]] = {}

supabase_client = None

if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase_client: Optional[Client] = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not initialize Supabase client: {e}. Falling back to local storage.")
        supabase_client = None
else:
    logger.info("Supabase URL or Key not set. Running in local/guest storage mode.")

async def save_report_record(report_data: Dict[str, Any], user_id: Optional[str] = None) -> bool:
    """
    Saves an analyzed report to Supabase (if configured) or in-memory fallback.
    """
    report_id = report_data.get("id")
    if not report_id:
        return False
        
    # Always save to local store for fast retrieval
    _local_report_store[report_id] = {**report_data, "user_id": user_id}

    if supabase_client:
        try:
            payload = {
                "id": report_id,
                "title": report_data.get("report_title"),
                "overall_status": report_data.get("overall_status"),
                "summary": report_data.get("patient_summary"),
                "data": report_data,
                "user_id": user_id,
            }
            supabase_client.table("reports").insert(payload).execute()
            return True
        except Exception as e:
            logger.warning(f"Failed to persist report to Supabase: {e}")
            return False
            
    return True

async def fetch_user_reports(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetch past reports for the authenticated user, or recent guest session reports.
    """
    if supabase_client and user_id:
        try:
            response = supabase_client.table("reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return [row.get("data") for row in response.data if "data" in row]
        except Exception as e:
            logger.warning(f"Failed to fetch reports from Supabase: {e}")
            
    # Return local in-memory records
    if user_id:
        return [r for r in _local_report_store.values() if r.get("user_id") == user_id]
    return list(_local_report_store.values())

async def fetch_report_by_id(report_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch a single report by ID.
    """
    if report_id in _local_report_store:
        return _local_report_store[report_id]
        
    if supabase_client:
        try:
            response = supabase_client.table("reports").select("*").eq("id", report_id).limit(1).execute()
            if response.data:
                return response.data[0].get("data")
        except Exception as e:
            logger.warning(f"Failed to fetch report from Supabase: {e}")
            
    return None
