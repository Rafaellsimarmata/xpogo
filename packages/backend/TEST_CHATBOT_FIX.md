# Chatbot Endpoint Fix - Testing Guide

## ✅ What Was Fixed

The error you encountered was:
```
Error handling join-chat: tried to push 'undefined' to 'realtime:user-1' before joining. 
Use channel.subscribe() before pushing events
```

### Root Cause
The Supabase Realtime channel wasn't being subscribed to before attempting to broadcast messages.

### Solution Applied
Modified `ChatbotSupabaseRealtimeHandler.js`:
1. **Store channels**: Channels are now stored in `userConnections` Map to reuse them
2. **Subscribe first**: `channel.subscribe()` is called before any broadcast
3. **Graceful fallback**: Broadcasting is optional - if Supabase isn't configured, it skips gracefully
4. **Cleanup method**: Added `cleanupUserConnection()` to properly unsubscribe channels

---

## 🧪 How to Test

### 1. Start Your Backend Server
```bash
cd packages/backend
npm run dev
```

You should see:
```
✓ Socket.io initialized (development mode)
✓ Initializing Supabase Realtime Handler...
```

### 2. Get a JWT Token

First, register a user (or login):
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Or login:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

Copy the `token` from the response.

### 3. Test Join Endpoint
```bash
curl -X POST http://localhost:3001/api/chatbot/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "userName": "TestUser"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Chat initialized",
  "userId": 1
}
```

**Expected Logs:**
```
Channel subscription status: SUBSCRIBED
```

### 4. Test Send Message Endpoint
```bash
curl -X POST http://localhost:3001/api/chatbot/send-message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "How do I export coffee?"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "How do I export coffee?",
  "response": "...",
  "timestamp": "2025-12-05T..."
}
```

### 5. Test History Endpoint
```bash
curl -X GET http://localhost:3001/api/chatbot/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "messages": [
    {"role": "user", "content": "How do I export coffee?"},
    {"role": "assistant", "content": "..."},
    ...
  ]
}
```

---

## 🔍 Debugging

### If you still see channel errors:

1. **Check Supabase Configuration**
   ```bash
   echo "SUPABASE_URL: $SUPABASE_URL"
   echo "SUPABASE_KEY: ${SUPABASE_KEY:0:20}..."
   ```

2. **Enable Debug Logging**
   Add to `ChatbotSupabaseRealtimeHandler.js` in `broadcastMessage()`:
   ```javascript
   console.log('Broadcasting to channel:', channelName);
   console.log('Channel status:', channel?.status);
   ```

3. **Check if Supabase Realtime is Enabled**
   - Go to Supabase Dashboard
   - Project Settings → Realtime
   - Ensure Realtime is enabled for your tables

4. **Verify JWT Auth Middleware**
   - Ensure token is valid
   - Check `authMiddleware.js` is working correctly

---

## 📋 What Changed in the Code

### Before (Broken)
```javascript
async broadcastMessage(userId, event, data) {
  const channel = this.supabase
    .channel(`user-${userId}`)
    .send('broadcast', {  // ❌ ERROR: Not subscribed yet!
      event,
      data
    });
}
```

### After (Fixed)
```javascript
async broadcastMessage(userId, event, data) {
  const channelName = `user-${userId}`;
  
  // Get existing channel or create new one
  let channel = this.userConnections.get(channelName);
  
  if (!channel) {
    // Create and SUBSCRIBE first
    channel = this.supabase.channel(channelName);
    channel = await channel.subscribe((status) => {
      console.log(`Channel subscription status: ${status}`);
    });
    this.userConnections.set(channelName, channel);
  }

  // Now it's safe to broadcast
  channel.send('broadcast', { event, data });
}
```

### New Cleanup Method
```javascript
async cleanupUserConnection(userId) {
  const channelName = `user-${userId}`;
  const channel = this.userConnections.get(channelName);
  
  if (channel) {
    await channel.unsubscribe();
    this.userConnections.delete(channelName);
  }
}
```

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Register/Login endpoint works
- [ ] Get valid JWT token
- [ ] POST `/api/chatbot/join` succeeds (no "before joining" error)
- [ ] See "Channel subscription status: SUBSCRIBED" in logs
- [ ] POST `/api/chatbot/send-message` works
- [ ] GET `/api/chatbot/history` returns messages
- [ ] Database tables have data (check pgAdmin or psql)

---

## 🚀 Next Steps

Once testing passes locally:

1. **Update Frontend** to use REST API instead of Socket.io
   - See `FRONTEND_CHATBOT_INTEGRATION.md`

2. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "Fix: Supabase Realtime channel subscription"
   git push
   ```

3. **Configure Environment Variables in Vercel**
   - Set `REALTIME_PROVIDER=supabase`
   - Set Supabase credentials

4. **Test in Production**
   - Use Vercel deployment URL
   - Test all chatbot endpoints

---

## 💡 Key Points

✅ **Channels are now persistent** - Reused for the same user
✅ **Subscriptions are cached** - Better performance  
✅ **Graceful degradation** - Works even if Supabase isn't configured
✅ **Proper cleanup** - `cleanupUserConnection()` prevents memory leaks
✅ **No throwing errors** - Broadcasting failures don't crash endpoints

---

**Status**: ✅ Fixed and ready for testing
**Date**: December 5, 2025
