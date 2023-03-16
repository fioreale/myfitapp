# Set the base image
FROM python:3.8.16-alpine3.17

# Installing cargo, the package manager for Rust
RUN curl https://sh.rustup.rs -sSf | sh

# Set the working directory
WORKDIR /myFitApp

# Copy the rest of the application files to the container
COPY ./app /myFitApp/app

COPY ./requirements.txt /myFitApp/requirements.txt

# Install the required packages
RUN pip install --no-cache-dir --upgrade -r /myFitApp/requirements.txt

# Start the app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
 