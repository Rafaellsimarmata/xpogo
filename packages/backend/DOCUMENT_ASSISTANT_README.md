# Document Assistant API Documentation

## Overview

The Document Assistant API is a comprehensive AI-powered service designed to help small enterprises generate professional export documentation. It uses advanced AI models to create market-compliant documents that streamline the export process.

## Features

The Document Assistant provides the following capabilities:

### 1. **Product Description Generation** (`/product-description`)
- Generates professional, export-ready product descriptions
- Creates executive summaries and detailed descriptions
- Highlights export benefits and selling points
- Includes compliance recommendations

**Request Body:**
```json
{
  "productName": "Handcrafted Coffee Beans",
  "category": "Specialty Food & Beverages",
  "features": "Organic, Single Origin, Fair Trade",
  "targetMarket": "European Markets",
  "specifications": "250g Premium Grade"
}
```

### 2. **Export Compliance Document** (`/compliance`)
- Generates comprehensive compliance checklists
- Covers HS codes, certificates of origin
- Lists required certifications (CE, FDA, ISO)
- Includes labeling and packaging requirements by destination

**Request Body:**
```json
{
  "productName": "Textile Products",
  "origin": "Indonesia",
  "destinationCountries": "USA, EU, Japan",
  "productType": "Apparel"
}
```

### 3. **Invoice Template** (`/invoice-template`)
- Creates professional export invoice templates
- Includes tax and duties calculation sections
- Incoterms and shipping terms integration
- Payment terms and bank details sections

**Request Body:**
```json
{
  "companyName": "PT Maju Jaya Exports",
  "companyAddress": "Jakarta, Indonesia",
  "companyPhone": "+62-21-1234567",
  "companyEmail": "sales@majujaya.co.id",
  "invoiceTerms": "NET 30 Days"
}
```

### 4. **Packing List** (`/packing-list`)
- Generates detailed shipping packing lists
- Includes customs declaration sections
- Special handling instructions
- Weight and dimension specifications

**Request Body:**
```json
{
  "productNames": "Coffee Beans, Ground Coffee",
  "quantities": "100 boxes, 50 boxes",
  "totalWeight": "500kg",
  "destination": "Hamburg, Germany",
  "shipmentDate": "2024-12-10",
  "packagingType": "Cardboard Boxes with Plastic Liners"
}
```

### 5. **Bill of Lading** (`/bill-of-lading`)
- Creates maritime/shipping bill of lading documents
- Includes shipper, consignee, and notify party details
- Port information and vessel details
- Incoterms and responsibility clauses

**Request Body:**
```json
{
  "shipperName": "PT Maju Jaya Exports",
  "consigneeName": "Global Imports GmbH",
  "notifyParty": "Premium Coffee Distributors",
  "portOfLoading": "Port of Jakarta",
  "portOfDischarge": "Port of Hamburg",
  "carrierName": "Maersk Line",
  "shipmentDate": "2024-12-10"
}
```

### 6. **Proforma Invoice** (`/proforma-invoice`)
- Generates proforma invoices for export quotations
- Includes itemized product details
- Payment terms and validity periods
- Professional formatting for buyer review

**Request Body:**
```json
{
  "companyName": "PT Maju Jaya Exports",
  "buyerName": "Global Imports GmbH",
  "products": "Premium Arabica Coffee Beans",
  "quantities": "100 boxes",
  "unitPrices": "$45 per box",
  "paymentTerms": "30% Advance, 70% on Shipment",
  "validityPeriod": "30 days from issue"
}
```

### 7. **Market Analysis** (`/market-analysis`)
- Provides comprehensive market research reports
- Competitor analysis and market sizing
- Entry strategies and pricing recommendations
- Risk assessment and growth opportunities

**Request Body:**
```json
{
  "productType": "Specialty Coffee Beans",
  "targetCountries": "Germany, France, Netherlands, Belgium",
  "currentMarketShare": "New entrant",
  "competitorInfo": "Specialty coffee brands from Ethiopia, Colombia"
}
```

## Authentication

All Document Assistant endpoints require JWT authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Getting a Token
1. Register: `POST /auth/register`
2. Login: `POST /auth/login`
3. Use the returned JWT token for all Document Assistant requests

