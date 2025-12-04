# AI Chatbot WebSocket - Quick Reference

## Architecture Overview

```
Frontend (React/Vue)
    ↓ socket.emit('send-message')
    ↕ WebSocket Connection (Socket.io)
    ↑ socket.on('bot-response')
Backend (Node.js/Express)
    ↓
ChatbotWebSocketHandler
    ↓
ChatbotService
    ↓
AI API (Kolosal.ai / Claude)
    ↑
Returns → Frontend
```

## Quick Start (3 Steps)

### Step 1: Backend Already Ready ✅
- Socket.io server is running
- WebSocket handler initialized
- No additional setup needed!

### Step 2: Install Frontend Socket.io Client
```bash
cd packages/frontend
npm install socket.io-client
```

### Step 3: Add Chat Component
```jsx
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.emit('join-chat', {
  userId: 'user123',
  userName: 'John'
});

socket.on('bot-response', (data) => {
  console.log('Bot:', data.message);
});

socket.emit('send-message', {
  userId: 'user123',
  message: 'How do I export coffee?'
});
```

## Event Flow

```
┌─────────────────────────────────────────────────────────────┐
│ CLIENT (Frontend)                                            │
├─────────────────────────────────────────────────────────────┤
│ 1. socket.emit('join-chat')                                 │
│    ↓                                                         │
│ 2. socket.on('chat-started') → Show welcome message         │
│    ↓                                                         │
│ 3. User types message                                       │
│    ↓                                                         │
│ 4. socket.emit('send-message', { userId, message })        │
│    ↓ (WebSocket)                                            │
├─────────────────────────────────────────────────────────────┤
│ SERVER (Backend)                                             │
├─────────────────────────────────────────────────────────────┤
│ 1. socket.on('send-message') receives message              │
│    ↓                                                         │
│ 2. socket.emit('bot-typing') → Send typing indicator       │
│    ↓                                                         │
│ 3. ChatbotService.sendMessage(userId, message)            │
│    ↓                                                         │
│ 4. Call AI API with conversation history                  │
│    ↓                                                         │
│ 5. Receive AI response                                      │
│    ↓                                                         │
│ 6. socket.emit('bot-response', { message }) → Send to client
│    ↓ (WebSocket)                                            │
├─────────────────────────────────────────────────────────────┤
│ CLIENT (Frontend)                                            │
├─────────────────────────────────────────────────────────────┤
│ socket.on('bot-response') → Display AI response            │
└─────────────────────────────────────────────────────────────┘
```

## Event Reference

### **join-chat** (Client → Server)
Initiates chat connection
```javascript
socket.emit('join-chat', {
  userId: 'user123',
  userName: 'John'
});
```
Response: `socket.on('chat-started', ...)`

---

### **send-message** (Client → Server)
Send general question/message
```javascript
socket.emit('send-message', {
  userId: 'user123',
  message: 'How do I export?'
});
```
Response: `socket.on('bot-response', ...)`

---

### **analyze-product** (Client → Server)
Get product export analysis
```javascript
socket.emit('analyze-product', {
  userId: 'user123',
  productInfo: {
    productName: 'Coffee',
    description: 'Organic beans',
    targetMarkets: 'Europe',
    currentCapacity: '1000kg/month'
  }
});
```
Response: `socket.on('bot-response', ...)`

---

### **market-strategy** (Client → Server)
Get market entry strategy
```javascript
socket.emit('market-strategy', {
  userId: 'user123',
  marketInfo: {
    country: 'Germany',
    productType: 'Specialty Coffee',
    budget: '$10,000',
    timeline: '6 months'
  }
});
```
Response: `socket.on('bot-response', ...)`

---

### **compliance-guidance** (Client → Server)
Get compliance information
```javascript
socket.emit('compliance-guidance', {
  userId: 'user123',
  complianceQuery: {
    productType: 'Food',
    destinationCountry: 'USA',
    specificConcern: 'FDA certification'
  }
});
```
Response: `socket.on('bot-response', ...)`

---

### **shipping-guidance** (Client → Server)
Get shipping advice
```javascript
socket.emit('shipping-guidance', {
  userId: 'user123',
  shippingInfo: {
    productWeight: '500kg',
    productSize: '2m x 1m x 1m',
    destination: 'Singapore',
    urgency: 'Standard',
    budget: '$3,000'
  }
});
```
Response: `socket.on('bot-response', ...)`

