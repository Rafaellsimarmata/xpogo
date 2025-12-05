const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

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
const documentAssistantRoutes = require('./routes/documentAssistant');
const chatbotRoutes = require('./routes/chatbot');
const ChatbotWebSocketHandler = require('./websocket/ChatbotWebSocketHandler');

const app = express();
const port = process.env.PORT || 3001;

// Determine realtime provider
const realtimeProvider = process.env.REALTIME_PROVIDER || 'socket.io';
const isDevelopment = env === 'development';

// Create HTTP server
const server = http.createServer(app);
let io = null;

// Setup Socket.io for development (or if explicitly configured)
if (realtimeProvider === 'socket.io' || isDevelopment) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Initialize Socket.io WebSocket handlers for development
  const ChatbotWebSocketHandler = require('./websocket/ChatbotWebSocketHandler');
  const chatbotHandler = new ChatbotWebSocketHandler(io);
  console.log('Socket.io initialized (development mode)');
  chatbotHandler.initialize();
}

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
  externalDocs: {
    description: 'WebSocket API Documentation (AsyncAPI 3.0.0) - View event-driven communication patterns',
    url: 'https://studio.asyncapi.com/'
    // url: 'https://studio.asyncapi.com/url=github.com/your-repo-path/CHATBOT_ASYNCAPI.yaml'
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
    '/document-assistant/product-description': {
      post: {
        tags: ['Document Assistant'],
        summary: 'Generate product export description',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productName: { type: 'string', description: 'Name of the product' },
                  category: { type: 'string', description: 'Product category' },
                  features: { type: 'string', description: 'Key features of the product' },
                  targetMarket: { type: 'string', description: 'Target export market' },
                  specifications: { type: 'string', description: 'Product specifications' }
                },
                required: ['productName']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Product description generated successfully'
          },
          '400': {
            description: 'Missing required fields'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate product description'
          }
        }
      }
    },
    '/document-assistant/compliance': {
      post: {
        tags: ['Document Assistant'],
        summary: 'Generate export compliance checklist',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productName: { type: 'string', description: 'Name of the product' },
                  origin: { type: 'string', description: 'Country of origin' },
                  destinationCountries: { type: 'string', description: 'Destination countries' },
                  productType: { type: 'string', description: 'Type of product' }
                },
                required: ['productName']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Compliance document generated successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate compliance document'
          }
        }
      }
    },
    '/document-assistant/invoice-template': {
      post: {
        tags: ['Document Assistant'],
        summary: 'Generate export invoice template',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  companyName: { type: 'string', description: 'Name of the company' },
                  companyAddress: { type: 'string', description: 'Company address' },
                  companyPhone: { type: 'string', description: 'Company phone number' },
                  companyEmail: { type: 'string', description: 'Company email' },
                  invoiceTerms: { type: 'string', description: 'Invoice payment terms' }
                },
                required: ['companyName']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Invoice template generated successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate invoice template'
          }
        }
      }
    },
    '/document-assistant/packing-list': {
      post: {
        tags: ['Document Assistant'],
        summary: 'Generate packing list for shipment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productNames: { type: 'string', description: 'Names of products' },
                  quantities: { type: 'string', description: 'Product quantities' },
                  totalWeight: { type: 'string', description: 'Total shipment weight' },
                  destination: { type: 'string', description: 'Destination country/port' },
                  shipmentDate: { type: 'string', description: 'Shipment date' },
                  packagingType: { type: 'string', description: 'Type of packaging' }
                },
                required: ['productNames', 'destination']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Packing list generated successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate packing list'
          }
        }
      }
    },
    '/document-assistant/bill-of-lading': {
      post: {
        tags: ['Document Assistant'],
        summary: 'Generate bill of lading for shipment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  shipperName: { type: 'string', description: 'Name of the shipper' },
                  consigneeName: { type: 'string', description: 'Name of the consignee' },
                  notifyParty: { type: 'string', description: 'Notify party information' },
                  portOfLoading: { type: 'string', description: 'Port of loading' },
                  portOfDischarge: { type: 'string', description: 'Port of discharge' },
                  carrierName: { type: 'string', description: 'Name of the carrier' },
                  shipmentDate: { type: 'string', description: 'Shipment date' }
                },
                required: ['shipperName', 'consigneeName', 'portOfLoading', 'portOfDischarge']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Bill of lading generated successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate bill of lading'
          }
        }
      }
    },
    '/document-assistant/proforma-invoice': {
      post: {
        tags: ['Document Assistant'],
        summary: 'Generate proforma invoice for quotation',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  companyName: { type: 'string', description: 'Seller company name' },
                  buyerName: { type: 'string', description: 'Buyer company name' },
                  products: { type: 'string', description: 'Products to be invoiced' },
                  quantities: { type: 'string', description: 'Product quantities' },
                  unitPrices: { type: 'string', description: 'Unit prices' },
                  paymentTerms: { type: 'string', description: 'Payment terms' },
                  validityPeriod: { type: 'string', description: 'Validity period of the quote' }
                },
                required: ['companyName', 'buyerName', 'products']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Proforma invoice generated successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate proforma invoice'
          }
        }
      }
    },
    '/document-assistant/market-analysis': {
      post: {
        tags: ['Document Assistant'],
        summary: 'Generate export market analysis',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productType: { type: 'string', description: 'Type of product' },
                  targetCountries: { type: 'string', description: 'Target countries for export' },
                  currentMarketShare: { type: 'string', description: 'Current market position' },
                  competitorInfo: { type: 'string', description: 'Competitor information' }
                },
                required: ['productType']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Market analysis generated successfully'
          },
          '401': {
            description: 'Unauthorized - no valid token'
          },
          '500': {
            description: 'Failed to generate market analysis'
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

const swaggerUiOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customCdnPrefix: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@3',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js'
  ]
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use('/auth', authRoutes);

app.use('/market-intelligence', marketIntelligenceRoutes);

app.use('/document-assistant', documentAssistantRoutes);

// Chatbot routes - works with both Socket.io (dev) and Supabase Realtime (prod)
app.use('/api/chatbot', chatbotRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Welcome to xpogo backend', time: new Date().toISOString() });
});

app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from backend', ts: Date.now() });
});

server.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
  console.log(`Swagger UI available at ${backendUrl.replace(/\/$/, '')}/api-docs`);
  console.log(`WebSocket (Socket.io) available at ws://localhost:${port}`);
});
