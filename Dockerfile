# Build stage
FROM python:3.9-slim AS build

RUN apt-get update && apt-get install -y build-essential

WORKDIR /myFitApp

COPY ./app /myFitApp/app
COPY ./requirements.txt /myFitApp/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /myFitApp/requirements.txt

# Production stage
FROM python:3.9-alpine

WORKDIR /myFitApp

COPY --from=build /myFitApp /myFitApp

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

