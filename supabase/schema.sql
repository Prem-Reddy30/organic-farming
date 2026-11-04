-- =============================================================================
-- CallPilot AI / AgentLabs — Enterprise Voice Call Recordings & Transcripts Schema
-- Database: PostgreSQL 15+ / Supabase
-- Features: Multi-tenant RLS, Idempotent Webhooks, Private Vault Storage, Audit Logs
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean schema (for migrations)
-- DROP SCHEMA IF EXISTS callpilot CASCADE;
-- CREATE SCHEMA callpilot;

-- -----------------------------------------------------------------------------
-- 1. WORKSPACES & TENANTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) DEFAULT 'pro' CHECK (tier IN ('starter', 'pro', 'enterprise')),
    storage_limit_mb INTEGER DEFAULT 5000,          -- 5 GB storage quota
    transcription_limit_mins INTEGER DEFAULT 1000,  -- 1000 minutes quota
    ai_token_quota INTEGER DEFAULT 2500000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. WORKSPACE MEMBERS & ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users(id)
    role VARCHAR(50) NOT NULL DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent', 'auditor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (workspace_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 3. AI AGENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    voice_name VARCHAR(100) NOT NULL,
    voice_provider VARCHAR(50) DEFAULT 'elevenlabs',
    avatar_url TEXT,
    system_prompt TEXT,
    language VARCHAR(10) DEFAULT 'en-US',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. CAMPAIGNS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    direction VARCHAR(20) DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    total_calls_target INTEGER DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. LEADS / CONTACTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'appointment_booked', 'not_interested', 'unreachable', 'opted_out')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. CALLS (Master Table)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
    
    -- Telephony provider tracking & idempotency
    provider VARCHAR(50) DEFAULT 'twilio' CHECK (provider IN ('twilio', 'retell', 'bland', 'vapi', 'custom')),
    provider_call_id VARCHAR(255) NOT NULL,
    direction VARCHAR(20) NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'interrupted', 'failed', 'busy', 'no-answer')),
    
    -- Timing
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    
    -- Secure Recording Vault Details (Private Object Storage)
    recording_status VARCHAR(50) DEFAULT 'available' CHECK (recording_status IN ('processing', 'available', 'failed', 'deleted', 'not_recorded')),
    private_storage_path TEXT,          -- e.g. "recordings/{workspace_id}/{call_id}/audio.wav"
    storage_size_bytes BIGINT DEFAULT 0,
    recording_consent_obtained BOOLEAN DEFAULT TRUE,
    
    -- Transcription Status
    transcript_status VARCHAR(50) DEFAULT 'completed' CHECK (transcript_status IN ('processing', 'completed', 'failed', 'none')),
    language VARCHAR(10) DEFAULT 'en-US',
    
    -- AI High-Level Outcome
    summary TEXT,
    outcome VARCHAR(50) DEFAULT 'interested' CHECK (outcome IN ('interested', 'follow_up_requested', 'appointment_booked', 'not_interested', 'unreachable', 'opted_out', 'failed')),
    
    -- Verification & Testing
    is_demo BOOLEAN DEFAULT FALSE,
    is_partial_recording BOOLEAN DEFAULT FALSE,
    interruption_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Strict Idempotency: Webhook retries will not duplicate call records
    CONSTRAINT uq_provider_call_id_per_workspace UNIQUE (workspace_id, provider_call_id)
);

