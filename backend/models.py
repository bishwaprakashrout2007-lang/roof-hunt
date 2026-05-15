from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Property(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    description: str
    city: str
    price: int
    type: str
    property_type: str
    bedrooms: int
    bathrooms: int
    area_sqft: int
    image_url: str

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str
        }
