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

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    friend_id INT REFERENCES users(id),
    UNIQUE (user_id, friend_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
