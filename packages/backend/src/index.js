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
const marketIntelligenceRoutes = require('./routes/marketIntelligence');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Static files for Swagger UI (fixes CSS/JS loading on Vercel)
app.use(express.static('node_modules/swagger-ui-dist'));

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
    '/market-intelligence/analyze': {
      post: {
        tags: ['Market Intelligence'],
        summary: 'Analyze market intelligence for a product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productName: { type: 'string', description: 'Name of the product to analyze' }
                },
                required: ['productName']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Market intelligence generated successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate market intelligence'
          }
        }
      }
    },
    '/market-intelligence/parse-data': {
      post: {
        tags: ['Market Intelligence'],
        summary: 'Parse market data from AI response',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  aiResponse: { type: 'string', description: 'Raw AI response containing market data table' }
                },
                required: ['aiResponse']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Data parsed successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to parse data'
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

// Swagger UI custom options for proper CSS/JS loading (works on Vercel with CDN)
const swaggerUiOptions = {
  customCss: '.swagger-ui { max-width: 1200px; margin: 0 auto; }',
  customCdnPrefix: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@3',
  customSiteTitle: 'XPogo API Documentation',
  swaggerOptions: {
    deepLinking: true,
    displayOperationId: false,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use('/auth', authRoutes);

app.use('/market-intelligence', marketIntelligenceRoutes);

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
