import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const App = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [joined, setJoined] = useState(false);
  const [namez, setNamez] = useState('');
  const [typingDisplay, setTypingDisplay] = useState('');
  const Socket = io('http://localhost:3001');

  let timeoutId: number | null = null;

  useEffect(() => {
    Socket.emit('findAllMessages', {}, (response: any) => {
      setMessages(response);
    });

    Socket.on('message', (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    Socket.on('typing', ({ name, isTyping }: { name: string; isTyping: boolean }) => {
      if (isTyping) {
        setTypingDisplay(`${name} is typing...`);
      } else {
        setTypingDisplay('');
      }
    });
  }, [namez]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    
    Socket.emit('createMessage', {text: messageText}, (response: any) => {
      // messages.value.push(response)
      setMessageText('');
      console.log(response);
    })
  };

  const join = (e: any) => {
    e.preventDefault(namez);
    console.log(namez);
    
    Socket.emit('join', {name: namez}, () => {
      setJoined(true);
    })
  };

  const emitTyping = () => {
    if (Socket) {
      Socket.emit('typing', { isTyping: true });
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
  
      timeoutId = window.setTimeout(() => {
        Socket.emit('typing', { isTyping: false });
      }, 2000);
    }
  };

  return (
    <div className="chat">
      {!joined ? (
        <div>
          <form onSubmit={join}>
            <label>What's your name?</label>
            <input value={namez} onChange={(e) => setNamez(e.target.value)} />
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
              <input value={messageText} onChange={(e) => setMessageText(e.target.value)} onInput={emitTyping} />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
