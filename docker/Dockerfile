FROM python:3.12.5-slim

RUN pip install --no-cache-dir uv

WORKDIR /app
COPY requirements.lock ./
RUN uv pip install --no-cache --system -r requirements.lock

COPY src .

CMD ["uvicorn", "myfitapp.main:app", "--host", "0.0.0.0", "--port", "8000"]
