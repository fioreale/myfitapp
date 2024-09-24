from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from myfitapp.api.endpoints import router

app = FastAPI()
app.include_router(router)


current_dir = os.path.dirname(os.path.abspath(__file__))
public_dir = os.path.join(current_dir, "public")

app.mount("/", StaticFiles(directory=public_dir, html=True))
