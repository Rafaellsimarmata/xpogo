# AI Chatbot WebSocket API Documentation

## Overview

The AI Chatbot WebSocket API provides real-time chat support for small enterprises looking to export their products. Using Socket.io, it enables bi-directional communication between frontend and backend for instant responses from an AI export assistant.

## Features

✨ **Real-time Chat**: Instant AI responses using WebSocket
🤖 **Export Expert**: Specialized AI trained in international trade and export
💬 **Conversation Memory**: Maintains conversation history per user
📊 **Market Analysis**: Get product export analysis and opportunities
🚀 **Strategy Planning**: Market entry strategies and roadmaps
📋 **Compliance Guidance**: Export regulations and certifications
🚢 **Shipping Support**: Logistics and shipping advice

## Getting Started

### Prerequisites

```bash
# Install dependencies
npm install socket.io socket.io-client
```

### Connection Setup

**Server URL**: `ws://localhost:3001`

## WebSocket Events

### Client → Server Events

#### 1. **join-chat**
Initialize chat connection and start conversation.

```javascript
socket.emit('join-chat', {
  userId: 'user123',
  userName: 'John Exporter'
});
```

**Response**: `chat-started`
```javascript
socket.on('chat-started', (data) => {
  console.log(data.message); // Welcome message
});
```

---

#### 2. **send-message**
Send a general chat message to the AI assistant.

```javascript
socket.emit('send-message', {
  userId: 'user123',
  message: 'How do I export coffee beans to Europe?'
});
```

**Response**: `bot-response`
```javascript
socket.on('bot-response', (data) => {
  console.log(data.message); // AI response
  console.log(data.timestamp);
});
```

---

#### 3. **analyze-product**
Request detailed export analysis for a product.

```javascript
socket.emit('analyze-product', {
  userId: 'user123',
  productInfo: {
    productName: 'Handcrafted Coffee Beans',
    description: 'Single-origin, organic, fair-trade certified',
    targetMarkets: 'Europe, North America',
    currentCapacity: '1000kg per month'
  }
});
```

**Response**: `bot-response`
```javascript
socket.on('bot-response', (data) => {
  console.log(data.message); // Detailed export analysis
  console.log(data.analysisType); // 'product-export'
});
```

---

#### 4. **market-strategy**
Get market entry strategy for a specific country.

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

**Response**: `bot-response`
```javascript
socket.on('bot-response', (data) => {
  console.log(data.message); // Market entry strategy
  console.log(data.strategyType); // 'market-entry'
});
```

---

#### 5. **compliance-guidance**
Get guidance on export compliance and regulations.

```javascript
socket.emit('compliance-guidance', {
  userId: 'user123',
  complianceQuery: {
    productType: 'Organic Food Products',
    destinationCountry: 'United States',
    specificConcern: 'FDA certifications needed'
  }
});
```

**Response**: `bot-response`
```javascript
socket.on('bot-response', (data) => {
  console.log(data.message); // Compliance requirements
  console.log(data.guidanceType); // 'compliance'
});
```

---

#### 6. **shipping-guidance**
Get advice on shipping and logistics.

```javascript
socket.emit('shipping-guidance', {
  userId: 'user123',
  shippingInfo: {
    productWeight: '500kg',
    productSize: '2m x 1m x 1m',
    destination: 'Singapore',
    urgency: 'Standard - 2-3 weeks acceptable',
    budget: '$3,000 per shipment'
  }
});
```

**Response**: `bot-response`
```javascript
socket.on('bot-response', (data) => {
  console.log(data.message); // Shipping recommendations
  console.log(data.guidanceType); // 'shipping'
});
```

---

#### 7. **get-history**
Retrieve conversation history.

```javascript
socket.emit('get-history', {
  userId: 'user123'
});
```

**Response**: `conversation-history`
```javascript
socket.on('conversation-history', (data) => {
  console.log(data.history); // Array of messages
  // [
  //   { role: 'user', content: '...' },
  //   { role: 'assistant', content: '...' },
  //   ...
  // ]
});
```

---

#### 8. **clear-chat**
Clear conversation history and start fresh.

```javascript
socket.emit('clear-chat', {
  userId: 'user123'
});
```

**Response**: `chat-cleared`
```javascript
socket.on('chat-cleared', (data) => {
  console.log(data.message); // Confirmation
});
```

---

### Server → Client Events

#### **chat-started**
Confirms chat initialization and sends welcome message.

```javascript
{
  success: true,
  message: "Welcome message from bot",
  userId: "user123",
  timestamp: "2024-12-04T10:30:00.000Z"
}
```

---

#### **bot-typing**
Indicates bot is processing response (typing indicator).

```javascript
{
  status: "typing",
  userId: "user123"
}
```

---

#### **bot-response**
AI response to user message.

```javascript
{
  success: true,
  message: "AI response content...",
  messageType: "response",
  timestamp: "2024-12-04T10:30:05.000Z",
  userId: "user123"
}
```

For specialized requests:
```javascript
{
  success: true,
  message: "...",
  analysisType: "product-export" | "market-entry" | undefined,
  strategyType: "market-entry" | undefined,
  guidanceType: "compliance" | "shipping" | undefined,
  timestamp: "2024-12-04T10:30:05.000Z",
  userId: "user123"
}
```

---

#### **conversation-history**
Returns conversation history.

```javascript
{
  success: true,
  history: [
    {
      role: "user",
      content: "How do I export...",
      timestamp: "2024-12-04T10:30:00.000Z"
    },
    {
      role: "assistant",
      content: "To export...",
      timestamp: "2024-12-04T10:30:05.000Z"
    }
  ],
  userId: "user123",
  timestamp: "2024-12-04T10:30:10.000Z"
}
```

