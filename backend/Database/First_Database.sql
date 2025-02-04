CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    second_name VARCHAR(50),
    nickname VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    device VARCHAR(255),
    browser VARCHAR(255),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token TEXT NOT NULL
);
