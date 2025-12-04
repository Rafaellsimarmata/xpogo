const axios = require('axios');

/**
 * Document Assistant Service
 * Helps small enterprises generate export documentation using AI
 */
class DocumentAssistantService {
  constructor() {
    this.apiBaseUrl = process.env.AI_API_BASE_URL || 'https://api.kolosal.ai/v1';
    this.secretToken = process.env.AI_SECRET_TOKEN;
    this.model = process.env.AI_MODEL || 'meta-llama/llama-4-maverick-17b-128e-instruct';
  }

  /**
   * Generate Product Description for Export
   * Helps create a professional product description for export documentation
   */
  async generateProductDescription(productData) {
    const {
      productName,
      category,
      features,
      targetMarket,
      specifications,
    } = productData;

    const prompt = `You are an expert export documentation specialist for small enterprises.
    
Generate a professional, export-ready product description for the following product:

Product Name: ${productName}
Category: ${category}
Key Features: ${features || 'Not specified'}
Target Market: ${targetMarket || 'International'}
Specifications: ${specifications || 'Not specified'}

Please provide:
1. Executive Summary (2-3 sentences)
2. Detailed Product Description (highlighting export benefits)
3. Key Selling Points (3-5 bullet points)
4. Compliance & Certifications (recommended standards for export)
5. Packaging & Shipping Information

Format the response in a clear, professional manner suitable for export documentation.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        model: this.model,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating product description:', error.message);
      throw new Error(`Failed to generate product description: ${error.message}`);
    }
  }

  /**
   * Generate Export Compliance Document
   * Creates a compliance checklist for export requirements
   */
  async generateComplianceDocument(productData) {
    const {
      productName,
      origin,
      destinationCountries,
      productType,
    } = productData;

    const prompt = `You are an expert in international trade compliance.

Generate an export compliance checklist for the following product:

Product Name: ${productName}
Country of Origin: ${origin}
Destination Countries: ${destinationCountries || 'Multiple'}
Product Type: ${productType}

Please provide a comprehensive compliance document including:
1. Documentation Requirements (HS Code, Certificate of Origin, etc.)
2. Import Regulations by Destination
3. Required Certifications (CE, FDA, ISO, etc.)
4. Labeling & Packaging Requirements
5. Quality Standards
6. Payment & Incoterms Options
7. Insurance & Risk Management

Format as a professional checklist suitable for export operations.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'compliance_checklist',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating compliance document:', error.message);
      throw new Error(`Failed to generate compliance document: ${error.message}`);
    }
  }

  /**
   * Generate Invoice Template/Sample
   * Creates a professional export invoice template
   */
  async generateInvoiceTemplate(companyData) {
    const {
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      invoiceTerms,
    } = companyData;

    const prompt = `You are an expert in international commerce documentation.

Create a professional export invoice template for:

Company: ${companyName}
Address: ${companyAddress}
Contact: ${companyPhone} / ${companyEmail}
Payment Terms: ${invoiceTerms || 'NET 30'}

Please generate:
1. Professional Invoice Header Section
2. Company Details Format
3. Buyer Information Section
4. Item/Product Line Items Table Structure
5. Tax & Duties Calculation Section
6. Incoterms & Shipping Terms Section
7. Payment Terms & Bank Details Section
8. Footer with Legal Terms

Provide it as a structured JSON-like format that can be used as a template for invoices.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'invoice_template',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating invoice template:', error.message);
      throw new Error(`Failed to generate invoice template: ${error.message}`);
    }
  }

  /**
   * Generate Packing List / Shipping Documentation
   * Creates a detailed packing list for shipments
   */
  async generatePackingList(shipmentData) {
    const {
      productNames,
      quantities,
      totalWeight,
      destination,
      shipmentDate,
      packagingType,
    } = shipmentData;

    const prompt = `You are an expert in international shipping documentation.

Create a professional packing list for export shipment:

Products: ${productNames}
Quantities: ${quantities}
Total Weight: ${totalWeight}
Destination: ${destination}
Shipment Date: ${shipmentDate}
Packaging Type: ${packagingType}

Please generate a comprehensive packing list including:
1. Shipment Header (reference numbers, dates)
2. Shipper & Consignee Information
3. Product Details Table (with descriptions, quantities, weights)
4. Total Weight & Dimensions
5. Special Handling Instructions
6. Customs Declarations Section
7. Carrier Information Section
8. Signature & Certification Lines

Format it as professional documentation suitable for customs clearance.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'packing_list',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating packing list:', error.message);
      throw new Error(`Failed to generate packing list: ${error.message}`);
    }
  }

  /**
   * Generate Bill of Lading / Shipping Agreement
   * Creates a bill of lading for sea/air freight
   */
  async generateBillOfLading(shippingData) {
    const {
      shipperName,
      consigneeName,
      notifyParty,
      portOfLoading,
      portOfDischarge,
      carrierName,
      shipmentDate,
    } = shippingData;

    const prompt = `You are an expert in international maritime/shipping documentation.

Create a professional Bill of Lading (B/L) for:

Shipper: ${shipperName}
Consignee: ${consigneeName}
Notify Party: ${notifyParty || 'As per consignee'}
Port of Loading: ${portOfLoading}
Port of Discharge: ${portOfDischarge}
Carrier: ${carrierName}
Shipment Date: ${shipmentDate}

Please generate a complete Bill of Lading with:
1. B/L Header & Reference Numbers
2. Shipper, Consignee, Notify Party Details
3. Port of Loading & Discharge
4. Shipping Vessel Information
5. Goods Description Section
6. Weight & Volume Details
7. Freight & Charges Terms
8. Incoterms & Responsibility Clauses
9. Terms & Conditions
10. Signature Blocks

Format as professional maritime documentation.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'bill_of_lading',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating bill of lading:', error.message);
      throw new Error(`Failed to generate bill of lading: ${error.message}`);
    }
  }

  /**
   * Generate Export Proforma Invoice
   * Creates a proforma invoice for export quotation
   */
  async generateProformaInvoice(quoteData) {
    const {
      companyName,
      buyerName,
      products,
      quantities,
      unitPrices,
      paymentTerms,
      validityPeriod,
    } = quoteData;

    const prompt = `You are an expert in international trade documentation and quotations.

Create a professional Proforma Invoice for export quotation:

Seller: ${companyName}
Buyer: ${buyerName}
Products: ${products}
Quantities: ${quantities}
Unit Prices: ${unitPrices}
Payment Terms: ${paymentTerms}
Valid Until: ${validityPeriod}

Please generate a complete Proforma Invoice including:
1. Professional Header with Company Details
2. Proforma Invoice Number & Date
3. Buyer & Seller Information
4. Detailed Item Description Table (products, quantities, prices)
5. Subtotal, Taxes, & Total Amount
6. Payment Terms & Methods
7. Delivery Terms (Incoterms)
8. Validity Period
9. Terms & Conditions
10. Notes & Special Instructions

Format as professional international commerce document.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'proforma_invoice',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating proforma invoice:', error.message);
      throw new Error(`Failed to generate proforma invoice: ${error.message}`);
    }
  }

  /**
   * Generate Export Market Analysis
   * Analyzes target markets for product export
   */
  async generateMarketAnalysis(marketData) {
    const {
      productType,
      targetCountries,
      currentMarketShare,
      competitorInfo,
    } = marketData;

    const prompt = `You are an expert in international market research and export strategies.

Provide a market analysis for export:

Product Type: ${productType}
Target Countries: ${targetCountries}
Current Market Position: ${currentMarketShare || 'New entrant'}
Competitors: ${competitorInfo || 'Not specified'}

Please provide a comprehensive market analysis including:
1. Market Overview & Size Estimation
2. Target Country Market Potential
3. Competitor Analysis
4. Market Entry Strategy
5. Pricing Strategy for Export Markets
6. Distribution Channels & Logistics
7. Marketing & Promotion Recommendations
8. Risk Assessment & Mitigation
9. Growth Opportunities
10. Timeline & Implementation Plan

Make recommendations specific to small enterprises.`;

    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        content: response.data.choices[0].message.content,
        documentType: 'market_analysis',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating market analysis:', error.message);
      throw new Error(`Failed to generate market analysis: ${error.message}`);
    }
  }
}

module.exports = DocumentAssistantService;
