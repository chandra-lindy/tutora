import { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import chatIcon from "../assets/chat.png";
import { getSocket } from "../utils/utils";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatDisplayRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const chatInputRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      const user_message = { source: "user", text: userInput };
      const newMessages = [...messages, user_message];

      try {
        socketRef.current.send(userInput);
      } catch (err) {
        console.error("Error sending message: ", err);
      }

      setMessages(newMessages);
      setUserInput("");
    }
  };

  useEffect(() => {
    chatInputRef.current.focus();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await Auth.currentAuthenticatedUser();
      } catch {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    console.log("chatInterface mounted");
    let isMounted = true;

    const setupSocket = async () => {
      console.log("setting up socket");
      try {
        const socketInstance = await getSocket();
        if (!isMounted) return;

        socketRef.current = socketInstance;

        socketInstance.addEventListener("open", (e) => {
          console.log("connected to server", e);
        });

        socketInstance.addEventListener("message", (e) => {
          console.log("Received from server: ", e.data);
          try {
            const ai_message = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, ai_message]);
            console.log("messages: ", messages);
          } catch (error) {
            console.error("Error parsing message: ", error);
          }

          socketInstance.addEventListener("error", (error) => {
            console.error("WebSocket error: ", error);
          });
        });
      } catch (error) {
        console.error("Error setting up socket: ", error);
      }
    };

    console.log("before calling setupSocket");
    setupSocket();

    return () => {
      console.log("ChatInstance unmounted");
      isMounted = false;
      if (socketRef.current) {
        console.log("cleaning up websocket connection");
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-8xl text-brand-blue-300 my-2 font-extrabold">
        Tutora
      </h1>
      <div
        className="h-full max-w-screen-md w-full overflow-y-auto"
        ref={chatDisplayRef}
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            source={message.source}
            message={message.text}
          />
        ))}
      </div>
      <div className="flex w-full max-w-screen-md h-1/12 rounded-xl ring-2 my-2">
        <input
          className="w-full mr-4 p-2 pl-4 rounded-xl"
          type="text"
          id="chat input"
          value={userInput}
          ref={chatInputRef}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(e);
            }
          }}
        />
        <div className="p-2" onClick={handleSendMessage}>
          <img src={chatIcon} alt="Chat Icon" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
