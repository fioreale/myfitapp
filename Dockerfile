FROM python:3.9-slim

# ─── Gcc And C Compilers For Fastapi Installation ─────────────────────────────

RUN apt-get update -y && apt-get install build-essential -y && pip install Cython

WORKDIR /myFitApp

COPY ./app ./app
COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r /myFitApp/requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
