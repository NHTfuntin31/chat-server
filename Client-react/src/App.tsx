import { useState, useEffect } from 'react';
import socket from './socket';

const App = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [joined, setJoined] = useState(false);
  const [namez, setNamez] = useState('');
  const [typingDisplay, setTypingDisplay] = useState('');

  let timeoutId: number | null = null;

  useEffect(() => {
    socket.emit('findAllMessages', {}, (response: any) => {
      setMessages(response);
    });
    console.log("hahaa");
    
    socket.on('message', (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("kkk");
    });
    socket.on('typing', ({ name, isTyping }: { name: string; isTyping: boolean }) => {
      if (isTyping) {
        setTypingDisplay(`${name} is typing...`);
      } else {
        setTypingDisplay('');
      }
    });
    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, []);

  const sendMessage = (e: any) => {
    e.preventDefault();
    
    socket.emit('createMessage', {text: messageText}, (response: any) => {
      // messages.value.push(response)
      setMessageText('');
      console.log(response);
    })
  };

  const join = (e: any) => {
    e.preventDefault(namez);
    console.log(namez);
    
    socket.emit('join', {name: namez}, () => {
      setJoined(true);
    })
  };

  const emitTyping = () => {
    if (socket) {
      socket.emit('typing', { isTyping: true });
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
  
      timeoutId = window.setTimeout(() => {
        socket.emit('typing', { isTyping: false });
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
            {messages.map((key, index) => (
              <div key={index}>
                [{key.name}]: {key.text}
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
