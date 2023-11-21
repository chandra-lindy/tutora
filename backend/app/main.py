# Description: main entry point for Tutora API server

# standard library imports
from dotenv import load_dotenv
import os
import json
import requests

# third party imports
from fastapi import (
    FastAPI, HTTPException,
    Security, WebSocket, WebSocketDisconnect)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt

# local imports
from tutorabot.chat import Chat

load_dotenv()

# aws_access_key = os.environ.get("AWS_ACCESS_KEY_ID")
# aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY")
# aws_session_token = os.environ.get("AWS_SESSION_TOKEN")
use_nginx_cors = bool(int(os.environ.get("USE_NGINX_CORS")))
secure_flag = bool(int(os.environ.get("SECURE_FLAG")))
jwt_algorithm = os.environ.get("JWT_ALGORITHM")
jwt_audience = os.environ.get("JWT_AUDIENCE")
jwt_issuer = os.environ.get("JWT_ISSUER")
cognito_jwk_url = os.environ.get("COGNITO_JWK_URL")
openai_key = os.environ.get("OPENAI_KEY")

app = FastAPI()

# CORS settings
if not use_nginx_cors:
    origins = [
        os.environ.get("FRONTEND_URL"),
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

security = HTTPBearer()

# get jwks from cognito
jwks_cache = None
def fetch_jwks() -> list:
    global jwks_cache
    if jwks_cache is None:
        url = cognito_jwk_url
        response = requests.get(url)
        jwks_cache = response.json()["keys"]
    return jwks_cache

def get_current_user(authorization: HTTPAuthorizationCredentials = Security(security)):
    token = authorization.credentials

    jwks = fetch_jwks()
    header = jwt.get_unverified_header(token)
    rsa_key = {}

    for key in jwks:
        if key["kid"] == header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "alg": key["alg"],
                "n": key["n"],
                "e": key["e"],
            }

    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=[jwt_algorithm],
            audience=jwt_audience,
            issuer=jwt_issuer,
        )
        user = payload.get("sub")
        if user is None:
            raise HTTPException(status_code=403, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid Token")

@app.websocket("/ws/{user_name}")
async def websocket_endpoint(socket: WebSocket, user_name: str):
    await socket.accept()
    chat = Chat()

    try:
        while True:
            user_message = await socket.receive_text()

            if user_message in chat.debug_commands:
                reply = chat.debug(user_message)
            else: reply = chat.invoke(user_message)

            await socket.send_text(json.dumps(reply))

    except WebSocketDisconnect:
        await socket.close()
        print("websocket disconnected")
