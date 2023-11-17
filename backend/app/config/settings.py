import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__),'..', '.env')
load_dotenv(dotenv_path=dotenv_path)

OPENAI_API_KEY = os.getenv("OPENAI_KEY")
OPENAI_MODEL_NAME = "gpt-3.5-turbo"
OPENAI_TEMPERATURE = 0
