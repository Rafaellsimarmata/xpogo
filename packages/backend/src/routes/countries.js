const express = require('express');
const countriesData = require('../data/countries.json');

const router = express.Router();

/**
 * @route   GET /api/countries
 * @desc    Get all countries with optional filtering
 * @access  Public
 * @query   {string} region - Filter by region (Africa, Americas, Asia, Europe, Oceania)
 * @query   {string} search - Search by country name (partial match)
 */
router.get('/', (req, res) => {
  try {
    const { region, search } = req.query;
    let results = [...countriesData];

    if (region) {
      const normalizedRegion = region.toLowerCase();
      results = results.filter(
        country => country.region.toLowerCase() === normalizedRegion
      );
    }

    if (search) {
      const normalizedSearch = search.toLowerCase();
      results = results.filter(
        country => country.name.toLowerCase().includes(normalizedSearch)
      );
    }

    results.sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch countries' 
    });
  }
});

/**
 * @route   GET /api/countries/:code
 * @desc    Get a specific country by country code
 * @access  Public
 */
router.get('/:code', (req, res) => {
  try {
    const { code } = req.params;
    const country = countriesData.find(
      c => c.code.toUpperCase() === code.toUpperCase()
    );

    if (!country) {
      return res.status(404).json({
        success: false,
        error: `Country with code ${code} not found`
      });
    }

    res.json({
      success: true,
      data: country
    });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch country'
    });
  }
});

module.exports = router;
