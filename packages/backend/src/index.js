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
const countriesRoutes = require('./routes/countries');
const productsRoutes = require('./routes/products');
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
    '/api/chatbot/join': {
      post: {
        tags: ['Chatbot'],
        summary: 'Join chat session',
        description: 'Initialize a chat session with the AI chatbot. Creates a new conversation record.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userName: { 
                    type: 'string',
                    description: 'Display name for the user in chat',
                    example: 'John Doe'
                  }
                },
                required: ['userName']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Chat session initialized successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    userId: { type: 'integer' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required field: userName'
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error initializing chat session'
          }
        }
      }
    },
    '/api/chatbot/send-message': {
      post: {
        tags: ['Chatbot'],
        summary: 'Send message to chatbot',
        description: 'Send a message to the AI chatbot and receive a response. Messages are persisted in the database.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { 
                    type: 'string',
                    description: 'Message content to send to the chatbot',
                    example: 'How do I export coffee to the US?'
                  }
                },
                required: ['message']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Message processed successfully, bot response returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string', description: 'Original user message' },
                    response: { type: 'string', description: 'AI chatbot response' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required field: message'
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error processing message'
          }
        }
      }
    },
    '/api/chatbot/history': {
      get: {
        tags: ['Chatbot'],
        summary: 'Get conversation history',
        description: 'Retrieve the complete message history for the current user\'s conversation.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Conversation history retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    messages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                          content: { type: 'string' },
                          created_at: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error retrieving history'
          }
        }
      }
    },
    '/api/chatbot/clear': {
      post: {
        tags: ['Chatbot'],
        summary: 'Clear conversation',
        description: 'Clear the current conversation. Marks the conversation as inactive.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Conversation cleared successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error clearing conversation'
          }
        }
      }
    },
    '/api/chatbot/analyze-product': {
      post: {
        tags: ['Chatbot'],
        summary: 'Analyze product for export',
        description: 'Get AI analysis of a product for export viability, market potential, and export requirements.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productInfo: { 
                    type: 'string',
                    description: 'Description of the product including name, specifications, and features',
                    example: 'Premium Ethiopian coffee beans, medium roast, 1kg bags'
                  }
                },
                required: ['productInfo']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Product analysis completed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    analysis: { type: 'string', description: 'AI-generated product analysis' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required field: productInfo'
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error analyzing product'
          }
        }
      }
    },
    '/api/chatbot/market-strategy': {
      post: {
        tags: ['Chatbot'],
        summary: 'Get market entry strategy',
        description: 'Receive AI-generated market entry strategy for exporting to specific countries.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  marketInfo: { 
                    type: 'string',
                    description: 'Information about target market, product, and current business status',
                    example: 'Product: Coffee, Target: USA Market, Currently exporting to 2 countries'
                  }
                },
                required: ['marketInfo']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Market strategy generated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    strategy: { type: 'string', description: 'AI-generated market entry strategy' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required field: marketInfo'
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error generating strategy'
          }
        }
      }
    },
    '/api/chatbot/compliance-guidance': {
      post: {
        tags: ['Chatbot'],
        summary: 'Get compliance guidance',
        description: 'Receive AI guidance on export compliance requirements, certifications, and regulations.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  complianceQuery: { 
                    type: 'string',
                    description: 'Your compliance question or scenario',
                    example: 'What certifications do I need to export organic coffee to Europe?'
                  }
                },
                required: ['complianceQuery']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Compliance guidance provided successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    guidance: { type: 'string', description: 'AI-generated compliance guidance' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required field: complianceQuery'
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error retrieving guidance'
          }
        }
      }
    },
    '/api/chatbot/shipping-guidance': {
      post: {
        tags: ['Chatbot'],
        summary: 'Get shipping guidance',
        description: 'Receive AI guidance on shipping options, logistics, and best practices for export.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  shippingInfo: { 
                    type: 'string',
                    description: 'Information about your shipment and destination',
                    example: 'Exporting 1000kg of coffee beans from Ethiopia to USA'
                  }
                },
                required: ['shippingInfo']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Shipping guidance provided successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    guidance: { type: 'string', description: 'AI-generated shipping guidance' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required field: shippingInfo'
          },
          '401': {
            description: 'Unauthorized - invalid or missing JWT token'
          },
          '500': {
            description: 'Server error retrieving guidance'
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
    },
    '/api/countries': {
      get: {
        tags: ['Countries'],
        summary: 'Get all countries',
        description: 'Retrieve a list of all countries in the world with optional filtering by region or search query. Perfect for export market selection.',
        parameters: [
          {
            name: 'region',
            in: 'query',
            description: 'Filter countries by region',
            schema: {
              type: 'string',
              enum: ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
            },
            example: 'Asia'
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search countries by name (partial match, case-insensitive)',
            schema: {
              type: 'string'
            },
            example: 'coffee'
          }
        ],
        responses: {
          '200': {
            description: 'List of countries retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 5 },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string', example: 'United States' },
                          code: { type: 'string', example: 'US' },
                          region: { type: 'string', example: 'Americas' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error retrieving countries'
          }
        }
      }
    },
    '/api/countries/{code}': {
      get: {
        tags: ['Countries'],
        summary: 'Get country by code',
        description: 'Retrieve detailed information about a specific country using its ISO 3166-1 alpha-2 country code.',
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            description: 'ISO 3166-1 alpha-2 country code (e.g., US, CN, IN)',
            schema: {
              type: 'string'
            },
            example: 'US'
          }
        ],
        responses: {
          '200': {
            description: 'Country information retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'United States' },
                        code: { type: 'string', example: 'US' },
                        region: { type: 'string', example: 'Americas' }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Country with the specified code not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Country with code XY not found' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error retrieving country'
          }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all Indonesian export products with optional filtering',
        description: 'Retrieve a comprehensive list of Indonesian export products that enterprises can add. Supports filtering by category, difficulty level, and search by name or description.',
        parameters: [
          {
            name: 'category',
            in: 'query',
            description: 'Filter by product category (Agricultural, Manufacturing, Mining, Energy, Artisan)',
            schema: { type: 'string' },
            example: 'Agricultural'
          },
          {
            name: 'difficulty',
            in: 'query',
            description: 'Filter by export difficulty level (Low, Medium, High)',
            schema: { type: 'string' },
            example: 'Medium'
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search products by name or description (partial match)',
            schema: { type: 'string' },
            example: 'coffee'
          }
        ],
        responses: {
          '200': {
            description: 'Successfully retrieved products list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 5 },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', example: 'coffee' },
                          name: { type: 'string', example: 'Coffee Beans' },
                          category: { type: 'string', example: 'Agricultural' },
                          description: { type: 'string', example: 'Premium robusta and arabica coffee beans' },
                          hs_code: { type: 'string', example: '0901' },
                          annual_exports_usd: { type: 'number', example: 1200000000 },
                          major_markets: { type: 'array', items: { type: 'string' }, example: ['Germany', 'United States'] },
                          difficulty_level: { type: 'string', example: 'Medium' }
                        }
                      }
                    }
                  }
                },
                examples: {
                  allProducts: {
                    summary: 'Get all products',
                    value: {
                      success: true,
                      count: 15,
                      data: [
                        {
                          id: 'coffee',
                          name: 'Coffee Beans',
                          category: 'Agricultural',
                          description: 'Premium robusta and arabica coffee beans from Indonesian plantations',
                          hs_code: '0901',
                          annual_exports_usd: 1200000000,
                          major_markets: ['Germany', 'United States', 'Italy'],
                          difficulty_level: 'Medium'
                        }
                      ]
                    }
                  },
                  filtered: {
                    summary: 'Filter by category',
                    value: {
                      success: true,
                      count: 3,
                      data: [
                        {
                          id: 'coffee',
                          name: 'Coffee Beans',
                          category: 'Agricultural',
                          hs_code: '0901',
                          annual_exports_usd: 1200000000,
                          major_markets: ['Germany', 'United States'],
                          difficulty_level: 'Medium'
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error retrieving products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Failed to fetch products' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a specific product by ID',
        description: 'Retrieve detailed information about a specific Indonesian export product',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product ID (e.g., coffee, palm-oil, rubber)',
            schema: { type: 'string' },
            example: 'coffee'
          }
        ],
        responses: {
          '200': {
            description: 'Successfully retrieved product details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'coffee' },
                        name: { type: 'string', example: 'Coffee Beans' },
                        category: { type: 'string', example: 'Agricultural' },
                        description: { type: 'string' },
                        hs_code: { type: 'string', example: '0901' },
                        annual_exports_usd: { type: 'number', example: 1200000000 },
                        major_markets: { type: 'array', items: { type: 'string' } },
                        difficulty_level: { type: 'string', example: 'Medium' }
                      }
                    }
                  }
                },
                example: {
                  success: true,
                  data: {
                    id: 'coffee',
                    name: 'Coffee Beans',
                    category: 'Agricultural',
                    description: 'Premium robusta and arabica coffee beans from Indonesian plantations',
                    hs_code: '0901',
                    annual_exports_usd: 1200000000,
                    major_markets: ['Germany', 'United States', 'Italy', 'France', 'Belgium'],
                    difficulty_level: 'Medium'
                  }
                }
              }
            }
          },
          '404': {
            description: 'Product with the specified ID not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Product with ID invalid-id not found' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error retrieving product'
          }
        }
      }
    },
    '/api/products/categories/list': {
      get: {
        tags: ['Products'],
        summary: 'Get all available product categories',
        description: 'Retrieve a list of all available product categories for filtering',
        responses: {
          '200': {
            description: 'Successfully retrieved categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 5 },
                    data: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['Agricultural', 'Artisan', 'Energy', 'Manufacturing', 'Mining']
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error retrieving categories'
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

// Countries routes
app.use('/api/countries', countriesRoutes);

// Products routes
app.use('/api/products', productsRoutes);

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