---

### **get-history** (Client → Server)
Retrieve conversation history
```javascript
socket.emit('get-history', {
  userId: 'user123'
});
```
Response: `socket.on('conversation-history', ...)`

---

### **clear-chat** (Client → Server)
Clear conversation and start fresh
```javascript
socket.emit('clear-chat', {
  userId: 'user123'
});
```
Response: `socket.on('chat-cleared', ...)`

---

## Server Response Events

| Event | When | Data |
|-------|------|------|
| `chat-started` | After join-chat | message, userId, timestamp |
| `bot-typing` | Bot processing | status, userId |
| `bot-response` | Bot ready | message, timestamp, userId |
| `conversation-history` | After get-history | history (array), userId |
| `chat-cleared` | After clear-chat | message, userId, timestamp |
| `error` | Any error | success: false, error message |

## Common Use Cases

### 1. **Basic Chat**
```javascript
// User asks a question
socket.emit('send-message', {
  userId: 'user123',
  message: 'What documents do I need to export to France?'
});

// Receive answer
socket.on('bot-response', (data) => {
  console.log('Answer:', data.message);
});
```

### 2. **Product Analysis**
```javascript
socket.emit('analyze-product', {
  userId: 'user123',
  productInfo: {
    productName: 'Handmade Ceramics',
    description: 'Decorative pottery',
    targetMarkets: 'Japan, South Korea',
    currentCapacity: '500 pieces/month'
  }
});
```

### 3. **Market Strategy**
```javascript
socket.emit('market-strategy', {
  userId: 'user123',
  marketInfo: {
    country: 'India',
    productType: 'Spices',
    budget: '$5,000',
    timeline: '3 months'
  }
});
```

### 4. **Get Compliance Info**
```javascript
socket.emit('compliance-guidance', {
  userId: 'user123',
  complianceQuery: {
    productType: 'Textiles',
    destinationCountry: 'EU',
    specificConcern: 'CE marking requirements'
  }
});
```

## Connection Status

```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

## Error Handling

```javascript
socket.on('error', (data) => {
  if (!data.success) {
    console.error('Error:', data.error);
    // Handle error:
    // - userId is required
    // - AI API unavailable
    // - Network error
  }
});
```

## Message Format

### User Message
```javascript
{
  sender: 'user',
  content: 'How do I...',
  timestamp: '2024-12-04T10:30:00Z'
}
```

### Bot Message
```javascript
{
  sender: 'bot',
  content: 'To export...',
  messageType: 'response',
  timestamp: '2024-12-04T10:30:05Z'
}
```

## File Locations

```
packages/backend/
├── src/
│   ├── index.js                          ← Socket.io initialized
│   ├── services/
│   │   └── ChatbotService.js             ← AI chat logic
│   └── websocket/
│       └── ChatbotWebSocketHandler.js    ← WebSocket handlers
└── CHATBOT_WEBSOCKET_README.md           ← Full documentation
```

## Performance Tips

✅ **DO:**
- Keep userId consistent
- Handle typing indicator
- Implement error listeners
- Clean up on disconnect
- Use connection pooling

❌ **DON'T:**
- Store entire chat in state (use database)
- Forget to handle disconnections
- Send empty messages
- Recreate socket on each message
- Ignore error events

## Deployment Checklist

- [ ] Socket.io installed in backend
- [ ] Frontend has socket.io-client
- [ ] CORS configured correctly
- [ ] AI API credentials set in .env
- [ ] WebSocket port (3001) is open
- [ ] SSL/TLS for production (wss://)
- [ ] Rate limiting configured
- [ ] Error monitoring enabled

## Support Resources

📚 **Documentation:**
- Full API: `CHATBOT_WEBSOCKET_README.md`
- Setup Guide: `CHATBOT_SETUP.md`
- This File: Quick reference

🔗 **External Links:**
- Socket.io: https://socket.io/
- Kolosal AI: Check .env for API details

🐛 **Debugging:**
- Check browser console
- Review server logs
- Enable Socket.io debug mode
- Verify network tab in DevTools

---

**Version:** 1.0
**Last Updated:** December 4, 2025
**Status:** ✅ Production Ready
