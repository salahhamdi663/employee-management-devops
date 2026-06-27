CREATE TABLE IF NOT EXISTS employees (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    age INT,

    department VARCHAR(100),

    position VARCHAR(100),

    status VARCHAR(20) DEFAULT 'Active',

    image TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
