import os
from dotenv import load_dotenv
load_dotenv()
openai_key = os.getenv('OPENAI_KEY')

from config import settings
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from tutorabot.conversation_userinfo_memory import ConversationUserinfoMemory
from langchain.memory.entity import InMemoryEntityStore
from tutorabot.prompts import (
  ENTITY_EXTRACTION_PROMPT,
  ENTITY_SUMMARIZATION_PROMPT,
  MAIN_PROMPT
)

class Chat():
  def __init__(self):
    self.debug_commands = ['report']
    self.llm = ChatOpenAI(
      openai_api_key=settings.OPENAI_API_KEY,
      model=settings.OPENAI_MODEL_NAME,
      temperature=0
    )
    self.entity_store = InMemoryEntityStore()
    self.memory = ConversationUserinfoMemory(
      llm=self.llm,
      ai_prefix="ai",
      human_prefix="user",
      entity_store=self.entity_store,
      entity_extraction_prompt=ENTITY_EXTRACTION_PROMPT,
      entity_summarization_prompt=ENTITY_SUMMARIZATION_PROMPT,
    )
    self.chain = ConversationChain(
      llm=self.llm,
      prompt=MAIN_PROMPT,
      memory=self.memory
    )

  def invoke(self, user_message):
    ai_message = self.chain.predict(input=user_message)
    return {
      'source': 'ai',
      'text': ai_message
    }

  def debug(self, command):
    if command == "report":
      return {
        'source': 'debug',
        'text': 'Debug mode (not part of conversation):\n\nUser Information:\n' + str(self.memory.entity_store.store)
      }
