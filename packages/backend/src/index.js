const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

// Load environment variables
const env = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, '..', `.env.${env}`);
dotenv.config();
try {
  dotenv.config({ path: envFile });
  console.log(`Loaded env from ${envFile}`);
} catch (err) {
  // ignore if file not present
}

const initDatabase = require('./config/initDb');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initDatabase();

const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'XPogo Backend API',
    version: '0.1.0',
    description: 'Minimal API documentation for the XPogo backend'
  },
  servers: [
    {
      url: backendUrl
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
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
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  username: { type: 'string' },
                  business_name: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'username', 'password']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User registered successfully'
          },
          '400': {
            description: 'Registration error'
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful, returns JWT token'
          },
          '401': {
            description: 'Invalid credentials'
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


app.use('/auth', authRoutes);

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
  console.log(`Swagger UI available at ${backendUrl.replace(/\/$/, '')}/api-docs`);
});
