# Set the base image
FROM python:3.8.16-slim

# installing gcc and c compilers for fastapi installation
RUN apt-get update -y && apt-get install build-essential -y && pip install Cython

# Set the working directory
WORKDIR /myFitApp

# Copy the rest of the application files to the container
COPY ./app /myFitApp/app

COPY ./requirements.txt /myFitApp/requirements.txt

# Install the required packages
RUN pip install --no-cache-dir --upgrade -r /myFitApp/requirements.txt

# Start the app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
