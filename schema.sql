-- Drop tables if they exist to recreate cleanly
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS experience;
DROP TABLE IF EXISTS candidates;

-- Main Candidates Table
CREATE TABLE candidates (
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
    photo_data TEXT, -- Can store base64 string or a file path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education Table
CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    degree VARCHAR(255),
    board VARCHAR(255),
    passing_year VARCHAR(50)
);

-- Experience Table
-- 'years' column stores combined duration e.g. "2 Years", "6 Months", "1 Year"
CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    years VARCHAR(50),
    title VARCHAR(255),
    company VARCHAR(255)
);