-- -----------------------------------------------------------------------------
-- 7. TRANSCRIPT SEGMENTS (Time-aligned, Diarized)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transcript_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    speaker VARCHAR(50) NOT NULL CHECK (speaker IN ('agent', 'contact')),
    speaker_label VARCHAR(100) NOT NULL, -- e.g. "AI Agent (Sarah)" or "Business Contact (Marcus)"
    text TEXT NOT NULL,
    start_time_seconds NUMERIC(8, 3) NOT NULL, -- e.g. 14.250s
    end_time_seconds NUMERIC(8, 3) NOT NULL,   -- e.g. 19.800s
    language VARCHAR(10) DEFAULT 'en-US',
    confidence NUMERIC(4, 3) DEFAULT 0.950,    -- 0.000 to 1.000
    is_uncertain BOOLEAN DEFAULT FALSE,        -- True if confidence < 0.75 or contains inaudible flags
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. CALL INSIGHTS (AI Extracted Intelligence)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS call_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID UNIQUE NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    customer_intent TEXT NOT NULL,
    interest_classification VARCHAR(50) DEFAULT 'warm' CHECK (interest_classification IN ('hot', 'warm', 'mild', 'cold', 'unqualified')),
    interest_score INTEGER DEFAULT 75 CHECK (interest_score BETWEEN 0 AND 100),
    
    -- Structured JSON payloads
    business_needs JSONB DEFAULT '[]'::jsonb,      -- Array of string pain points
    objections JSONB DEFAULT '[]'::jsonb,          -- Array of { "objection": string, "addressed": boolean, "status": string }
    qa_pairs JSONB DEFAULT '[]'::jsonb,            -- Array of { "question": string, "answer": string }
    
    follow_up_requirements TEXT,
    preferred_callback_time TIMESTAMPTZ,
    appointment_details JSONB,                     -- { "date": "...", "time": "...", "timezone": "...", "attendees": [...] }
    suggested_next_action TEXT,
    
    user_notes TEXT,
    manually_edited BOOLEAN DEFAULT FALSE,
    last_edited_by UUID,                           -- references auth.users(id)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. RECORDING ACCESS AUDIT LOGS (Compliance & Security)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recording_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('playback_stream', 'download_recording', 'export_transcript_txt', 'export_transcript_pdf', 'delete_recording', 'manual_reprocess')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. RETENTION & PRIVACY POLICIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recording_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID UNIQUE NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    retention_days INTEGER DEFAULT 90,             -- 30, 60, 90, 365, or 0 (forever)
    auto_purge_audio BOOLEAN DEFAULT TRUE,
    auto_purge_transcript BOOLEAN DEFAULT FALSE,   -- Retain text while purges audio
    two_party_consent_notice TEXT DEFAULT 'This call is recorded for quality assurance and training purposes.',
    consent_mode VARCHAR(50) DEFAULT 'verbal_notice' CHECK (consent_mode IN ('verbal_notice', 'explicit_beep', 'dual_opt_in', 'disabled')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. WORKSPACE USAGE & BILLING METERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workspace_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID UNIQUE NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    storage_used_bytes BIGINT DEFAULT 0,
    transcription_minutes_used NUMERIC(10, 2) DEFAULT 0,
    ai_tokens_consumed BIGINT DEFAULT 0,
    total_calls_processed INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 12. PERFORMANCE INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_calls_workspace_created ON calls (workspace_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_lead ON calls (lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_campaign ON calls (campaign_id);
CREATE INDEX IF NOT EXISTS idx_calls_agent ON calls (agent_id);
CREATE INDEX IF NOT EXISTS idx_calls_outcome ON calls (outcome);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls (status);
CREATE INDEX IF NOT EXISTS idx_calls_recording_status ON calls (recording_status);
CREATE INDEX IF NOT EXISTS idx_calls_provider_lookup ON calls (workspace_id, provider_call_id);

CREATE INDEX IF NOT EXISTS idx_transcript_call_seq ON transcript_segments (call_id, start_time_seconds ASC);
CREATE INDEX IF NOT EXISTS idx_call_insights_call ON call_insights (call_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_call_time ON recording_access_logs (call_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_workspace_time ON recording_access_logs (workspace_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE recording_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recording_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_usage ENABLE ROW LEVEL SECURITY;

-- Helper function: Returns true if user has access to workspace
CREATE OR REPLACE FUNCTION user_has_workspace_access(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = ws_id
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calls RLS
CREATE POLICY "Users can only view calls in their workspace" ON calls
    FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "Users can only update calls in their workspace" ON calls
    FOR UPDATE USING (user_has_workspace_access(workspace_id));

CREATE POLICY "Service roles can insert calls" ON calls
    FOR INSERT WITH CHECK (user_has_workspace_access(workspace_id));

-- Transcript Segments RLS (linked via call_id)
CREATE POLICY "Users can view transcript segments for workspace calls" ON transcript_segments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM calls
            WHERE calls.id = transcript_segments.call_id
            AND user_has_workspace_access(calls.workspace_id)
        )
    );

-- Call Insights RLS
CREATE POLICY "Users can view insights for workspace calls" ON call_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM calls
            WHERE calls.id = call_insights.call_id
            AND user_has_workspace_access(calls.workspace_id)
        )
    );

CREATE POLICY "Users can edit insights for workspace calls" ON call_insights
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM calls
            WHERE calls.id = call_insights.call_id
            AND user_has_workspace_access(calls.workspace_id)
        )
    );

-- Access Logs RLS
CREATE POLICY "Members can view access logs in their workspace" ON recording_access_logs
    FOR SELECT USING (user_has_workspace_access(workspace_id));

CREATE POLICY "System can record access logs" ON recording_access_logs
    FOR INSERT WITH CHECK (user_has_workspace_access(workspace_id));

-- -----------------------------------------------------------------------------
-- 14. SUPABASE STORAGE BUCKET DEFINITIONS & SIGNED URLS
-- -----------------------------------------------------------------------------
-- Note: In Supabase dashboard or migrations:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('call-recordings', 'call-recordings', false);
-- 
-- Storage RLS:
-- CREATE POLICY "Allow authenticated read with tenant path verification" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'call-recordings' AND
--     (storage.foldername(name))[1] IN (
--       SELECT workspace_id::text FROM workspace_members WHERE user_id = auth.uid()
--     )
--   );
