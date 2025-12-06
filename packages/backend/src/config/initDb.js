const pool = require('./database');

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized: users table created/exists');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chatbot_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'message',
        tokens_used INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized: chatbot_messages table created/exists');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chatbot_conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        message_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized: chatbot_conversations table created/exists');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chatbot_analysis_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        conversation_id INTEGER,
        request_type VARCHAR(100) NOT NULL,
        input_data JSONB,
        response_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(id) ON DELETE SET NULL
      );
    `);
    console.log('Database initialized: chatbot_analysis_requests table created/exists');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_products (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        hs_code VARCHAR(20),
        target_country_id VARCHAR(10),
        target_country_name VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized: user_products table created/exists');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS export_agents (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        website VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        province VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Indonesia',
        specialization_categories TEXT[],
        target_countries TEXT[],
        services TEXT[],
        languages TEXT[],
        rating DECIMAL(3,2) DEFAULT 0.0,
        review_count INTEGER DEFAULT 0,
        experience_years INTEGER,
        license_number VARCHAR(100),
        is_verified BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized: export_agents table created/exists');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS agent_recommendations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product_id INTEGER,
        agent_id INTEGER NOT NULL,
        recommendation_score DECIMAL(5,2),
        match_reasons TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES user_products(id) ON DELETE SET NULL,
        FOREIGN KEY (agent_id) REFERENCES export_agents(id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized: agent_recommendations table created/exists');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_chatbot_messages_user_id ON chatbot_messages(user_id);
      CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);
      CREATE INDEX IF NOT EXISTS idx_chatbot_analysis_requests_user_id ON chatbot_analysis_requests(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON user_products(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_products_status ON user_products(status);
      CREATE INDEX IF NOT EXISTS idx_export_agents_is_active ON export_agents(is_active);
      CREATE INDEX IF NOT EXISTS idx_export_agents_is_verified ON export_agents(is_verified);
      CREATE INDEX IF NOT EXISTS idx_agent_recommendations_user_id ON agent_recommendations(user_id);
      CREATE INDEX IF NOT EXISTS idx_agent_recommendations_product_id ON agent_recommendations(product_id);
      CREATE INDEX IF NOT EXISTS idx_agent_recommendations_agent_id ON agent_recommendations(agent_id);
    `);
    console.log('Database initialized: indices created/exist');

    // Seed export agents data (run asynchronously, don't block initialization)
    const seedExportAgents = require('./seedExportAgents');
    seedExportAgents().catch(err => {
      console.error('Error seeding export agents (non-blocking):', err);
    });

  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = initDatabase;
