import chromadb
from chromadb.config import Settings
import uvicorn
from chromadb.server.fastapi import FastAPI

# This manually starts the Chroma server exactly like the CLI would
if __name__ == "__main__":
    import chromadb.api
    from chromadb.server.fastapi import rpc_router
    
    print("--- Starting RepoMind Database (Chroma) ---")
    # This is the same as running: chroma run --path ./data
    server = chromadb.Server(Settings(
        is_persistent=True,
        persist_directory="./data",
        anonymized_telemetry=False
    ))
    
    # Run it on port 8000
    import uvicorn
    uvicorn.run(server.app(), host="0.0.0.0", port=8000)