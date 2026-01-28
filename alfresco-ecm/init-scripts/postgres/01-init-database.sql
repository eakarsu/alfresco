-- Create databases for different services (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'keycloak') THEN
        CREATE DATABASE keycloak;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'camunda') THEN
        CREATE DATABASE camunda;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'alfresco_audit') THEN
        CREATE DATABASE alfresco_audit;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'alfresco_analytics') THEN
        CREATE DATABASE alfresco_analytics;
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE keycloak TO alfresco;
GRANT ALL PRIVILEGES ON DATABASE camunda TO alfresco;
GRANT ALL PRIVILEGES ON DATABASE alfresco_audit TO alfresco;
GRANT ALL PRIVILEGES ON DATABASE alfresco_analytics TO alfresco;

-- Connect to main database
\c alfresco_ecm;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS workflow;
CREATE SCHEMA IF NOT EXISTS records;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS collaboration;

-- Auth Schema Tables
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    display_name VARCHAR(255),
    avatar_url TEXT,
    locale VARCHAR(10) DEFAULT 'en_US',
    timezone VARCHAR(50) DEFAULT 'UTC',
    status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    locked_until TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    description TEXT,
    parent_group_id UUID REFERENCES auth.groups(id),
    type VARCHAR(50) DEFAULT 'custom',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource, action)
);

CREATE TABLE IF NOT EXISTS auth.user_groups (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES auth.groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id)
);

CREATE TABLE IF NOT EXISTS auth.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES auth.roles(id) ON DELETE CASCADE,
    scope VARCHAR(255),
    scope_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS auth.role_permissions (
    role_id UUID REFERENCES auth.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES auth.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS auth.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500),
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    refresh_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Schema Tables
CREATE TABLE IF NOT EXISTS content.nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    node_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(255),
    content_url TEXT,
    content_size BIGINT,
    content_hash VARCHAR(255),
    encoding VARCHAR(50),
    locale VARCHAR(10),
    title VARCHAR(500),
    description TEXT,
    author VARCHAR(255),
    creator_id UUID REFERENCES auth.users(id),
    modifier_id UUID REFERENCES auth.users(id),
    owner_id UUID REFERENCES auth.users(id),
    is_locked BOOLEAN DEFAULT false,
    lock_owner_id UUID REFERENCES auth.users(id),
    lock_type VARCHAR(50),
    lock_expires_at TIMESTAMP,
    version_label VARCHAR(50),
    is_major_version BOOLEAN DEFAULT true,
    is_latest_version BOOLEAN DEFAULT true,
    properties JSONB DEFAULT '{}',
    aspects JSONB DEFAULT '[]',
    permissions JSONB DEFAULT '{}',
    path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content.versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    version_number DECIMAL(10,2) NOT NULL,
    version_label VARCHAR(50),
    is_major_version BOOLEAN DEFAULT false,
    comment TEXT,
    content_url TEXT,
    content_size BIGINT,
    content_hash VARCHAR(255),
    properties JSONB DEFAULT '{}',
    creator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(node_id, version_number)
);

CREATE TABLE IF NOT EXISTS content.metadata_schemas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    namespace VARCHAR(255) NOT NULL,
    prefix VARCHAR(50),
    schema_definition JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content.node_tags (
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES content.tags(id) ON DELETE CASCADE,
    tagged_by UUID REFERENCES auth.users(id),
    tagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (node_id, tag_id)
);

CREATE TABLE IF NOT EXISTS content.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES content.categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_id, name)
);

CREATE TABLE IF NOT EXISTS content.node_categories (
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    category_id UUID REFERENCES content.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (node_id, category_id)
);

CREATE TABLE IF NOT EXISTS content.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES content.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    edited_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(node_id, user_id)
);

CREATE TABLE IF NOT EXISTS content.favorites (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, node_id)
);

CREATE TABLE IF NOT EXISTS content.rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    triggers JSONB NOT NULL,
    conditions JSONB DEFAULT '[]',
    actions JSONB NOT NULL,
    is_async BOOLEAN DEFAULT false,
    apply_to_children BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content.thumbnails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    mime_type VARCHAR(255),
    content_url TEXT,
    width INT,
    height INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(node_id, name)
);

-- Workflow Schema Tables
CREATE TABLE IF NOT EXISTS workflow.process_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    version INT NOT NULL,
    description TEXT,
    category VARCHAR(255),
    deployment_id VARCHAR(255),
    resource_name VARCHAR(255),
    diagram_resource_name VARCHAR(255),
    has_start_form BOOLEAN DEFAULT false,
    has_graphical_notation BOOLEAN DEFAULT true,
    is_suspended BOOLEAN DEFAULT false,
    tenant_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(key, version, tenant_id)
);

CREATE TABLE IF NOT EXISTS workflow.process_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_definition_id UUID REFERENCES workflow.process_definitions(id),
    business_key VARCHAR(255),
    name VARCHAR(255),
    description TEXT,
    start_user_id UUID REFERENCES auth.users(id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration BIGINT,
    variables JSONB DEFAULT '{}',
    state VARCHAR(50) DEFAULT 'active',
    tenant_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS workflow.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_instance_id UUID REFERENCES workflow.process_instances(id) ON DELETE CASCADE,
    process_definition_id UUID REFERENCES workflow.process_definitions(id),
    task_definition_key VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES auth.users(id),
    owner_id UUID REFERENCES auth.users(id),
    candidate_users UUID[],
    candidate_groups UUID[],
    priority INT DEFAULT 50,
    due_date TIMESTAMP,
    follow_up_date TIMESTAMP,
    delegation_state VARCHAR(50),
    form_key VARCHAR(255),
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    claimed_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration BIGINT,
    state VARCHAR(50) DEFAULT 'active'
);

