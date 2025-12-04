# 📡 AsyncAPI Documentation - AI Chatbot WebSocket

## Overview

The XPogo AI Chatbot uses **AsyncAPI 3.0.0** specification for documenting WebSocket events. This is separate from REST API documentation (Swagger) because Swagger doesn't natively support WebSocket/async protocols.

---

## 📁 AsyncAPI Files

### 1. **CHATBOT_ASYNCAPI.yaml**
Complete AsyncAPI 3.0.0 specification for all WebSocket events.
- Location: `packages/backend/CHATBOT_ASYNCAPI.yaml`
- Format: YAML (human-readable)
- Standard: AsyncAPI 3.0.0
- Coverage: 8 client events + 6 server events

---

## 🔌 Event Categories

### Client → Server Events (8)
Events sent from the client/browser to the server:

1. **join-chat** - Initialize connection
2. **send-message** - Send chat message
3. **analyze-product** - Request product analysis
4. **market-strategy** - Request market entry strategy
5. **compliance-guidance** - Request compliance information
6. **shipping-guidance** - Request shipping advice
7. **get-history** - Request conversation history
8. **clear-chat** - Clear conversation history

### Server → Client Events (6)
Events sent from the server back to the client:

1. **chat-started** - Connection confirmed
2. **bot-response** - AI response message
3. **bot-typing** - Typing indicator
4. **conversation-history** - History response
5. **chat-cleared** - Clear confirmation
6. **error** - Error notification

---

## 📋 AsyncAPI Structure

### Info Section
```yaml
info:
  title: XPogo AI Chatbot WebSocket API
  version: 1.0.0
  description: Real-time AI-powered chatbot
  contact:
    name: XPogo Support
    email: support@xpogo.com
```

### Servers Section
```yaml
servers:
  development:
    host: localhost:3001
    protocol: ws  # WebSocket
  production:
    host: api.xpogo.com
    protocol: wss  # WebSocket Secure (SSL/TLS)
```

### Channels Section
Defines the WebSocket endpoint and all messages.

### Messages Section
Documents each event with:
- Name and title
- Summary and description
- Payload schema (JSON schema)
- Example payloads
- Tags and relationships

### Operations Section
Defines bidirectional communication patterns.

---

## 🔄 Message Flow Examples

### Example 1: Simple Chat

```
CLIENT                              SERVER
  |                                   |
  |---- send-message event ---------->|
  |                                   |
  |<---- bot-typing event ------------|
  |                                   |
  |<---- bot-response event -----------|
  |                                   |
```

### Example 2: Product Analysis

```
CLIENT                              SERVER
  |                                   |
  |---- analyze-product event ------->|
  |                                   |
  |<---- bot-typing event ------------|
  |                                   |
  |<---- bot-response event -----------|
  |  (with analysis details)          |
  |                                   |
```

### Example 3: Connection Lifecycle

```
CLIENT                              SERVER
  |                                   |
  |---- join-chat event ------------->|
  |                                   |
  |<---- chat-started event -----------|
  |                                   |
  |---- send-message event ---------->|
  |                                   |
  |<---- bot-response event -----------|
  |                                   |
  |---- clear-chat event ------------>|
  |                                   |
  |<---- chat-cleared event ----------|
  |                                   |
```

---

## 📖 Reading AsyncAPI Specification

### Event Structure

Each event in AsyncAPI includes:

```yaml
message-name:
  name: message-name
  title: Human Readable Title
  summary: One-line summary
  description: |
    Detailed explanation of what this event does,
    when it's triggered, and what data it contains.
  contentType: application/json
  payload:
    type: object
    properties:
      field:
        type: string
        description: Field description
  examples:
    - name: exampleName
      summary: Example description
      payload:
        field: example value
  tags:
    - name: Event Category
```

### Payload Schema

Each event's `payload` section defines the JSON structure:

```yaml
payload:
  type: object
  required:
    - field1
    - field2
  properties:
    field1:
      type: string
      example: value1
    field2:
      type: string
      enum: [option1, option2]
      description: Field explanation
```

---

## 🔍 How to Use AsyncAPI Files

### Viewing the Specification

#### 1. **Local File**
Open `packages/backend/CHATBOT_ASYNCAPI.yaml` in any text editor.

#### 2. **Online Viewer (Recommended)**
Use the free AsyncAPI Studio:
```
https://studio.asyncapi.com/
```

