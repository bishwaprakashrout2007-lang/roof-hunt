from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class PropertyBase(BaseModel):
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

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: Optional[str] = Field(None, alias="_id")
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str
        }

    class Config:
        orm_mode = True
