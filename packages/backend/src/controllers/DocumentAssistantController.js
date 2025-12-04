const DocumentAssistantService = require('../services/DocumentAssistantService');

class DocumentAssistantController {
  static async generateProductDescription(req, res) {
    try {
      const { productName, category, features, targetMarket, specifications } = req.body;

      if (!productName) {
        return res.status(400).json({
          success: false,
          error: 'productName is required',
        });
      }

      const service = new DocumentAssistantService();
      const result = await service.generateProductDescription({
        productName,
        category,
        features,
        targetMarket,
        specifications,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateProductDescription:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async generateComplianceDocument(req, res) {
    try {
      const { productName, origin, destinationCountries, productType } = req.body;

      if (!productName) {
        return res.status(400).json({
          success: false,
          error: 'productName is required',
        });
      }

      const service = new DocumentAssistantService();
      const result = await service.generateComplianceDocument({
        productName,
        origin,
        destinationCountries,
        productType,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateComplianceDocument:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async generateInvoiceTemplate(req, res) {
    try {
      const { companyName, companyAddress, companyPhone, companyEmail, invoiceTerms } = req.body;

      if (!companyName) {
        return res.status(400).json({
          success: false,
          error: 'companyName is required',
        });
      }

      const service = new DocumentAssistantService();
      const result = await service.generateInvoiceTemplate({
        companyName,
        companyAddress,
        companyPhone,
        companyEmail,
        invoiceTerms,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateInvoiceTemplate:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async generatePackingList(req, res) {
    try {
      const { productNames, quantities, totalWeight, destination, shipmentDate, packagingType } = req.body;

      if (!productNames || !destination) {
        return res.status(400).json({
          success: false,
          error: 'productNames and destination are required',
        });
      }

      const service = new DocumentAssistantService();
      const result = await service.generatePackingList({
        productNames,
        quantities,
        totalWeight,
        destination,
        shipmentDate,
        packagingType,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generatePackingList:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async generateBillOfLading(req, res) {
    try {
      const {
        shipperName,
        consigneeName,
        notifyParty,
        portOfLoading,
        portOfDischarge,
        carrierName,
        shipmentDate,
      } = req.body;

      if (!shipperName || !consigneeName || !portOfLoading || !portOfDischarge) {
        return res.status(400).json({
          success: false,
          error: 'shipperName, consigneeName, portOfLoading, and portOfDischarge are required',
        });
      }

      const service = new DocumentAssistantService();
      const result = await service.generateBillOfLading({
        shipperName,
        consigneeName,
        notifyParty,
        portOfLoading,
        portOfDischarge,
        carrierName,
        shipmentDate,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateBillOfLading:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async generateProformaInvoice(req, res) {
    try {
      const { companyName, buyerName, products, quantities, unitPrices, paymentTerms, validityPeriod } =
        req.body;

      if (!companyName || !buyerName || !products) {
        return res.status(400).json({
          success: false,
          error: 'companyName, buyerName, and products are required',
        });
      }

      const service = new DocumentAssistantService();
      const result = await service.generateProformaInvoice({
        companyName,
        buyerName,
        products,
        quantities,
        unitPrices,
        paymentTerms,
        validityPeriod,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateProformaInvoice:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async generateMarketAnalysis(req, res) {
    try {
      const { productType, targetCountries, currentMarketShare, competitorInfo } = req.body;

      if (!productType) {
        return res.status(400).json({
          success: false,
          error: 'productType is required',
        });
      }

      const service = new DocumentAssistantService();
      const result = await service.generateMarketAnalysis({
        productType,
        targetCountries,
        currentMarketShare,
        competitorInfo,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateMarketAnalysis:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = DocumentAssistantController;
