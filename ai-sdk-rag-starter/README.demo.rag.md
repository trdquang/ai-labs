# RAG Chatbot Setup and Testing Guide

## Quick Start

1. **Start Docker PostgreSQL container**
    - Start the Docker image `aisdk-postgres` with username and password `aisdk`

2. **Inspect the pgvector database**
    - Run `drizzle-kit studio` by `pnpm run db:studio` to check and inspect the pgvector database
    - Navigate to https://local.drizzle.studio
    - View or add new records

3. **Test the chatbot**
    - Navigate to `/chat` to interact with the chatbot

4. **Verify results**
    - Check if the chatbot responses match the data stored in the pgvector database