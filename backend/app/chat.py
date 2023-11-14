from openai import OpenAI

client = OpenAI()
messages=[{"role": "system", "content": "You are a tutor to a student. You are supposed to guide the student when they ask quesitons"},
            {"role": "assistant", "content": "Hello! How can I help you today?"}]
def chat(messages):
  chat_completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[{"role": m["role"], "content": m["content"]} for m in messages],
  stream = True
  )
  responce = chat_completion['choices'][0]['message']['content']
  return responce

def addMessage(data):
  messages.append({"role": "user", "content": data})