# Chatbot WebSocket Setup Guide

## Installation

### 1. Install Dependencies

```bash
cd packages/backend
npm install socket.io
```

### 2. Verify Installation

Check that `socket.io` is in your `package.json`:

```bash
npm list socket.io
```

## Configuration

### Backend Setup (Already Done)

The backend has been configured with:
- ✅ Socket.io server initialized
- ✅ WebSocket handler for chatbot
- ✅ Real-time event handlers
- ✅ CORS support for cross-origin connections

### Environment Variables

Ensure these are set in your `.env.development`:

```bash
AI_API_BASE_URL=https://api.kolosal.ai/v1
AI_SECRET_TOKEN=your_token_here
AI_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
```

## Starting the Server

```bash
npm run dev:backend
```

You should see:
```
Backend listening on http://localhost:3001
Swagger UI available at http://localhost:3001/api-docs
WebSocket (Socket.io) available at ws://localhost:3001
```

## Frontend Integration

### Using Socket.io Client

Install in your frontend project:

```bash
cd packages/frontend
npm install socket.io-client
```

### Basic Setup (React Example)

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function ExportChatbot() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('http://localhost:3001');

    // Join chat with your user ID
    newSocket.emit('join-chat', {
      userId: 'user123', // Replace with actual user ID
      userName: 'John Exporter'
    });

    // Listen for welcome message
    newSocket.on('chat-started', (data) => {
      setMessages([{ sender: 'bot', text: data.message }]);
    });

    // Listen for bot responses
    newSocket.on('bot-response', (data) => {
      if (data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.message }]);
      }
    });

    // Listen for typing indicator
    newSocket.on('bot-typing', () => {
      console.log('Bot is typing...');
    });

    // Handle errors
    newSocket.on('error', (data) => {
      setMessages(prev => [...prev, { sender: 'error', text: data.error }]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (message) => {
    if (!socket) return;

    // Add user message to UI
    setMessages(prev => [...prev, { sender: 'user', text: message }]);

    // Send to server
    socket.emit('send-message', {
      userId: 'user123',
      message: message
    });
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Ask about exporting..."
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.target.value) {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
```

## Testing the WebSocket

### Using WebSocket Client (Browser DevTools)

1. Open your browser and navigate to `http://localhost:3001`
2. Open Developer Tools (F12)
3. Open the Console tab
4. Connect with:

```javascript
const socket = io('http://localhost:3001');

socket.emit('join-chat', {
  userId: 'test-user',
  userName: 'Test'
});

socket.on('chat-started', (data) => {
  console.log('Started:', data);
});

socket.emit('send-message', {
  userId: 'test-user',
  message: 'How do I export coffee?'
});

socket.on('bot-response', (data) => {
  console.log('Response:', data.message);
});
```

### Using Postman or ThunderClient

You can test WebSocket with these tools:
1. Create a WebSocket request
2. URL: `http://localhost:3001`
3. Send events (as shown in console examples above)

## File Structure

```
packages/backend/
├── src/
│   ├── services/
│   │   ├── ChatbotService.js          ← AI chat logic
│   │   └── ...
│   ├── websocket/
│   │   └── ChatbotWebSocketHandler.js ← WebSocket event handlers
│   ├── index.js                       ← Updated with Socket.io
│   └── ...
├── CHATBOT_WEBSOCKET_README.md        ← Full API documentation
└── ...
```

## Available WebSocket Events

### Send to Server:
- `join-chat` - Initialize connection
- `send-message` - Send chat message
- `analyze-product` - Analyze product for export
- `market-strategy` - Get market entry strategy
- `compliance-guidance` - Get compliance info
- `shipping-guidance` - Get shipping advice
- `get-history` - Retrieve chat history
- `clear-chat` - Clear conversation

### Receive from Server:
- `chat-started` - Connection confirmed
- `bot-typing` - Typing indicator
- `bot-response` - AI response
- `conversation-history` - Chat history
- `chat-cleared` - Chat cleared
- `error` - Error occurred

## Debugging

### Enable Debug Logging (Socket.io)

```javascript
const socket = io('http://localhost:3001', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket']
});

socket.onAny((event, ...args) => {
  console.log(`[${event}]`, args);
});
```

### Check Server Logs

```bash
# In backend terminal
npm run dev:backend
# Watch for socket connection messages
```

## Common Issues

### "Connection refused"
- Ensure backend is running: `npm run dev:backend`
- Check port 3001 is available
- Verify firewall settings

### "userId is required"
- Always pass `userId` in join-chat event
- Check user ID is not empty

### Slow responses
- Check AI API credentials
- Verify internet connection
- Check server logs for errors

### WebSocket won't connect
- Ensure Socket.io is installed: `npm install socket.io`
- Check CORS configuration
- Verify WebSocket is not blocked by proxy

## Next Steps

1. **Integrate with Frontend** - Use React/Vue components as shown above
2. **Add UI Components** - Create chat UI components
3. **Store Conversations** - Persist chat history in database
4. **Add Features** - Implement export document generation
5. **Deploy** - Set up production WebSocket

## Resources

- Full API Documentation: `CHATBOT_WEBSOCKET_README.md`
- Socket.io Docs: https://socket.io/docs/
- Example Code: See examples in this document

## Support

For issues:
1. Check backend is running
2. Verify network connectivity
3. Check browser console for errors
4. Review server logs
5. Ensure all dependencies installed

---

Happy chatting! 🚀
