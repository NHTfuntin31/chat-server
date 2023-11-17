import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { io, Socket } from 'socket.io-client';

// Định nghĩa kiểu cho dữ liệu message
interface Message {
  name: string;
  text: string;
}

const App = () => {
  const socket = useRef<Socket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [typingDisplay, setTypingDisplay] = useState<string>('');

  useEffect(() => {
    const fetchMessages = () => {
      if (socket.current) {
        socket.current.emit('findAllMessages', {}, (response: Message[]) => {
          setMessages(response);
        });
      }
    };

    const handleNewMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleTyping = ({ name, isTyping }: { name: string; isTyping: boolean }) => {
      if (isTyping) {
        setTypingDisplay(`${name} is typing...`);
      } else {
        setTypingDisplay('');
      }
    };

    fetchMessages();

    if (socket.current) {
      socket.current.on('message', handleNewMessage);
      socket.current.on('typing', handleTyping);
    }

    return () => {
      if (socket.current) {
        socket.current.off('message', handleNewMessage);
        socket.current.off('typing', handleTyping);
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket.current) {
      socket.current.emit('createMessage', { text: messageText }, (response: Message) => {
        setMessageText('');
      });
    }
  };

  const join = () => {
    if (socket.current) {
      socket.current.emit('join', { name }, () => {
        setJoined(true);
      });
    }
  };

  let timeout: ReturnType<typeof setTimeout>;

  const emitTyping = () => {
      socket.current?.emit('typing', { isTyping: true });
      timeout = setTimeout(() => {
        socket.current?.emit('typing', { isTyping: false });
      }, 2000);
  };

  return (
    <div className="chat">
      {!joined ? (
        <div>
          <form onSubmit={join}>
            <label>What's your name?</label>
            <input value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <div className="chat-container">
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index}>
                [{message.name}]: {message.text}
              </div>
            ))}
          </div>
          {typingDisplay && <div>{typingDisplay}</div>}
          <hr />
          <div className="message-input">
            <form onSubmit={sendMessage}>
              <label>Message:</label>
              <input
                value={messageText}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setMessageText(e.target.value);
                  emitTyping();
                }}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
