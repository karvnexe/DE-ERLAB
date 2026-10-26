-- PostgreSQL Veri Tabanı Şeması - Kaçeder V2.0

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id INT REFERENCES categories(id)
);

CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    brand_id INT REFERENCES brands(id),
    name VARCHAR(100) NOT NULL,
    storage_options INT[], -- Örn: [64, 128, 256]
    base_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    model_id INT REFERENCES models(id),
    source_name VARCHAR(50) NOT NULL, -- 'Sahibinden', 'Getmobil', 'EasyCep' vb.
    title TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TL',
    condition_status VARCHAR(50) NOT NULL, -- 'mukemmel', 'normal', 'degisen'
    battery_health INT, -- Telefonlar için pil sağlığı (%)
    location VARCHAR(50),
    listing_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    model_id INT REFERENCES models(id),
    avg_price NUMERIC(10, 2) NOT NULL,
    store_price NUMERIC(10, 2) NOT NULL,
    recorded_date DATE DEFAULT CURRENT_DATE
);