Steps:
1. Go to https://studio.asyncapi.com/
2. Click "File" → "Open"
3. Upload or paste `CHATBOT_ASYNCAPI.yaml`
4. View rendered documentation with interactive features

#### 3. **OpenAPI/Swagger UI Alternative**
While Swagger doesn't natively support AsyncAPI, you can view it using:
```
https://swagger.io/tools/swagger-ui/
```
(Though it will show as raw specification)

---

## 📊 Event Reference

### send-message Event

**Purpose**: Send chat message and get AI response

**Payload**:
```json
{
  "userId": "user123",
  "message": "How do I export coffee to Europe?"
}
```

**Response Events**:
- `bot-typing` - Server is processing
- `bot-response` - AI response ready
- `error` - If something went wrong

---

### analyze-product Event

**Purpose**: Get AI analysis of product export feasibility

**Payload**:
```json
{
  "userId": "user123",
  "productInfo": {
    "name": "Premium Coffee Beans",
    "origin": "Colombia",
    "quantity": "500kg",
    "quality": "Premium",
    "certifications": "Fair Trade, Organic"
  }
}
```

**Response Event**:
```json
{
  "event": "bot-response",
  "analysis": "Your product has strong export potential...",
  "recommendations": [
    "Target specialty markets",
    "Maintain certifications"
  ]
}
```

---

### join-chat Event

**Purpose**: Initialize WebSocket connection

**Payload**:
```json
{
  "userId": "user123",
  "userName": "John Doe"
}
```

**Response Event**:
```json
{
  "event": "chat-started",
  "userId": "user123",
  "message": "Welcome to XPogo AI Chatbot!",
  "timestamp": "2024-12-04T10:30:00Z"
}
```

---

## 🏗️ AsyncAPI Specification Standards

### AsyncAPI 3.0.0 Key Features

1. **Channels** - Defines endpoints/topics
2. **Operations** - Defines action patterns (send/receive)
3. **Messages** - Defines event structures
4. **Payload Schemas** - JSON Schema for validation
5. **Tags** - Organize and categorize events
6. **Examples** - Real-world usage examples

### Benefits

✅ **Standard Format** - Industry-recognized standard
✅ **Tool Support** - Works with AsyncAPI tools
✅ **Code Generation** - Can generate client/server code
✅ **Validation** - Validate messages against schema
✅ **Documentation** - Auto-generate docs
✅ **Testing** - Use for testing and mocking

---

## 🔗 Linking AsyncAPI to Swagger

In the Swagger specification (`index.js`), we reference AsyncAPI:

```javascript
// In the Swagger spec info section
info: {
  x-asyncapi: '/docs/CHATBOT_ASYNCAPI.yaml',
  x-asyncapi-studio: 'https://studio.asyncapi.com/',
  x-websocket-documentation: 'See CHATBOT_ASYNCAPI.yaml for WebSocket events'
}

// In the API paths
x-websocket: {
  description: 'WebSocket API documented in AsyncAPI format',
  documentation: '/docs/CHATBOT_ASYNCAPI.yaml',
  asyncapi-studio: 'https://studio.asyncapi.com/'
}
```

---

## 💻 Using AsyncAPI in Development

### Validate Against Schema

```javascript
// Example: Validate incoming message
const Ajv = require('ajv');
const asyncApiSpec = require('./CHATBOT_ASYNCAPI.yaml');

const ajv = new Ajv();
const validate = ajv.compile(asyncApiSpec.components.schemas.Message);

const message = { role: 'user', content: 'Hello', timestamp: '...' };
const valid = validate(message);

if (!valid) {
  console.error('Invalid message:', validate.errors);
}
```

### Generate Code

Using AsyncAPI tools, you can generate:

```bash
# Generate client code
async-api-codegen generate --spec CHATBOT_ASYNCAPI.yaml --client

# Generate server code
async-api-codegen generate --spec CHATBOT_ASYNCAPI.yaml --server

# Generate models
async-api-codegen generate --spec CHATBOT_ASYNCAPI.yaml --models
```

---

## 🔐 Security in AsyncAPI

The specification includes security considerations:

```yaml
x-metadata:
  authentication:
    - type: userId
      description: User identification
      location: message payload
  rateLimit:
    messagesPerSecond: 10
    maxConnections: 1000
```

**Security Practices**:
- ✅ userId per connection
- ✅ Rate limiting (10 msgs/sec)
- ✅ Max connections (1000)
- ✅ Error handling for auth
- ✅ Connection cleanup on disconnect

---

## 📈 Event Metadata

