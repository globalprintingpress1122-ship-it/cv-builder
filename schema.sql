-- Main Candidates Table (CREATE IF NOT EXISTS - safe for re-runs)
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    dob DATE,
    cnic VARCHAR(50),
    gender VARCHAR(50),
    nationality VARCHAR(100),
    marital_status VARCHAR(50),
    religion VARCHAR(100),
    languages TEXT,
    objective TEXT,
    skills TEXT,
    hobbies TEXT,
    reference_text TEXT,
    photo_data TEXT,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    degree VARCHAR(255),
    board VARCHAR(255),
    passing_year VARCHAR(50)
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    years VARCHAR(50),
    title VARCHAR(255),
    company VARCHAR(255)
);
