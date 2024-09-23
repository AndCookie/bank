# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Install build-essential and MySQL development dependencies, including pkg-config
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    libssl-dev \
    pkg-config \
    gcc

# Set the working directory in the container
WORKDIR /app

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Copy the requirements file to the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Copy the .env file from EC2 root directory to the container (assuming .env is in /home/ubuntu/.env)
COPY /home/ubuntu/.env /app/.env

# Ensure environment variables from .env are loaded
RUN apt-get install -y python3-dotenv

# Load .env file for environment variables
ENV $(cat /app/.env | xargs)

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "manage:application"]