---

#### **chat-cleared**
Confirms conversation cleared.

```javascript
{
  success: true,
  message: "Conversation cleared. Starting fresh!",
  userId: "user123",
  timestamp: "2024-12-04T10:30:00.000Z"
}
```

---

#### **error**
Error notification.

```javascript
{
  success: false,
  error: "Error message describing what went wrong"
}
```

---

## JavaScript Client Example

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Join chat
socket.emit('join-chat', {
  userId: 'user123',
  userName: 'John Exporter'
});

// Listen for welcome
socket.on('chat-started', (data) => {
  console.log('Bot:', data.message);
});

// Send message
function sendMessage(message) {
  socket.emit('send-message', {
    userId: 'user123',
    message: message
  });
}

// Listen for responses
socket.on('bot-response', (data) => {
  if (data.success) {
    console.log('Bot:', data.message);
  }
});

// Listen for typing indicator
socket.on('bot-typing', (data) => {
  console.log('Bot is typing...');
});

// Send product analysis request
function analyzeProduct() {
  socket.emit('analyze-product', {
    userId: 'user123',
    productInfo: {
      productName: 'Coffee Beans',
      description: 'Organic, fair-trade certified',
      targetMarkets: 'Europe',
      currentCapacity: '1000kg/month'
    }
  });
}

// Handle errors
socket.on('error', (data) => {
  console.error('Error:', data.error);
});
```

---

## React Component Example

```jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function ChatBot({ userId }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');

    newSocket.emit('join-chat', {
      userId: userId,
      userName: 'User'
    });

    newSocket.on('chat-started', (data) => {
      setMessages([{ type: 'bot', content: data.message }]);
    });

    newSocket.on('bot-typing', () => {
      setIsTyping(true);
    });

    newSocket.on('bot-response', (data) => {
      setIsTyping(false);
      if (data.success) {
        setMessages(prev => [...prev, { type: 'bot', content: data.message }]);
      }
    });

    newSocket.on('error', (data) => {
      setMessages(prev => [...prev, { type: 'error', content: data.error }]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [userId]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    socket.emit('send-message', {
      userId: userId,
      message: input
    });

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Bot is typing...</div>}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me about exporting..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
```

---

## Vue.js Example

```vue
<template>
  <div class="chatbot">
    <div class="messages">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message', msg.type]"
      >
        {{ msg.content }}
      </div>
      <div v-if="isTyping" class="typing-indicator">
        Bot is typing...
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="input"
        @keyup.enter="sendMessage"
        placeholder="Ask about exporting..."
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  props: ['userId'],
  data() {
    return {
      socket: null,
      messages: [],
      input: '',
      isTyping: false
    };
  },
  mounted() {
    this.socket = io('http://localhost:3001');

    this.socket.emit('join-chat', {
      userId: this.userId,
      userName: 'User'
    });

    this.socket.on('chat-started', (data) => {
      this.messages.push({ type: 'bot', content: data.message });
    });

    this.socket.on('bot-typing', () => {
      this.isTyping = true;
    });

    this.socket.on('bot-response', (data) => {
      this.isTyping = false;
      if (data.success) {
        this.messages.push({ type: 'bot', content: data.message });
      }
    });

    this.socket.on('error', (data) => {
      this.messages.push({ type: 'error', content: data.error });
    });
  },
  methods: {
    sendMessage() {
      if (!this.input.trim()) return;

      this.messages.push({ type: 'user', content: this.input });
      this.socket.emit('send-message', {
        userId: this.userId,
        message: this.input
      });

      this.input = '';
    }
  }
};
</script>
```

---

## Features & Capabilities

### 1. **Conversation Memory**
- AI maintains conversation context
- Provides relevant responses based on discussion history
- Supports follow-up questions naturally

### 2. **Export Expertise**
The chatbot can help with:
- Product export feasibility
- Target market identification
- Compliance and regulations
- Shipping and logistics
- Pricing strategies
- Documentation requirements

### 3. **Specialized Requests**
- Product analysis and export potential
- Market entry strategies
- Compliance guidance for specific countries
- Shipping and logistics recommendations

### 4. **User Session Management**
- Per-user conversation history
- Clear chat to start fresh
- Retrieve conversation history anytime

---

## Error Handling

Always listen for the `error` event:

```javascript
socket.on('error', (data) => {
  console.error('Chatbot Error:', data.error);
  // Handle error gracefully
});
```

Common errors:
- Missing `userId` - required for all requests
- API service unavailable - retry after delay
- Network issues - check connection

---

## Best Practices

1. **Always provide userId** - Required for maintaining conversation context
2. **Handle typing state** - Show typing indicator to user
3. **Error handling** - Implement error event listeners
4. **Cleanup** - Disconnect socket when component unmounts
5. **Retry logic** - Implement exponential backoff for failures

---

## Performance Tips

- Keep messages in-memory (consider Redux/Vuex for larger apps)
- Implement message pagination for long conversations
- Use typing indicator to provide feedback
- Clear old chats to free up memory

---

## Troubleshooting

### Connection Issues
```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Implement reconnection logic
});
```

### Slow Responses
- Check AI API status
- Verify network connectivity
- Monitor server logs

### Missing Messages
- Ensure userId is consistent
- Check for network interruptions
- Verify Socket.io is properly configured

---

## Support

For issues:
1. Check WebSocket connection status
2. Verify all required fields are provided
3. Review error messages
4. Check backend logs
5. Contact development team

---

## Future Enhancements

- Message persistence (store in database)
- Multi-language support
- Export chat as PDF
- Document recommendations
- Integration with other services
- Sentiment analysis
- User feedback and ratings
