# ─── Stage :: Generating Requirements ─────────────────────────────────────────

FROM python:3.12 as requirements-stage
WORKDIR /tmp
RUN pip install poetry
COPY ./pyproject.toml ./poetry.lock* /tmp/
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# ─── Stage :: Final Deploy ────────────────────────────────────────────────────

FROM python:3.12-alpine as final-stage
WORKDIR /myFitApp
COPY --from=requirements-stage /tmp/requirements.txt /myFitApp/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /myFitApp/requirements.txt
COPY ./app /myFitApp/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
