from fastapi import FastAPI, Query, HTTPException
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import schemas
from database import db, check_connection, properties_collection

app = FastAPI(title="Roof Hunt API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Verify MongoDB connection on startup"""
    check_connection()

@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Roof Hunt Backend API is running", "status": "healthy"}

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

@app.get("/properties/", response_model=List[schemas.Property], tags=["Properties"])
def read_properties(
    city: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
):
    """
    Get properties with optional filters:
    - city: Filter by city name
    - type: Filter by property type
    - property_type: Filter by property type
    - min_price: Minimum price filter
    - max_price: Maximum price filter
    """
    query = {}
    
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if type:
        query["type"] = type
    if property_type:
        query["property_type"] = property_type
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in query:
            query["price"]["$lte"] = max_price
        else:
            query["price"] = {"$lte": max_price}
    
    properties = list(properties_collection.find(query))
    
    # Convert ObjectId to string for JSON serialization
    for prop in properties:
        prop["_id"] = str(prop["_id"])
    
    return properties

@app.get("/properties/{property_id}", response_model=schemas.Property, tags=["Properties"])
def read_property(property_id: str):
    """Get a specific property by ID"""
    try:
        property_data = properties_collection.find_one({"_id": ObjectId(property_id)})
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")
        property_data["_id"] = str(property_data["_id"])
        return property_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/properties/", response_model=dict, tags=["Properties"])
def create_property(property: schemas.PropertyCreate):
    """Create a new property"""
    property_dict = property.dict()
    result = properties_collection.insert_one(property_dict)
    return {"_id": str(result.inserted_id), "message": "Property created successfully"}

@app.put("/properties/{property_id}", response_model=dict, tags=["Properties"])
def update_property(property_id: str, property: schemas.PropertyCreate):
    """Update an existing property"""
    try:
        result = properties_collection.update_one(
            {"_id": ObjectId(property_id)},
            {"$set": property.dict()}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Property not found")
        return {"message": "Property updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/properties/{property_id}", tags=["Properties"])
def delete_property(property_id: str):
    """Delete a property"""
    try:
        result = properties_collection.delete_one({"_id": ObjectId(property_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Property not found")
        return {"message": "Property deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
