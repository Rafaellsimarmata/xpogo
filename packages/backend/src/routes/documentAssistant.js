const express = require('express');
const DocumentAssistantController = require('../controllers/DocumentAssistantController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /document-assistant/product-description:
 *   post:
 *     tags: ['Document Assistant']
 *     summary: Generate product export description
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Name of the product
 *               category:
 *                 type: string
 *                 description: Product category
 *               features:
 *                 type: string
 *                 description: Key features of the product
 *               targetMarket:
 *                 type: string
 *                 description: Target export market
 *               specifications:
 *                 type: string
 *                 description: Product specifications
 *             required: ['productName']
 *     responses:
 *       200:
 *         description: Product description generated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/product-description', authMiddleware, DocumentAssistantController.generateProductDescription);

/**
 * @swagger
 * /document-assistant/compliance:
 *   post:
 *     tags: ['Document Assistant']
 *     summary: Generate export compliance checklist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               origin:
 *                 type: string
 *               destinationCountries:
 *                 type: string
 *               productType:
 *                 type: string
 *             required: ['productName']
 *     responses:
 *       200:
 *         description: Compliance document generated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/compliance', authMiddleware, DocumentAssistantController.generateComplianceDocument);

/**
 * @swagger
 * /document-assistant/invoice-template:
 *   post:
 *     tags: ['Document Assistant']
 *     summary: Generate export invoice template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               companyAddress:
 *                 type: string
 *               companyPhone:
 *                 type: string
 *               companyEmail:
 *                 type: string
 *               invoiceTerms:
 *                 type: string
 *             required: ['companyName']
 *     responses:
 *       200:
 *         description: Invoice template generated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/invoice-template', authMiddleware, DocumentAssistantController.generateInvoiceTemplate);

/**
 * @swagger
 * /document-assistant/packing-list:
 *   post:
 *     tags: ['Document Assistant']
 *     summary: Generate packing list for shipment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productNames:
 *                 type: string
 *               quantities:
 *                 type: string
 *               totalWeight:
 *                 type: string
 *               destination:
 *                 type: string
 *               shipmentDate:
 *                 type: string
 *               packagingType:
 *                 type: string
 *             required: ['productNames', 'destination']
 *     responses:
 *       200:
 *         description: Packing list generated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/packing-list', authMiddleware, DocumentAssistantController.generatePackingList);

/**
 * @swagger
 * /document-assistant/bill-of-lading:
 *   post:
 *     tags: ['Document Assistant']
 *     summary: Generate bill of lading for shipment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipperName:
 *                 type: string
 *               consigneeName:
 *                 type: string
 *               notifyParty:
 *                 type: string
 *               portOfLoading:
 *                 type: string
 *               portOfDischarge:
 *                 type: string
 *               carrierName:
 *                 type: string
 *               shipmentDate:
 *                 type: string
 *             required: ['shipperName', 'consigneeName', 'portOfLoading', 'portOfDischarge']
 *     responses:
 *       200:
 *         description: Bill of lading generated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/bill-of-lading', authMiddleware, DocumentAssistantController.generateBillOfLading);

/**
 * @swagger
 * /document-assistant/proforma-invoice:
 *   post:
 *     tags: ['Document Assistant']
 *     summary: Generate proforma invoice for quotation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               buyerName:
 *                 type: string
 *               products:
 *                 type: string
 *               quantities:
 *                 type: string
 *               unitPrices:
 *                 type: string
 *               paymentTerms:
 *                 type: string
 *               validityPeriod:
 *                 type: string
 *             required: ['companyName', 'buyerName', 'products']
 *     responses:
 *       200:
 *         description: Proforma invoice generated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/proforma-invoice', authMiddleware, DocumentAssistantController.generateProformaInvoice);

/**
 * @swagger
 * /document-assistant/market-analysis:
 *   post:
 *     tags: ['Document Assistant']
 *     summary: Generate export market analysis
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productType:
 *                 type: string
 *               targetCountries:
 *                 type: string
 *               currentMarketShare:
 *                 type: string
 *               competitorInfo:
 *                 type: string
 *             required: ['productType']
 *     responses:
 *       200:
 *         description: Market analysis generated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/market-analysis', authMiddleware, DocumentAssistantController.generateMarketAnalysis);

module.exports = router;