Each event includes useful metadata:

### x-response-event
Specifies which event to expect in response:

```yaml
join-chat:
  x-response-event: chat-started
```

### x-triggered-by
Specifies which client event triggers this server event:

```yaml
bot-response:
  x-triggered-by:
    - send-message
    - analyze-product
```

### x-example-response
Shows what response to expect:

```yaml
send-message:
  x-example-response:
    event: bot-response
    message: "To export coffee..."
    timestamp: "2024-12-04T..."
```

---

## 🎯 Common Use Cases

### Use Case 1: Frontend Integration

```javascript
// From AsyncAPI spec, you know:
// 1. Payload format for send-message
// 2. Response format of bot-response
// 3. When bot-typing is sent

socket.emit('send-message', {
  userId: 'user123',
  message: 'How do I export?'
});

socket.on('bot-typing', (data) => {
  showTypingIndicator(); // From spec: bot-typing event
});

socket.on('bot-response', (data) => {
  displayMessage(data.message); // From spec: message field
});
```

### Use Case 2: Testing

```javascript
// From AsyncAPI spec, generate test cases:
const testCases = [
  {
    name: 'send-message test',
    event: 'send-message',
    payload: {
      userId: 'user123',
      message: 'How to export?'
    },
    expectedResponse: 'bot-response'
  }
];
```

### Use Case 3: API Mocking

```javascript
// Create mock based on AsyncAPI spec
const mockEvent = {
  event: 'bot-response',
  userId: 'user123',
  message: 'Mock response...',
  timestamp: new Date().toISOString()
};
```

---

## 📚 Additional Resources

### AsyncAPI Documentation
- **Official Docs**: https://www.asyncapi.com/docs/
- **AsyncAPI Studio**: https://studio.asyncapi.com/
- **Specification**: https://www.asyncapi.com/docs/specifications/v3.0.0

### Related Files in This Project
- `CHATBOT_SETUP.md` - Frontend implementation
- `CHATBOT_WEBSOCKET_README.md` - WebSocket API guide
- `SWAGGER_DOCUMENTATION_GUIDE.md` - REST API guide
- `packages/backend/src/index.js` - Swagger spec with AsyncAPI link

---

## 🔄 Workflow: From Spec to Implementation

### Step 1: Define Events in AsyncAPI
```yaml
# Done! See CHATBOT_ASYNCAPI.yaml
```

### Step 2: Reference in Swagger
```javascript
// Done! See index.js x-asyncapi extension
```

### Step 3: Implement in Code
```javascript
// src/websocket/ChatbotWebSocketHandler.js
// Follow the event structure from AsyncAPI spec
```

### Step 4: Document in Guides
```
// Done! See CHATBOT_SETUP.md, CHATBOT_WEBSOCKET_README.md
```

### Step 5: Share with Team
```
// Share AsyncAPI URL: /docs/CHATBOT_ASYNCAPI.yaml
// Share AsyncAPI Studio link
```

---

## ✅ Validation Checklist

- [x] AsyncAPI 3.0.0 specification created
- [x] All 8 client events documented
- [x] All 6 server events documented
- [x] Payload schemas defined
- [x] Example payloads provided
- [x] Tags and categories added
- [x] Operations section complete
- [x] Metadata and links included
- [x] Security considerations noted
- [x] Rate limiting specified

---

## 🎉 Summary

**AsyncAPI provides:**
✅ Standard format for WebSocket/async APIs
✅ Clear event structure and payload schemas
✅ Interactive documentation (AsyncAPI Studio)
✅ Code generation capabilities
✅ Better than OpenAPI for async protocols

**You now have:**
✅ Complete AsyncAPI specification (CHATBOT_ASYNCAPI.yaml)
✅ Reference in Swagger documentation
✅ All events documented with examples
✅ Clear payload structure definitions
✅ Ready for team collaboration

---

## 📍 Access Points

### View AsyncAPI Specification
```
File: packages/backend/CHATBOT_ASYNCAPI.yaml
```

### View in AsyncAPI Studio (Recommended)
```
1. Go to: https://studio.asyncapi.com/
2. Upload: CHATBOT_ASYNCAPI.yaml
3. Explore: Interactive documentation
```

### Reference in Swagger
```
When viewing Swagger at: http://localhost:3001/api-docs
See x-websocket section with AsyncAPI link
```

---

**Version**: 1.0
**Date**: December 4, 2025
**Specification**: AsyncAPI 3.0.0
**Status**: ✅ Complete