-- Records Management Schema Tables
CREATE TABLE IF NOT EXISTS records.file_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS records.record_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES records.record_categories(id),
    file_plan_id UUID REFERENCES records.file_plans(id) ON DELETE CASCADE,
    identifier VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    disposition_authority TEXT,
    vital_record_indicator BOOLEAN DEFAULT false,
    path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_plan_id, identifier)
);

CREATE TABLE IF NOT EXISTS records.records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES content.nodes(id) ON DELETE CASCADE,
    category_id UUID REFERENCES records.record_categories(id),
    identifier VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    date_filed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    originator VARCHAR(255),
    originating_organization VARCHAR(255),
    publication_date DATE,
    cutoff_date DATE,
    retention_date DATE,
    disposition_action VARCHAR(50),
    disposition_date DATE,
    location VARCHAR(500),
    media_type VARCHAR(100),
    format VARCHAR(100),
    is_vital_record BOOLEAN DEFAULT false,
    review_date DATE,
    is_obsolete BOOLEAN DEFAULT false,
    is_superseded BOOLEAN DEFAULT false,
    superseded_by UUID REFERENCES records.records(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS records.retention_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES records.record_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    retention_period_value INT,
    retention_period_unit VARCHAR(20),
    retention_trigger VARCHAR(50),
    disposition_action VARCHAR(50),
    disposition_instructions TEXT,
    is_permanent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS records.legal_holds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    case_number VARCHAR(100),
    description TEXT,
    reason TEXT,
    legal_officer VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP,
    released_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS records.hold_records (
    hold_id UUID REFERENCES records.legal_holds(id) ON DELETE CASCADE,
    record_id UUID REFERENCES records.records(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by UUID REFERENCES auth.users(id),
    PRIMARY KEY (hold_id, record_id)
);

-- Collaboration Schema Tables
CREATE TABLE IF NOT EXISTS collaboration.sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    short_name VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    visibility VARCHAR(20) DEFAULT 'private',
    preset VARCHAR(50) DEFAULT 'site-dashboard',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration.site_members (
    site_id UUID REFERENCES collaboration.sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (site_id, user_id)
);

CREATE TABLE IF NOT EXISTS collaboration.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES collaboration.sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    activity_type VARCHAR(100) NOT NULL,
    activity_summary TEXT,
    post_user_id UUID REFERENCES auth.users(id),
    object_id UUID,
    object_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration.discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES collaboration.sites(id) ON DELETE CASCADE,
    topic VARCHAR(500) NOT NULL,
    content TEXT,
    author_id UUID REFERENCES auth.users(id),
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration.wiki_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES collaboration.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    version INT DEFAULT 1,
    author_id UUID REFERENCES auth.users(id),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(site_id, title)
);

CREATE TABLE IF NOT EXISTS collaboration.calendars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES collaboration.sites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calendar_id UUID REFERENCES collaboration.calendars(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(500),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    all_day BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    organizer_id UUID REFERENCES auth.users(id),
    attendees UUID[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration.data_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES collaboration.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    item_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collaboration.links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES collaboration.sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Schema Tables
CREATE TABLE IF NOT EXISTS audit.audit_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    username VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    resource_name VARCHAR(500),
    values_before JSONB,
    values_after JSONB,
    result VARCHAR(50),
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    correlation_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL,
    logger VARCHAR(255),
    message TEXT NOT NULL,
    error_stack TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON auth.users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON auth.users(status);

CREATE INDEX IF NOT EXISTS idx_nodes_parent ON content.nodes(parent_id);
-- CREATE INDEX IF NOT EXISTS idx_nodes_type ON content.nodes(node_type); -- column doesn't exist in simplified schema
-- CREATE INDEX IF NOT EXISTS idx_nodes_created_by ON content.nodes(creator_id); -- column doesn't exist in simplified schema
CREATE INDEX IF NOT EXISTS idx_nodes_path ON content.nodes(path);
CREATE INDEX IF NOT EXISTS idx_nodes_name_trgm ON content.nodes USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_versions_node ON content.versions(node_id);
-- CREATE INDEX IF NOT EXISTS idx_versions_current ON content.versions(node_id, is_major_version); -- column doesn't exist in simplified schema

CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON workflow.tasks(assignee_id);
-- CREATE INDEX IF NOT EXISTS idx_tasks_status ON workflow.tasks(state); -- column doesn't exist in simplified schema
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON workflow.tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_records_category ON records.records(category_id);
CREATE INDEX IF NOT EXISTS idx_records_cutoff ON records.records(cutoff_date);
CREATE INDEX IF NOT EXISTS idx_records_retention ON records.records(retention_date);

CREATE INDEX IF NOT EXISTS idx_sites_visibility ON collaboration.sites(visibility);

CREATE INDEX IF NOT EXISTS idx_activities_site ON collaboration.activities(site_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON collaboration.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created ON collaboration.activities(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit.audit_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit.audit_entries(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit.audit_entries(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit.audit_entries(created_at DESC);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON auth.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_groups_updated_at ON auth.groups;
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON auth.groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON auth.roles;
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON auth.roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_nodes_updated_at ON content.nodes;
CREATE TRIGGER update_nodes_updated_at BEFORE UPDATE ON content.nodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sites_updated_at ON collaboration.sites;
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON collaboration.sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();