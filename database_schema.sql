-- ===============================================================
-- Organic Farming Guide: PostgreSQL & Supabase pgvector Schema
-- ===============================================================

-- 1. Enable pgvector extension for semantic similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents Table (Ingested manuals, guidelines, university publications)
CREATE TABLE IF NOT EXISTS agricultural_documents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    source_url TEXT,
    author VARCHAR(255) DEFAULT 'Agricultural Research Institute',
    publication_date DATE,
    crop_category VARCHAR(100) DEFAULT 'General',
    farming_topic VARCHAR(100) DEFAULT 'General',
    language VARCHAR(30) DEFAULT 'English',
    total_chunks INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Indexed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Document Chunks Table with Vector Embeddings (384-dim for all-MiniLM-L6-v2, or 768 for text-embedding-004)
CREATE TABLE IF NOT EXISTS document_chunks (
    id VARCHAR(128) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES agricultural_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    page_number INT DEFAULT 1,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(384), -- Change to vector(768) if using Gemini embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on embedding for fast HNSW cosine similarity search
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON document_chunks 
USING hnsw (embedding vector_cosine_ops);

-- Index on crop and topic for fast metadata filtering
CREATE INDEX IF NOT EXISTS idx_chunks_metadata_crop ON document_chunks USING gin (metadata);

-- 4. User Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- References auth.users(id) in Supabase
    title VARCHAR(255) DEFAULT 'New Organic Farming Inquiry',
    crop_interest VARCHAR(100),
    preferred_language VARCHAR(30) DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]'::jsonb,
    language VARCHAR(30) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Ingestion Audit Log Table
CREATE TABLE IF NOT EXISTS ingestion_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(64) NOT NULL,
    filename TEXT,
    title TEXT,
    chunks_created INT DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Stored Procedure for Semantic Vector Match in Supabase
CREATE OR REPLACE FUNCTION match_agricultural_chunks(
    query_embedding vector(384),
    match_threshold float,
    match_count int,
    filter_crop varchar default null,
    filter_topic varchar default null
)
RETURNS TABLE (
    id varchar,
    document_id varchar,
    chunk_index int,
    page_number int,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        dc.id,
        dc.document_id,
        dc.chunk_index,
        dc.page_number,
        dc.content,
        dc.metadata,
        1 - (dc.embedding <=> query_embedding) AS similarity
    FROM document_chunks dc
    WHERE 1 - (dc.embedding <=> query_embedding) > match_threshold
      AND (filter_crop IS NULL OR dc.metadata->>'crop_category' ILIKE '%' || filter_crop || '%')
      AND (filter_topic IS NULL OR dc.metadata->>'farming_topic' ILIKE '%' || filter_topic || '%')
    ORDER BY dc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
