import { useState } from 'react';

export default function Home() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkHealth() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({ status: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>XPogo Hackathon — Frontend</h1>
      <p>This is a minimal Next.js front-end that talks to the backend health endpoint.</p>
      <button onClick={checkHealth} disabled={loading}>
        {loading ? 'Checking...' : 'Check backend /health'}
      </button>
      {health && (
        <pre style={{ marginTop: 16, background: '#f6f8fa', padding: 12 }}>
          {JSON.stringify(health, null, 2)}
        </pre>
      )}
    </main>
  );
}