## API Endpoints

### Base URL
```
http://localhost:3001/document-assistant
```

### Endpoints Summary

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|----------------|
| `/product-description` | POST | Generate product export description | Yes |
| `/compliance` | POST | Generate compliance checklist | Yes |
| `/invoice-template` | POST | Generate invoice template | Yes |
| `/packing-list` | POST | Generate packing list | Yes |
| `/bill-of-lading` | POST | Generate bill of lading | Yes |
| `/proforma-invoice` | POST | Generate proforma invoice | Yes |
| `/market-analysis` | POST | Generate market analysis | Yes |

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "content": "Generated document content...",
  "documentType": "product_description|compliance_checklist|invoice_template|packing_list|bill_of_lading|proforma_invoice|market_analysis",
  "timestamp": "2024-12-02T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Common HTTP Status Codes

- `200 OK`: Document generated successfully
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid or missing JWT token
- `500 Internal Server Error`: Server-side processing error

## Use Cases

### Small Exporter Workflow

1. **Initial Setup**
   - User registers and logs in
   - Receives JWT token

2. **New Product Launch**
   - Generate product description using `/product-description`
   - Generate compliance document using `/compliance`
   - Review and customize as needed

3. **Quote Generation**
   - Generate proforma invoice using `/proforma-invoice`
   - Send to potential buyer

4. **Order Fulfillment**
   - Generate packing list using `/packing-list`
   - Generate bill of lading using `/bill-of-lading`
   - Arrange shipping and logistics

5. **Market Expansion**
   - Use `/market-analysis` to research new markets
   - Adapt products based on market insights

## Example Usage

### cURL Example

```bash
# 1. Register and Login
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "exporter@example.com",
    "username": "exporter",
    "password": "securepass123"
  }'

# 2. Login to get token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "exporter@example.com",
    "password": "securepass123"
  }'

# 3. Generate Product Description
curl -X POST http://localhost:3001/document-assistant/product-description \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "Premium Arabica Coffee",
    "category": "Specialty Beverages",
    "features": "Single Origin, Fair Trade Certified",
    "targetMarket": "European Market",
    "specifications": "100% Arabica Beans, Medium Roast"
  }'
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const baseURL = 'http://localhost:3001';

async function generateProductDescription(token, productData) {
  try {
    const response = await axios.post(
      `${baseURL}/document-assistant/product-description`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Generated Description:');
    console.log(response.data.content);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Usage
generateProductDescription(jwtToken, {
  productName: "Premium Arabica Coffee",
  category: "Specialty Beverages",
  features: "Single Origin, Fair Trade Certified",
  targetMarket: "European Market",
  specifications: "100% Arabica Beans, Medium Roast"
});
```

## Performance & Limitations

- **Document Generation Time**: 5-30 seconds depending on complexity
- **Maximum Content Length**: Up to 1500 tokens
- **Rate Limiting**: Consider implementing rate limiting for production
- **Concurrent Requests**: Limited by AI API provider

## Environment Configuration

The Document Assistant requires these environment variables:

```
AI_API_BASE_URL=https://api.kolosal.ai/v1
AI_SECRET_TOKEN=your_api_token
AI_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
```

## Troubleshooting

### "Unauthorized" Error
- Check if JWT token is included in Authorization header
- Verify token hasn't expired (default 7 days)
- Re-login to get a new token

### "Missing Required Field" Error
- Review the required fields for each endpoint
- Ensure all mandatory fields are provided in request body

### Slow Document Generation
- Check internet connectivity
- Verify AI API service is operational
- Consider implementing caching for similar requests

### AI API Errors
- Verify API credentials in environment variables
- Check if API service is up and running
- Review API documentation for rate limits

## Future Enhancements

- Document storage and retrieval
- Template customization and branding
- Multi-language support
- PDF export functionality
- Document versioning and history
- Batch document generation
- Integration with shipping providers
- Real-time collaboration features

## Support

For issues or questions:
1. Check API documentation in Swagger UI at `/api-docs`
2. Review error messages and troubleshooting section
3. Check application logs for detailed error information
4. Contact development team with reproducible examples

## License

This API is part of the XPogo platform and follows the project's license terms.
