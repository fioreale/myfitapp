# Set the base image
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8-slim

# Set the working directory
WORKDIR /myFitApp

# Copy the rest of the application files to the container
COPY ./app /myFitApp/app

COPY ./requirements.txt /myFitApp/requirements.txt

# Install the required packages
RUN pip install --no-cache-dir --upgrade -r /myFitApp/requirements.txt

# Expose the port that the app will run on
# EXPOSE 80

# Start the app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
