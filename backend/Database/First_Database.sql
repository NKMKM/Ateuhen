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

CREATE TABLE notification_settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    new_messages BOOLEAN DEFAULT TRUE,
    account_updates BOOLEAN DEFAULT TRUE,
    newsletter BOOLEAN DEFAULT FALSE,
    product_updates BOOLEAN DEFAULT FALSE,
    security_alerts BOOLEAN DEFAULT TRUE,
    desktop_notifications BOOLEAN DEFAULT TRUE,
    mobile_notifications BOOLEAN DEFAULT TRUE,
    browser_notifications BOOLEAN DEFAULT FALSE,
    sound BOOLEAN DEFAULT FALSE,
    notification_preview BOOLEAN DEFAULT TRUE,
    do_not_disturb BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME
);

CREATE TABLE privacy_settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    two_factor_auth BOOLEAN DEFAULT FALSE,
    biometric_login BOOLEAN DEFAULT FALSE,
    login_alerts BOOLEAN DEFAULT TRUE,
    remember_devices BOOLEAN DEFAULT FALSE,
    data_collection BOOLEAN DEFAULT FALSE,
    cookie_preferences BOOLEAN DEFAULT FALSE,
    location_services BOOLEAN DEFAULT FALSE,
    personalized_ads BOOLEAN DEFAULT FALSE
);

CREATE TABLE appearance_settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    dark_mode BOOLEAN DEFAULT TRUE,
    high_contrast BOOLEAN DEFAULT FALSE,
    reduce_animations BOOLEAN DEFAULT FALSE
);

CREATE TABLE general_settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(50),
    time_zone VARCHAR(50)
);