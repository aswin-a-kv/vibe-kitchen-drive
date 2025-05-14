-- Table: files
CREATE TABLE files (
    file_id SERIAL PRIMARY KEY,
    parent_file_id INTEGER REFERENCES files(file_id) ON DELETE SET NULL,
    owner_email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_folder BOOLEAN NOT NULL,
    size BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    storage_key VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    signed_url VARCHAR(1024)
);

-- Table: file_versions
CREATE TABLE file_versions (
    version_id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(file_id) ON DELETE CASCADE,
    storage_version_id VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL
);

-- Table: access_control
CREATE TABLE access_control (
    id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(file_id) ON DELETE CASCADE,
    shared_with_email VARCHAR(255) NOT NULL,
    permission VARCHAR(255) NOT NULL
);

-- Table: share_links
CREATE TABLE share_links (
    token VARCHAR(255) PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(file_id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_by_email VARCHAR(255) NOT NULL
);

-- Table: activity_logs
CREATE TABLE activity_logs (
    log_id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    file_id INTEGER REFERENCES files(file_id) ON DELETE SET NULL,
    timestamp TIMESTAMP NOT NULL,
    details VARCHAR(1024)
); 