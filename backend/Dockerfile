FROM python:3.11-slim

# working directory
WORKDIR /app

# system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# project files
COPY . .

# port
EXPOSE 8000

# run migrations then start gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn audit_project.wsgi:application --bind 0.0.0.0:8000"]
