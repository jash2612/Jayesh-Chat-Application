import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Users, LogOut, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { ScrollArea } from "./components/ui/scroll-area";
import { cn } from "./lib/utils";
import axios from "axios";
import io from "socket.io-client";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL;

// Types
const Message = {
  id: String,
  text: String,
  createdAt: Date,
  sender: {
    id: String,
    username: String,
    name: String,
  },
};

const User = {
  id: String,
  username: String,
  name: String,
};

// Helper Functions
const getMessageTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

// Components
const ChatInput = ({ value, onChange, onKeyDown, onSend, disabled }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <Textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          className="flex-1 resize-none min-h-[2.5rem] max-h-[10rem] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          name="message"
          disabled={disabled}
        />
        <Button
          onClick={onSend}
          className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          disabled={disabled || !value.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const MessageItem = ({ message, currentUser }) => {
  const isCurrentUser = message.sender.id === currentUser?.id;
  return (
    <motion.div
      className={cn("flex mb-4", isCurrentUser ? "justify-end" : "justify-start")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          "rounded-xl px-4 py-2 max-w-[70%] md:max-w-[50%]",
          isCurrentUser
            ? "bg-blue-500 text-white ml-auto"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white mr-auto",
          "shadow-md"
        )}
      >
        {message.sender.id !== currentUser?.id && (
          <div className="text-xs font-semibold mb-1">{message.sender.username}</div>
        )}
        <p className="text-sm">{message.text}</p>
        <div className={cn("text-xs mt-1", isCurrentUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400")}>
          {getMessageTime(message.createdAt)}
        </div>
      </div>
    </motion.div>
  );
};

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 overflow-y-auto pr-2">
      <AnimatePresence>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} currentUser={currentUser} />
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

const UserList = ({ users }) => {
  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 p-4 overflow-y-auto hidden md:block">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Online Users
      </h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={\`https://api.dicebear.com/7.x/micah/svg?seed=\${user.username}\`} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-gray-700 dark:text-gray-300">{user.name || user.username}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

const AuthForm = ({
  isRegister,
  username,
  password,
  name,
  onUsernameChange,
  onPasswordChange,
  onNameChange,
  onSubmit,
  loading,
  error,
  toggleRegister,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          {isRegister ? "Register" : "Login"}
        </h2>
        {isRegister && (
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        )}
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {error && (
          <div
            className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded relative"
            role="alert"
          >
            <AlertTriangle className="w-5 h-5 mr-2 inline-block" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Button
          onClick={onSubmit}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isRegister ? (
            "Register"
          ) : (
            "Login"
          )}
        </Button>
        <button
          onClick={toggleRegister}
          className="text-sm text-blue-500 dark:text-blue-400 hover:underline w-full text-center"
        >
          {isRegister ? "Already have an account? Login" : "Create an account"}
        </button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const chatContainerRef = useRef(null);

  // Socket.IO Connection
  useEffect(() => {
    const newSocket = io(SOCKET_IO_URL, { autoConnect: false });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("userJoined", ({ userId, username }) => {
      if (userId !== user?.id) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: crypto.randomUUID(),
            text: \`\${username} joined the chat.\`,
            createdAt: new Date(),
            sender: { id: "system", username: "System" },
          },
        ]);
      }
    });

    newSocket.on("userLeft", ({ userId }) => {
      const leftUser = users.find((u) => u.id === userId);
      if (leftUser) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: crypto.randomUUID(),
            text: \`\${leftUser.username} left the chat.\`,
            createdAt: new Date(),
            sender: { id: "system", username: "System" },
          },
        ]);
      }
    });

    newSocket.on("updateUsers", (users) => {
      setUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, users]);

  // Fetch initial messages
  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (user) {
        try {
          const response = await axios.get(\`\${API_BASE_URL}/messages\`, {
            headers: { Authorization: \`Bearer \${localStorage.getItem("token")}\` },
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching initial messages:", error);
          setError("Failed to load initial messages.");
        }
      }
    };
    fetchInitialMessages();
  }, [user]);

  // Connect socket when user logs in
  useEffect(() => {
    if (user && socket) {
      socket.auth = { userId: user.id, username: user.username };
      socket.connect();
      socket.emit("joinRoom", { userId: user.id, username: user.username });
    }
  }, [user, socket]);

  // Handlers
  const handleSendMessage = () => {
    if (currentMessage.trim() && socket && user) {
      const message = {
        id: crypto.randomUUID(),
        text: currentMessage,
        createdAt: new Date(),
        sender: user,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit("message", { text: currentMessage, userId: user.id, username: user.username });
      setCurrentMessage("");
    }
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(\`\${API_BASE_URL}/auth/\${isRegister ? "register" : "login"}\`, {
        username,
        password,
        ...(isRegister ? { name } : {}),
      });
      const { token, user: loggedInUser } = response.data;
      localStorage.setItem("token", token);
      setUser(loggedInUser);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    localStorage.removeItem("token");
    if (socket && user) {
      socket.emit("leaveRoom", { userId: user.id });
      socket.disconnect();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "password") setPassword(value);
    else if (name === "name") setName(value);
    else setCurrentMessage(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Jayesh Chat App</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">
              <Users className="inline-block w-4 h-4 mr-1" />
              {user.name || user.username}
            </span>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 dark:bg-red-500/80 dark:text-red-300 dark:hover:bg-red-500 dark:hover:text-red-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </header>
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden" ref={chatContainerRef}>
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {user ? (
            <>
              <MessageList messages={messages} currentUser={user} />
              <ChatInput
                value={currentMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onSend={handleSendMessage}
                disabled={!user}
              />
            </>
          ) : (
            <AuthForm
              isRegister={isRegister}
              username={username}
              password={password}
              name={name}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onNameChange={setName}
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              toggleRegister={() => setIsRegister((prev) => !prev)}
            />
          )}
        </div>
        {user && <UserList users={users} />}
      </main>
    </div>
  );
};

export default App;
