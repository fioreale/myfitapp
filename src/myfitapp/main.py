from fastapi import FastAPI
from myfitapp.api.endpoints import router

app = FastAPI()

app.include_router(router)


@app.get("/")
async def root():
    return {"message": "MyFitApp API is running"}
