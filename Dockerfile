FROM ubuntu:20.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install the Llama model dependencies
RUN pip3 install llama  # Replace this with the correct installation command for Llama 3.1

# Copy the model files if needed (uncomment and modify if you have specific model files)
# COPY models/llama-3.1 /opt/llama/models/

# Set environment variables if needed
ENV LLAMA_ENV=production
ENV MODEL_NAME=llama-3.1

# Expose the necessary port
EXPOSE 8090

# Command to run the Llama service
CMD ["llama", "start", "--model", "llama-3.1"]  # Replace with the actual command to start the Llama model
