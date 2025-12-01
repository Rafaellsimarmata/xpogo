const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from backend', ts: Date.now() });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
