from pydantic import BaseModel
from typing import Optional


class Internship(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = None
    url: Optional[str] = None