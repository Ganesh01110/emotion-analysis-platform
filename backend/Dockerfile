# Multi-stage build for optimized Python backend
FROM python:3.10-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libxml2-dev \
    libxslt-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final stage
FROM python:3.10-slim

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR /app

# Copy Python dependencies from builder to the new user's local directory
# We switch back to root briefly to copy and change ownership
USER root
COPY --from=builder /root/.local /home/user/.local
RUN chown -R user:user /home/user/.local

# Switch back to the non-root user
USER user

# Copy application code
COPY --chown=user:user . .

# Expose port (standard HF Spaces port)
EXPOSE 7860

# Health check
# Note: uses the container's python to run a quick health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/health')" || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
