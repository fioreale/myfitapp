import uvicorn
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from .api.endpoints import router

app = FastAPI()
app.include_router(router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"message": "Data validation failed", "detail": exc.errors()},
    )


app.mount("/", StaticFiles(directory="app/public", html=True))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
