const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'XPogo Backend API',
    version: '0.1.0',
    description: 'Minimal API documentation for the XPogo backend'
  },
  servers: [
    {
      url: `http://localhost:${port}`
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service health information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    time: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/example': {
      get: {
        tags: ['Example'],
        summary: 'Example endpoint',
        responses: {
          '200': {
            description: 'Example response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    ts: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Welcome to xpogo backend', time: new Date().toISOString() });
});

app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from backend', ts: Date.now() });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
