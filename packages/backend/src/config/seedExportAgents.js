const pool = require('./database');
const countries = require('../data/countries.json');

/**
 * Generate dummy export agents data
 * Creates at least one export agent for each country
 */
const seedExportAgents = async () => {
  try {
    // Check if agents already exist
    const checkResult = await pool.query('SELECT COUNT(*) FROM export_agents');
    const existingCount = parseInt(checkResult.rows[0].count, 10);

    if (existingCount > 0) {
      console.log(`Export agents already exist (${existingCount} agents). Skipping seed.`);
      return;
    }

    console.log('Seeding export agents data...');

    const categories = [
      'Agricultural',
      'Manufacturing',
      'Mining',
      'Energy',
      'Artisan',
      'Textile',
      'Electronics',
      'Food & Beverage',
      'Chemicals',
      'Pharmaceuticals',
    ];

    const services = [
      'Documentation',
      'Logistics',
      'Customs Clearance',
      'Shipping',
      'Insurance',
      'Quality Control',
      'Market Research',
      'Legal Assistance',
    ];

    const languages = [
      'Indonesian',
      'English',
      'Mandarin',
      'Japanese',
      'Korean',
      'Arabic',
      'Spanish',
      'French',
      'German',
    ];

    const indonesianCities = [
      'Jakarta',
      'Surabaya',
      'Bandung',
      'Medan',
      'Semarang',
      'Makassar',
      'Palembang',
      'Denpasar',
      'Yogyakarta',
      'Malang',
    ];

    const indonesianProvinces = [
      'DKI Jakarta',
      'Jawa Timur',
      'Jawa Barat',
      'Sumatera Utara',
      'Jawa Tengah',
      'Sulawesi Selatan',
      'Sumatera Selatan',
      'Bali',
      'DI Yogyakarta',
      'Jawa Timur',
    ];

    const agentNames = [
      'Global Export Solutions',
      'International Trade Partners',
      'Export Excellence',
      'Worldwide Export Services',
      'Premium Export Agency',
      'Global Trade Hub',
      'Export Masters',
      'International Commerce',
      'Export Professionals',
      'Trade Experts',
    ];

    const contactNames = [
      'Budi Santoso',
      'Siti Nurhaliza',
      'Ahmad Wijaya',
      'Dewi Lestari',
      'Rudi Hartono',
      'Maya Sari',
      'Agus Prasetyo',
      'Indah Permata',
      'Joko Susilo',
      'Ratna Dewi',
    ];

    let insertedCount = 0;

    // Create agents for each country
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      
      // Determine number of agents per country (1-3 agents)
      const agentsPerCountry = i % 3 === 0 ? 2 : (i % 5 === 0 ? 3 : 1);

      for (let j = 0; j < agentsPerCountry; j++) {
        const agentIndex = (i * 3 + j) % agentNames.length;
        const contactIndex = (i * 2 + j) % contactNames.length;
        const cityIndex = (i + j) % indonesianCities.length;

        // Select random categories (1-3 categories)
        const numCategories = Math.floor(Math.random() * 3) + 1;
        const selectedCategories = [];
        for (let k = 0; k < numCategories; k++) {
          const cat = categories[Math.floor(Math.random() * categories.length)];
          if (!selectedCategories.includes(cat)) {
            selectedCategories.push(cat);
          }
        }

        // Select target countries (current country + 2-5 additional countries)
        const numTargetCountries = Math.floor(Math.random() * 4) + 2;
        const targetCountries = [country.name];
        for (let k = 0; k < numTargetCountries; k++) {
          const randomCountry = countries[Math.floor(Math.random() * countries.length)];
          if (!targetCountries.includes(randomCountry.name)) {
            targetCountries.push(randomCountry.name);
          }
        }

        // Select services (3-6 services)
        const numServices = Math.floor(Math.random() * 4) + 3;
        const selectedServices = [];
        for (let k = 0; k < numServices; k++) {
          const svc = services[Math.floor(Math.random() * services.length)];
          if (!selectedServices.includes(svc)) {
            selectedServices.push(svc);
          }
        }

        // Select languages (2-4 languages)
        const numLanguages = Math.floor(Math.random() * 3) + 2;
        const selectedLanguages = [];
        for (let k = 0; k < numLanguages; k++) {
          const lang = languages[Math.floor(Math.random() * languages.length)];
          if (!selectedLanguages.includes(lang)) {
            selectedLanguages.push(lang);
          }
        }

        // Generate rating (3.0 - 5.0)
        const rating = parseFloat((Math.random() * 2 + 3).toFixed(2));
        
        // Generate review count (5 - 100)
        const reviewCount = Math.floor(Math.random() * 96) + 5;
        
        // Generate experience years (1 - 20)
        const experienceYears = Math.floor(Math.random() * 20) + 1;

        // Determine if verified (30% chance)
        const isVerified = Math.random() < 0.3;

        // Generate company name
        const companyName = `${agentNames[agentIndex]} ${country.code}`;
        
        // Generate email
        const emailDomain = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.id', 'export.id'];
        const email = `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.${emailDomain[Math.floor(Math.random() * emailDomain.length)]}`;
        
        // Generate phone
        const phone = `+62-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
        
        // Generate website
        const website = `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
        
        // Generate address
        const address = `Jl. ${['Sudirman', 'Thamrin', 'Gatot Subroto', 'M.H. Thamrin', 'Kemang'][Math.floor(Math.random() * 5)]} No. ${Math.floor(Math.random() * 200) + 1}, ${indonesianCities[cityIndex]}`;

        // Generate license number
        const licenseNumber = `EXP-${country.code}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

        try {
          await pool.query(
            `INSERT INTO export_agents 
             (company_name, contact_person, email, phone, website, address, city, province, country,
              specialization_categories, target_countries, services, languages, rating, review_count,
              experience_years, license_number, is_verified, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
            [
              companyName,
              contactNames[contactIndex],
              email,
              phone,
              website,
              address,
              indonesianCities[cityIndex],
              indonesianProvinces[cityIndex],
              'Indonesia',
              selectedCategories,
              targetCountries,
              selectedServices,
              selectedLanguages,
              rating,
              reviewCount,
              experienceYears,
              licenseNumber,
              isVerified,
              true,
            ]
          );
          insertedCount++;
        } catch (error) {
          console.error(`Error inserting agent for ${country.name}:`, error.message);
        }
      }
    }

    console.log(`Successfully seeded ${insertedCount} export agents for ${countries.length} countries.`);
  } catch (error) {
    console.error('Error seeding export agents:', error);
    throw error;
  }
};

module.exports = seedExportAgents;

