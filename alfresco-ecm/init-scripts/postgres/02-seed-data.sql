-- =====================================================
-- COMPREHENSIVE SEED DATA FOR ALL FEATURES
-- At least 15 items per feature/entity
-- =====================================================

BEGIN;

-- ======================================
-- 1. USERS (20 users covering all scenarios)
-- ======================================
INSERT INTO auth.users (id, username, email, password_hash, first_name, last_name, display_name, avatar_url, locale, timezone, status, email_verified, two_factor_enabled, last_login_at, password_changed_at, failed_login_attempts, created_at) VALUES
  (uuid_generate_v4(), 'admin', 'admin@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'System', 'Administrator', 'System Administrator', NULL, 'en_US', 'UTC', 'active', true, true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 days', 0, NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'john.doe', 'john.doe@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'John', 'Doe', 'John Doe', NULL, 'en_US', 'America/New_York', 'active', true, false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '15 days', 0, NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'jane.smith', 'jane.smith@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Jane', 'Smith', 'Jane Smith', NULL, 'en_US', 'America/Chicago', 'active', true, false, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '7 days', 0, NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'bob.wilson', 'bob.wilson@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Bob', 'Wilson', 'Bob Wilson', NULL, 'en_GB', 'Europe/London', 'active', true, false, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '60 days', 0, NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'alice.johnson', 'alice.johnson@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Alice', 'Johnson', 'Alice Johnson', NULL, 'en_US', 'America/Los_Angeles', 'active', true, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '90 days', 0, NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'carlos.garcia', 'carlos.garcia@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Carlos', 'Garcia', 'Carlos Garcia', NULL, 'es_ES', 'Europe/Madrid', 'active', true, false, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '45 days', 0, NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'maria.santos', 'maria.santos@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Maria', 'Santos', 'Maria Santos', NULL, 'pt_BR', 'America/Sao_Paulo', 'active', false, false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '20 days', 0, NOW() - INTERVAL '5 months'),
  (uuid_generate_v4(), 'david.lee', 'david.lee@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'David', 'Lee', 'David Lee', NULL, 'en_US', 'Asia/Seoul', 'active', true, false, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '10 days', 0, NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'emma.brown', 'emma.brown@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Emma', 'Brown', 'Emma Brown', NULL, 'en_AU', 'Australia/Sydney', 'active', true, false, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 days', 0, NOW() - INTERVAL '3 months'),
  (uuid_generate_v4(), 'frank.miller', 'frank.miller@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Frank', 'Miller', 'Frank Miller', NULL, 'de_DE', 'Europe/Berlin', 'active', true, false, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '25 days', 0, NOW() - INTERVAL '2 months'),
  (uuid_generate_v4(), 'grace.taylor', 'grace.taylor@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Grace', 'Taylor', 'Grace Taylor', NULL, 'fr_FR', 'Europe/Paris', 'active', true, false, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '35 days', 0, NOW() - INTERVAL '7 months'),
  (uuid_generate_v4(), 'henry.clark', 'henry.clark@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Henry', 'Clark', 'Henry Clark', NULL, 'en_US', 'America/Denver', 'inactive', true, false, NULL, NOW() - INTERVAL '120 days', 0, NOW() - INTERVAL '14 months'),
  (uuid_generate_v4(), 'ivy.martinez', 'ivy.martinez@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Ivy', 'Martinez', 'Ivy Martinez', NULL, 'es_MX', 'America/Mexico_City', 'suspended', true, false, NOW() - INTERVAL '30 days', NOW() - INTERVAL '60 days', 5, NOW() - INTERVAL '9 months'),
  (uuid_generate_v4(), 'jack.anderson', 'jack.anderson@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Jack', 'Anderson', 'Jack Anderson', NULL, 'en_US', 'UTC', 'active', false, false, NULL, NULL, 0, NOW() - INTERVAL '1 week'),
  (uuid_generate_v4(), 'kate.thomas', 'kate.thomas@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Kate', 'Thomas', 'Kate Thomas', NULL, 'en_GB', 'Europe/London', 'active', true, true, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '3 days', 0, NOW() - INTERVAL '11 months'),
  (uuid_generate_v4(), 'leo.jackson', 'leo.jackson@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Leo', 'Jackson', 'Leo Jackson', NULL, 'en_US', 'America/Phoenix', 'active', true, false, NOW() - INTERVAL '3 days', NOW() - INTERVAL '50 days', 1, NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'mia.white', 'mia.white@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Mia', 'White', 'Mia White', NULL, 'ja_JP', 'Asia/Tokyo', 'active', true, false, NOW() - INTERVAL '10 hours', NOW() - INTERVAL '40 days', 0, NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'noah.harris', 'noah.harris@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Noah', 'Harris', 'Noah Harris', NULL, 'en_US', 'America/New_York', 'active', true, false, NOW() - INTERVAL '20 hours', NOW() - INTERVAL '14 days', 0, NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'olivia.martin', 'olivia.martin@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Olivia', 'Martin', 'Olivia Martin', NULL, 'en_CA', 'America/Toronto', 'active', true, false, NOW() - INTERVAL '7 hours', NOW() - INTERVAL '8 days', 0, NOW() - INTERVAL '3 months'),
  (uuid_generate_v4(), 'peter.robinson', 'peter.robinson@alfresco.com', '$2b$10$rIC/qKJ8x1mGQXkFqHZ6SOLcMq8k7VR7qJ5bNxYxVBjzXmGvT8Nmi', 'Peter', 'Robinson', 'Peter Robinson', NULL, 'en_US', 'America/Chicago', 'active', true, false, NOW() - INTERVAL '15 hours', NOW() - INTERVAL '22 days', 0, NOW() - INTERVAL '5 months');

-- ======================================
-- 2. ROLES (15 roles)
-- ======================================
INSERT INTO auth.roles (id, name, display_name, description, is_system, created_at) VALUES
  (uuid_generate_v4(), 'ROLE_ADMIN', 'Administrator', 'Full system access with all permissions', true, NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'ROLE_MANAGER', 'Manager', 'Department management and user oversight', true, NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'ROLE_USER', 'Standard User', 'Basic document and workflow access', true, NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'ROLE_VIEWER', 'Viewer', 'Read-only access to documents', true, NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'ROLE_CONTRIBUTOR', 'Contributor', 'Can create and edit own documents', false, NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'ROLE_EDITOR', 'Editor', 'Can edit any document in assigned areas', false, NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'ROLE_REVIEWER', 'Reviewer', 'Can review and approve documents', false, NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'ROLE_RECORDS_MANAGER', 'Records Manager', 'Manages records lifecycle and retention', false, NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'ROLE_SITE_ADMIN', 'Site Administrator', 'Manages team sites and memberships', false, NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'ROLE_WORKFLOW_ADMIN', 'Workflow Administrator', 'Manages workflow definitions and instances', false, NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'ROLE_AUDITOR', 'Auditor', 'Read-only access to audit trails', false, NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'ROLE_EXTERNAL', 'External User', 'Limited access for external collaborators', false, NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'ROLE_API_USER', 'API User', 'Service account for API integrations', false, NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'ROLE_COMPLIANCE', 'Compliance Officer', 'Compliance monitoring and reporting', false, NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'ROLE_POWER_USER', 'Power User', 'Advanced features including bulk operations and exports', false, NOW() - INTERVAL '3 months');

-- ======================================
-- 3. GROUPS (16 groups)
-- ======================================
INSERT INTO auth.groups (id, name, display_name, description, parent_group_id, type, created_at) VALUES
  (uuid_generate_v4(), 'GROUP_EVERYONE', 'Everyone', 'All authenticated users', NULL, 'system', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'GROUP_ADMINS', 'Administrators', 'System administrators group', NULL, 'system', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'GROUP_HR', 'Human Resources', 'HR department team', NULL, 'department', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'GROUP_FINANCE', 'Finance', 'Finance department team', NULL, 'department', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'GROUP_ENGINEERING', 'Engineering', 'Engineering department team', NULL, 'department', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'GROUP_MARKETING', 'Marketing', 'Marketing department team', NULL, 'department', NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'GROUP_SALES', 'Sales', 'Sales department team', NULL, 'department', NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'GROUP_LEGAL', 'Legal', 'Legal department team', NULL, 'department', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'GROUP_EXECUTIVES', 'Executive Team', 'C-level executives', NULL, 'custom', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'GROUP_PROJECT_ALPHA', 'Project Alpha Team', 'Cross-functional team for Project Alpha', NULL, 'project', NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'GROUP_PROJECT_BETA', 'Project Beta Team', 'Cross-functional team for Project Beta', NULL, 'project', NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'GROUP_CONTRACTORS', 'Contractors', 'External contractors group', NULL, 'external', NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'GROUP_INTERNS', 'Interns', 'Summer and winter interns', NULL, 'custom', NOW() - INTERVAL '3 months'),
  (uuid_generate_v4(), 'GROUP_QA', 'Quality Assurance', 'QA team', NULL, 'department', NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'GROUP_DEVOPS', 'DevOps', 'DevOps and infrastructure team', NULL, 'department', NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'GROUP_SUPPORT', 'Customer Support', 'Customer support team', NULL, 'department', NOW() - INTERVAL '9 months');

-- ======================================
-- 4. PERMISSIONS (20 permissions)
-- ======================================
INSERT INTO auth.permissions (id, resource, action, description, created_at) VALUES
  (uuid_generate_v4(), 'documents', 'create', 'Create new documents', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'documents', 'read', 'View documents', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'documents', 'update', 'Edit documents', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'documents', 'delete', 'Delete documents', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'documents', 'export', 'Export documents', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'users', 'create', 'Create new users', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'users', 'read', 'View user profiles', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'users', 'update', 'Edit user accounts', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'users', 'delete', 'Delete user accounts', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'workflows', 'create', 'Create workflows', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'workflows', 'read', 'View workflows', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'workflows', 'update', 'Modify workflows', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'workflows', 'delete', 'Delete workflows', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'records', 'create', 'Create records', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'records', 'read', 'View records', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'records', 'update', 'Modify records', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'records', 'delete', 'Delete records', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'sites', 'create', 'Create collaboration sites', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'sites', 'manage', 'Manage site settings and members', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'audit', 'read', 'View audit logs', NOW() - INTERVAL '12 months');

-- ======================================
-- 5. CONTENT NODES - Folders (16 folders)
-- ======================================
INSERT INTO content.nodes (id, parent_id, name, node_type, title, description, creator_id, owner_id, version_label, path, created_at) VALUES
  (uuid_generate_v4(), NULL, 'Company Home', 'folder', 'Company Home', 'Root folder for all company content', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '1.0', '/Company Home', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Shared Documents', 'folder', 'Shared Documents', 'Company-wide shared documents', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '1.0', '/Company Home/Shared Documents', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'HR Department', 'folder', 'HR Department', 'Human resources documents', (SELECT id FROM auth.users WHERE username='john.doe'), (SELECT id FROM auth.users WHERE username='john.doe'), '1.0', '/Company Home/HR Department', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Finance', 'folder', 'Finance', 'Financial documents and reports', (SELECT id FROM auth.users WHERE username='jane.smith'), (SELECT id FROM auth.users WHERE username='jane.smith'), '1.0', '/Company Home/Finance', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Engineering', 'folder', 'Engineering', 'Engineering project documents', (SELECT id FROM auth.users WHERE username='bob.wilson'), (SELECT id FROM auth.users WHERE username='bob.wilson'), '1.0', '/Company Home/Engineering', NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Legal', 'folder', 'Legal', 'Legal documents and contracts', (SELECT id FROM auth.users WHERE username='alice.johnson'), (SELECT id FROM auth.users WHERE username='alice.johnson'), '1.0', '/Company Home/Legal', NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Marketing', 'folder', 'Marketing', 'Marketing materials and campaigns', (SELECT id FROM auth.users WHERE username='carlos.garcia'), (SELECT id FROM auth.users WHERE username='carlos.garcia'), '1.0', '/Company Home/Marketing', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Projects', 'folder', 'Projects', 'Active project folders', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '1.0', '/Company Home/Projects', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Projects'), 'Project Alpha', 'folder', 'Project Alpha', 'Cloud migration project', (SELECT id FROM auth.users WHERE username='david.lee'), (SELECT id FROM auth.users WHERE username='david.lee'), '1.0', '/Company Home/Projects/Project Alpha', NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Projects'), 'Project Beta', 'folder', 'Project Beta', 'Mobile app development', (SELECT id FROM auth.users WHERE username='emma.brown'), (SELECT id FROM auth.users WHERE username='emma.brown'), '1.0', '/Company Home/Projects/Project Beta', NOW() - INTERVAL '5 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Projects'), 'Project Gamma', 'folder', 'Project Gamma', 'Data analytics platform', (SELECT id FROM auth.users WHERE username='frank.miller'), (SELECT id FROM auth.users WHERE username='frank.miller'), '1.0', '/Company Home/Projects/Project Gamma', NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Archive', 'folder', 'Archive', 'Archived documents', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '1.0', '/Company Home/Archive', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Templates', 'folder', 'Templates', 'Document templates', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '1.0', '/Company Home/Templates', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Training', 'folder', 'Training', 'Training materials', (SELECT id FROM auth.users WHERE username='grace.taylor'), (SELECT id FROM auth.users WHERE username='grace.taylor'), '1.0', '/Company Home/Training', NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Policies', 'folder', 'Policies', 'Company policies and procedures', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '1.0', '/Company Home/Policies', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Company Home'), 'Reports', 'folder', 'Reports', 'Generated reports', (SELECT id FROM auth.users WHERE username='jane.smith'), (SELECT id FROM auth.users WHERE username='jane.smith'), '1.0', '/Company Home/Reports', NOW() - INTERVAL '12 months');

-- ======================================
-- 6. CONTENT NODES - Documents (20 documents)
-- ======================================
INSERT INTO content.nodes (id, parent_id, name, node_type, mime_type, content_size, title, description, creator_id, owner_id, version_label, is_major_version, path, properties, created_at, modified_at) VALUES
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Shared Documents'), 'Company Policy 2024.pdf', 'document', 'application/pdf', 2048576, 'Company Policy 2024', 'Annual company policy document', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '2.0', true, '/Company Home/Shared Documents/Company Policy 2024.pdf', '{"pages": 45, "department": "HR"}', NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Finance'), 'Q4 Financial Report.xlsx', 'document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 524288, 'Q4 Financial Report', 'Fourth quarter financial summary', (SELECT id FROM auth.users WHERE username='jane.smith'), (SELECT id FROM auth.users WHERE username='jane.smith'), '2.1', false, '/Company Home/Finance/Q4 Financial Report.xlsx', '{"sheets": 5, "currency": "USD"}', NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 days'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Project Alpha'), 'Architecture Design.docx', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1048576, 'Architecture Design Document', 'System architecture for Project Alpha', (SELECT id FROM auth.users WHERE username='david.lee'), (SELECT id FROM auth.users WHERE username='david.lee'), '3.0', true, '/Company Home/Projects/Project Alpha/Architecture Design.docx', '{"status": "approved"}', NOW() - INTERVAL '5 months', NOW() - INTERVAL '2 weeks'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Shared Documents'), 'Meeting Notes Jan 2024.txt', 'document', 'text/plain', 4096, 'January Meeting Notes', 'Monthly all-hands meeting notes', (SELECT id FROM auth.users WHERE username='bob.wilson'), (SELECT id FROM auth.users WHERE username='bob.wilson'), '1.0', true, '/Company Home/Shared Documents/Meeting Notes Jan 2024.txt', '{}', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Marketing'), 'Brand Guidelines.pdf', 'document', 'application/pdf', 8388608, 'Brand Guidelines', 'Official brand guidelines and asset usage', (SELECT id FROM auth.users WHERE username='carlos.garcia'), (SELECT id FROM auth.users WHERE username='carlos.garcia'), '1.5', false, '/Company Home/Marketing/Brand Guidelines.pdf', '{"pages": 32}', NOW() - INTERVAL '8 months', NOW() - INTERVAL '1 month'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='HR Department'), 'Employee Handbook.pdf', 'document', 'application/pdf', 3145728, 'Employee Handbook', 'Comprehensive employee handbook', (SELECT id FROM auth.users WHERE username='john.doe'), (SELECT id FROM auth.users WHERE username='john.doe'), '4.0', true, '/Company Home/HR Department/Employee Handbook.pdf', '{"pages": 120, "year": 2024}', NOW() - INTERVAL '1 year', NOW() - INTERVAL '2 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Legal'), 'NDA Template.docx', 'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 65536, 'Non-Disclosure Agreement Template', 'Standard NDA for vendors and partners', (SELECT id FROM auth.users WHERE username='alice.johnson'), (SELECT id FROM auth.users WHERE username='alice.johnson'), '2.0', true, '/Company Home/Legal/NDA Template.docx', '{"legal_approved": true}', NOW() - INTERVAL '14 months', NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Engineering'), 'API Documentation.md', 'document', 'text/markdown', 131072, 'API Documentation', 'REST API documentation for ECM platform', (SELECT id FROM auth.users WHERE username='bob.wilson'), (SELECT id FROM auth.users WHERE username='bob.wilson'), '5.2', false, '/Company Home/Engineering/API Documentation.md', '{"format": "openapi3"}', NOW() - INTERVAL '10 months', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Training'), 'Onboarding Presentation.pptx', 'document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 15728640, 'New Employee Onboarding', 'Presentation for new employee orientation', (SELECT id FROM auth.users WHERE username='grace.taylor'), (SELECT id FROM auth.users WHERE username='grace.taylor'), '3.0', true, '/Company Home/Training/Onboarding Presentation.pptx', '{"slides": 45}', NOW() - INTERVAL '8 months', NOW() - INTERVAL '3 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Finance'), 'Budget 2024.xlsx', 'document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 786432, 'Annual Budget 2024', 'Company-wide annual budget', (SELECT id FROM auth.users WHERE username='jane.smith'), (SELECT id FROM auth.users WHERE username='jane.smith'), '1.3', false, '/Company Home/Finance/Budget 2024.xlsx', '{"protected": true, "sheets": 8}', NOW() - INTERVAL '4 months', NOW() - INTERVAL '2 weeks'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Project Beta'), 'Mobile App Wireframes.png', 'document', 'image/png', 5242880, 'Mobile App Wireframes', 'UI wireframes for mobile application', (SELECT id FROM auth.users WHERE username='emma.brown'), (SELECT id FROM auth.users WHERE username='emma.brown'), '2.0', true, '/Company Home/Projects/Project Beta/Mobile App Wireframes.png', '{"width": 3840, "height": 2160}', NOW() - INTERVAL '4 months', NOW() - INTERVAL '1 month'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Policies'), 'Data Privacy Policy.pdf', 'document', 'application/pdf', 1572864, 'Data Privacy Policy', 'GDPR and data privacy compliance policy', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '3.0', true, '/Company Home/Policies/Data Privacy Policy.pdf', '{"compliance": ["GDPR", "CCPA"]}', NOW() - INTERVAL '6 months', NOW() - INTERVAL '1 month'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Shared Documents'), 'Company Logo.svg', 'document', 'image/svg+xml', 32768, 'Company Logo', 'Official company logo vector file', (SELECT id FROM auth.users WHERE username='carlos.garcia'), (SELECT id FROM auth.users WHERE username='carlos.garcia'), '1.0', true, '/Company Home/Shared Documents/Company Logo.svg', '{"format": "vector"}', NOW() - INTERVAL '2 years', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Engineering'), 'Deployment Guide.md', 'document', 'text/markdown', 98304, 'Deployment Guide', 'Step-by-step deployment instructions', (SELECT id FROM auth.users WHERE username='frank.miller'), (SELECT id FROM auth.users WHERE username='frank.miller'), '2.1', false, '/Company Home/Engineering/Deployment Guide.md', '{"env": ["staging", "production"]}', NOW() - INTERVAL '3 months', NOW() - INTERVAL '5 days'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='HR Department'), 'Benefits Summary.pdf', 'document', 'application/pdf', 2097152, 'Benefits Summary', 'Employee benefits overview', (SELECT id FROM auth.users WHERE username='john.doe'), (SELECT id FROM auth.users WHERE username='john.doe'), '1.0', true, '/Company Home/HR Department/Benefits Summary.pdf', '{"year": 2024}', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Legal'), 'Service Agreement.pdf', 'document', 'application/pdf', 524288, 'Service Level Agreement', 'Standard SLA for client services', (SELECT id FROM auth.users WHERE username='alice.johnson'), (SELECT id FROM auth.users WHERE username='alice.johnson'), '1.2', false, '/Company Home/Legal/Service Agreement.pdf', '{"type": "SLA"}', NOW() - INTERVAL '9 months', NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Reports'), 'Monthly KPI Report.xlsx', 'document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 393216, 'Monthly KPI Report', 'Key performance indicators dashboard', (SELECT id FROM auth.users WHERE username='jane.smith'), (SELECT id FROM auth.users WHERE username='jane.smith'), '1.0', true, '/Company Home/Reports/Monthly KPI Report.xlsx', '{"month": "January", "year": 2024}', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Templates'), 'Invoice Template.xlsx', 'document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 45056, 'Invoice Template', 'Standard invoice template', (SELECT id FROM auth.users WHERE username='admin'), (SELECT id FROM auth.users WHERE username='admin'), '2.0', true, '/Company Home/Templates/Invoice Template.xlsx', '{"currency": "USD"}', NOW() - INTERVAL '1 year', NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Project Gamma'), 'Data Model Design.pdf', 'document', 'application/pdf', 1048576, 'Data Model Design', 'Database schema and data model documentation', (SELECT id FROM auth.users WHERE username='frank.miller'), (SELECT id FROM auth.users WHERE username='frank.miller'), '1.0', true, '/Company Home/Projects/Project Gamma/Data Model Design.pdf', '{"tables": 42}', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
  (uuid_generate_v4(), (SELECT id FROM content.nodes WHERE name='Training'), 'Security Training.mp4', 'document', 'video/mp4', 104857600, 'Security Awareness Training', 'Annual security awareness training video', (SELECT id FROM auth.users WHERE username='grace.taylor'), (SELECT id FROM auth.users WHERE username='grace.taylor'), '1.0', true, '/Company Home/Training/Security Training.mp4', '{"duration": "00:25:00", "year": 2024}', NOW() - INTERVAL '5 months', NOW() - INTERVAL '5 months');

-- ======================================
-- 7. TAGS (18 tags)
-- ======================================
INSERT INTO content.tags (id, name, description, color, created_by, created_at) VALUES
  (uuid_generate_v4(), 'important', 'High priority content', '#FF0000', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'draft', 'Work in progress', '#FFA500', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'approved', 'Approved content', '#00C853', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'confidential', 'Confidential information', '#FF5630', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'public', 'Public information', '#00B8D9', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'archived', 'Archived content', '#666666', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'template', 'Document template', '#6554C0', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'policy', 'Policy document', '#0052CC', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'financial', 'Financial content', '#00875A', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'legal', 'Legal document', '#FF9800', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'training', 'Training material', '#9C27B0', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'project', 'Project related', '#3F51B5', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'review-needed', 'Needs review', '#E91E63', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'expired', 'Content has expired', '#795548', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'compliance', 'Compliance related', '#607D8B', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'internal', 'Internal use only', '#FF7043', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'report', 'Report document', '#26A69A', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'meeting', 'Meeting related', '#AB47BC', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '3 months');

-- ======================================
-- 8. CATEGORIES (16 categories)
-- ======================================
INSERT INTO content.categories (id, parent_id, name, description, path, created_at) VALUES
  (uuid_generate_v4(), NULL, 'Business', 'Business documents', '/Business', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), NULL, 'Technical', 'Technical documents', '/Technical', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), NULL, 'Administrative', 'Administrative documents', '/Administrative', NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Business'), 'Finance', 'Financial documents', '/Business/Finance', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Business'), 'Marketing', 'Marketing documents', '/Business/Marketing', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Business'), 'Sales', 'Sales documents', '/Business/Sales', NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Technical'), 'Architecture', 'Architecture documents', '/Technical/Architecture', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Technical'), 'Development', 'Development documents', '/Technical/Development', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Technical'), 'Infrastructure', 'Infrastructure documents', '/Technical/Infrastructure', NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Technical'), 'Security', 'Security documents', '/Technical/Security', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Administrative'), 'HR', 'Human resources documents', '/Administrative/HR', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Administrative'), 'Legal', 'Legal documents', '/Administrative/Legal', NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Administrative'), 'Compliance', 'Compliance documents', '/Administrative/Compliance', NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Business'), 'Operations', 'Operations documents', '/Business/Operations', NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Technical'), 'Testing', 'QA and testing documents', '/Technical/Testing', NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), (SELECT id FROM content.categories WHERE name='Administrative'), 'Training', 'Training materials', '/Administrative/Training', NOW() - INTERVAL '6 months');

-- ======================================
-- 9. WORKFLOW PROCESS DEFINITIONS (15)
-- ======================================
INSERT INTO workflow.process_definitions (id, key, name, version, description, category, has_start_form, created_at) VALUES
  (uuid_generate_v4(), 'doc-review', 'Document Review & Approval', 1, 'Standard document review with single approver', 'Document Management', true, NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'doc-review', 'Document Review & Approval', 2, 'Updated review with parallel approvers', 'Document Management', true, NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'content-publish', 'Content Publishing', 1, 'Author to editor to publish workflow', 'Publishing', true, NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'contract-lifecycle', 'Contract Lifecycle Management', 1, 'Full contract lifecycle from draft to signed', 'Legal', true, NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'invoice-process', 'Invoice Processing', 1, 'Invoice submission, validation, and approval', 'Finance', true, NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'employee-onboard', 'Employee Onboarding', 1, 'New employee onboarding checklist', 'HR', true, NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'change-request', 'Change Request', 1, 'IT change request approval process', 'IT', true, NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'expense-approval', 'Expense Approval', 1, 'Expense report submission and approval', 'Finance', true, NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'leave-request', 'Leave Request', 1, 'Employee leave request and approval', 'HR', true, NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'vendor-approval', 'Vendor Approval', 1, 'New vendor onboarding and approval', 'Procurement', true, NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'quality-review', 'Quality Review', 1, 'Document quality assurance review', 'Quality', true, NOW() - INTERVAL '5 months'),
  (uuid_generate_v4(), 'compliance-check', 'Compliance Check', 1, 'Regulatory compliance verification', 'Compliance', true, NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'project-approval', 'Project Approval', 1, 'New project proposal approval', 'Management', true, NOW() - INTERVAL '3 months'),
  (uuid_generate_v4(), 'data-access', 'Data Access Request', 1, 'Request access to sensitive data', 'Security', true, NOW() - INTERVAL '2 months'),
  (uuid_generate_v4(), 'incident-response', 'Incident Response', 1, 'Security incident response workflow', 'Security', false, NOW() - INTERVAL '1 month');

-- ======================================
-- 10. WORKFLOW PROCESS INSTANCES (18)
-- ======================================
INSERT INTO workflow.process_instances (id, process_definition_id, business_key, name, description, start_user_id, start_time, end_time, state) VALUES
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='doc-review' AND version=2 LIMIT 1), 'DOC-2024-001', 'Review Company Policy Update', 'Annual policy document review', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '5 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='doc-review' AND version=2 LIMIT 1), 'DOC-2024-002', 'Review API Documentation', 'Technical documentation review', (SELECT id FROM auth.users WHERE username='bob.wilson'), NOW() - INTERVAL '3 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='content-publish' LIMIT 1), 'PUB-2024-001', 'Publish Brand Guidelines', 'Updated brand guidelines for 2024', (SELECT id FROM auth.users WHERE username='carlos.garcia'), NOW() - INTERVAL '7 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='contract-lifecycle' LIMIT 1), 'CON-2024-001', 'Vendor NDA Processing', 'NDA for new technology vendor', (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '10 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='invoice-process' LIMIT 1), 'INV-2024-001', 'Process Q4 Invoices', 'Batch processing of Q4 vendor invoices', (SELECT id FROM auth.users WHERE username='jane.smith'), NOW() - INTERVAL '4 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='employee-onboard' LIMIT 1), 'EMP-2024-001', 'Onboard Noah Harris', 'New employee onboarding process', (SELECT id FROM auth.users WHERE username='john.doe'), NOW() - INTERVAL '2 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='expense-approval' LIMIT 1), 'EXP-2024-001', 'Conference Travel Expenses', 'Tech conference travel expense report', (SELECT id FROM auth.users WHERE username='david.lee'), NOW() - INTERVAL '6 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='leave-request' LIMIT 1), 'LVE-2024-001', 'Annual Leave Request', 'Two week vacation request', (SELECT id FROM auth.users WHERE username='emma.brown'), NOW() - INTERVAL '1 day', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='doc-review' AND version=1 LIMIT 1), 'DOC-2023-015', 'Review Security Policy', 'Annual security policy review', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month', 'completed'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='content-publish' LIMIT 1), 'PUB-2023-010', 'Publish Training Video', 'New security training video', (SELECT id FROM auth.users WHERE username='grace.taylor'), NOW() - INTERVAL '3 months', NOW() - INTERVAL '2 months', 'completed'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='contract-lifecycle' LIMIT 1), 'CON-2023-008', 'Process SLA Agreement', 'Service level agreement for client X', (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '4 months', NOW() - INTERVAL '3 months', 'completed'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='invoice-process' LIMIT 1), 'INV-2023-045', 'Process December Invoices', 'Monthly invoice batch', (SELECT id FROM auth.users WHERE username='jane.smith'), NOW() - INTERVAL '2 months', NOW() - INTERVAL '6 weeks', 'completed'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='employee-onboard' LIMIT 1), 'EMP-2023-012', 'Onboard Peter Robinson', 'Onboarding completed', (SELECT id FROM auth.users WHERE username='john.doe'), NOW() - INTERVAL '5 months', NOW() - INTERVAL '4 months', 'completed'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='change-request' LIMIT 1), 'CHG-2024-001', 'Database Migration', 'PostgreSQL version upgrade request', (SELECT id FROM auth.users WHERE username='frank.miller'), NOW() - INTERVAL '8 days', NULL, 'suspended'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='vendor-approval' LIMIT 1), 'VND-2024-001', 'Approve Cloud Provider', 'Evaluation of new cloud provider', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '15 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='quality-review' LIMIT 1), 'QA-2024-001', 'QA Review Deployment Guide', 'Quality check on deployment docs', (SELECT id FROM auth.users WHERE username='bob.wilson'), NOW() - INTERVAL '3 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='compliance-check' LIMIT 1), 'CMP-2024-001', 'GDPR Compliance Audit', 'Quarterly GDPR compliance verification', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '12 days', NULL, 'active'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_definitions WHERE key='project-approval' LIMIT 1), 'PRJ-2024-001', 'Approve Project Delta', 'New project proposal review', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 days', NULL, 'active');

-- ======================================
-- 11. WORKFLOW TASKS (20 tasks)
-- ======================================
INSERT INTO workflow.tasks (id, process_instance_id, name, description, assignee_id, priority, due_date, state, created_at) VALUES
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='DOC-2024-001'), 'Review Policy Document', 'Review updated company policy for accuracy', (SELECT id FROM auth.users WHERE username='john.doe'), 80, NOW() + INTERVAL '2 days', 'active', NOW() - INTERVAL '5 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='DOC-2024-002'), 'Technical Review', 'Review API documentation for completeness', (SELECT id FROM auth.users WHERE username='david.lee'), 60, NOW() + INTERVAL '5 days', 'active', NOW() - INTERVAL '3 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='PUB-2024-001'), 'Edit Brand Content', 'Edit and format brand guidelines', (SELECT id FROM auth.users WHERE username='carlos.garcia'), 50, NOW() + INTERVAL '3 days', 'active', NOW() - INTERVAL '7 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='CON-2024-001'), 'Legal Review NDA', 'Review NDA terms and conditions', (SELECT id FROM auth.users WHERE username='alice.johnson'), 90, NOW() + INTERVAL '1 day', 'active', NOW() - INTERVAL '10 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='INV-2024-001'), 'Validate Invoices', 'Verify invoice amounts and details', (SELECT id FROM auth.users WHERE username='jane.smith'), 70, NOW() + INTERVAL '2 days', 'active', NOW() - INTERVAL '4 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='EMP-2024-001'), 'IT Setup', 'Set up workstation and accounts', (SELECT id FROM auth.users WHERE username='frank.miller'), 80, NOW() + INTERVAL '1 day', 'active', NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='EMP-2024-001'), 'HR Orientation', 'Conduct HR orientation session', (SELECT id FROM auth.users WHERE username='john.doe'), 60, NOW() + INTERVAL '3 days', 'active', NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='EXP-2024-001'), 'Approve Travel Expenses', 'Review and approve conference expenses', (SELECT id FROM auth.users WHERE username='bob.wilson'), 50, NOW() + INTERVAL '4 days', 'active', NOW() - INTERVAL '6 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='LVE-2024-001'), 'Approve Leave Request', 'Review vacation request', (SELECT id FROM auth.users WHERE username='bob.wilson'), 40, NOW() + INTERVAL '2 days', 'active', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='DOC-2024-001'), 'Final Approval', 'Final sign-off on policy document', (SELECT id FROM auth.users WHERE username='admin'), 90, NOW() + INTERVAL '5 days', 'active', NOW() - INTERVAL '5 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='VND-2024-001'), 'Evaluate Vendor Proposal', 'Evaluate technical capabilities', (SELECT id FROM auth.users WHERE username='david.lee'), 60, NOW() + INTERVAL '7 days', 'active', NOW() - INTERVAL '15 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='QA-2024-001'), 'Review Documentation Quality', 'Check formatting and accuracy', (SELECT id FROM auth.users WHERE username='grace.taylor'), 50, NOW() + INTERVAL '3 days', 'active', NOW() - INTERVAL '3 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='CMP-2024-001'), 'Data Processing Audit', 'Audit data processing activities', (SELECT id FROM auth.users WHERE username='alice.johnson'), 80, NOW() + INTERVAL '5 days', 'active', NOW() - INTERVAL '12 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='PRJ-2024-001'), 'Budget Review', 'Review project budget proposal', (SELECT id FROM auth.users WHERE username='jane.smith'), 70, NOW() + INTERVAL '3 days', 'active', NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='PRJ-2024-001'), 'Technical Feasibility', 'Assess technical feasibility', (SELECT id FROM auth.users WHERE username='bob.wilson'), 70, NOW() + INTERVAL '4 days', 'active', NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='DOC-2023-015'), 'Security Review', 'Security policy content review', (SELECT id FROM auth.users WHERE username='admin'), 90, NOW() - INTERVAL '5 weeks', 'completed', NOW() - INTERVAL '2 months'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='DOC-2023-015'), 'Sign-off', 'Final sign-off on security policy', (SELECT id FROM auth.users WHERE username='admin'), 90, NOW() - INTERVAL '4 weeks', 'completed', NOW() - INTERVAL '6 weeks'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='PUB-2023-010'), 'Video Editing', 'Edit and produce training video', (SELECT id FROM auth.users WHERE username='grace.taylor'), 60, NOW() - INTERVAL '10 weeks', 'completed', NOW() - INTERVAL '3 months'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='CON-2023-008'), 'Contract Negotiation', 'Negotiate SLA terms', (SELECT id FROM auth.users WHERE username='alice.johnson'), 80, NOW() - INTERVAL '14 weeks', 'completed', NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), (SELECT id FROM workflow.process_instances WHERE business_key='INV-2023-045'), 'Invoice Batch Processing', 'Process December invoice batch', (SELECT id FROM auth.users WHERE username='jane.smith'), 70, NOW() - INTERVAL '7 weeks', 'completed', NOW() - INTERVAL '2 months');

-- ======================================
-- 12. RECORDS MANAGEMENT - File Plans (15)
-- ======================================
INSERT INTO records.file_plans (id, name, description, is_active, created_by, created_at) VALUES
  (uuid_generate_v4(), 'Corporate Records Plan', 'Main corporate records management plan', true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'Financial Records Plan', 'Financial document retention plan', true, (SELECT id FROM auth.users WHERE username='jane.smith'), NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'HR Records Plan', 'Employee records management plan', true, (SELECT id FROM auth.users WHERE username='john.doe'), NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'Legal Records Plan', 'Legal document retention plan', true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'IT Records Plan', 'Technology documentation plan', true, (SELECT id FROM auth.users WHERE username='bob.wilson'), NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'Marketing Records Plan', 'Marketing materials retention', true, (SELECT id FROM auth.users WHERE username='carlos.garcia'), NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'Project Records Plan', 'Project documentation plan', true, (SELECT id FROM auth.users WHERE username='david.lee'), NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'Compliance Records Plan', 'Regulatory compliance records', true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'Vendor Records Plan', 'Vendor and supplier records', true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'Customer Records Plan', 'Customer interaction records', true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'Safety Records Plan', 'Workplace safety records', true, (SELECT id FROM auth.users WHERE username='john.doe'), NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'Quality Records Plan', 'Quality management records', true, (SELECT id FROM auth.users WHERE username='grace.taylor'), NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'Training Records Plan', 'Employee training records', true, (SELECT id FROM auth.users WHERE username='grace.taylor'), NOW() - INTERVAL '5 months'),
  (uuid_generate_v4(), 'Audit Records Plan', 'Internal audit records', true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'Archive Plan 2023', 'Legacy archive plan', false, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years');

-- ======================================
-- 13. LEGAL HOLDS (15)
-- ======================================
INSERT INTO records.legal_holds (id, name, case_number, description, reason, legal_officer, start_date, end_date, is_active, created_by, created_at) VALUES
  (uuid_generate_v4(), 'Patent Dispute Hold', 'CASE-2024-001', 'Hold on all patent-related documents', 'Pending patent infringement litigation', 'Johnson & Associates', '2024-01-15', NULL, true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '1 month'),
  (uuid_generate_v4(), 'Employee Complaint Hold', 'CASE-2024-002', 'Hold related to employee complaint investigation', 'HR investigation in progress', 'Internal Legal', '2024-01-20', NULL, true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '3 weeks'),
  (uuid_generate_v4(), 'Regulatory Inquiry Hold', 'CASE-2024-003', 'Documents related to regulatory inquiry', 'SEC investigation request', 'External Counsel', '2024-02-01', NULL, true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 weeks'),
  (uuid_generate_v4(), 'Contract Dispute Hold', 'CASE-2024-004', 'Vendor contract dispute documents', 'Breach of contract claim', 'Smith & Partners', '2024-01-10', NULL, true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '5 weeks'),
  (uuid_generate_v4(), 'Data Breach Investigation', 'CASE-2024-005', 'Documents related to potential data breach', 'Security incident investigation', 'Internal Security', '2024-02-05', NULL, true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '10 days'),
  (uuid_generate_v4(), 'Tax Audit Hold', 'CASE-2024-006', 'Financial documents for tax audit', 'IRS audit for fiscal year 2023', 'Tax Counsel LLC', '2024-01-05', NULL, true, (SELECT id FROM auth.users WHERE username='jane.smith'), NOW() - INTERVAL '6 weeks'),
  (uuid_generate_v4(), 'Insurance Claim Hold', 'CASE-2024-007', 'Documents supporting insurance claim', 'Property damage claim', 'Insurance Legal Team', '2024-02-10', NULL, true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '5 days'),
  (uuid_generate_v4(), 'IP Theft Investigation', 'CASE-2023-015', 'Intellectual property theft investigation', 'Former employee IP claim', 'IP Attorneys Inc', '2023-06-15', '2023-12-31', false, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'Warranty Dispute 2023', 'CASE-2023-012', 'Product warranty dispute resolution', 'Customer warranty claim', 'Consumer Legal', '2023-04-01', '2023-09-30', false, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'OSHA Compliance Hold', 'CASE-2023-018', 'Workplace safety compliance investigation', 'OSHA inspection follow-up', 'Safety Counsel', '2023-08-01', '2024-01-15', false, (SELECT id FROM auth.users WHERE username='john.doe'), NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'Merger Review Hold', 'CASE-2024-008', 'Documents for potential merger review', 'Due diligence documentation', 'M&A Legal Team', '2024-01-25', NULL, true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '3 weeks'),
  (uuid_generate_v4(), 'Environmental Compliance', 'CASE-2024-009', 'Environmental compliance documentation', 'EPA inquiry response', 'Environmental Law Group', '2024-02-01', NULL, true, (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 weeks'),
  (uuid_generate_v4(), 'Shareholder Dispute', 'CASE-2024-010', 'Shareholder dispute documentation', 'Minority shareholder complaint', 'Corporate Legal', '2024-02-08', NULL, true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '1 week'),
  (uuid_generate_v4(), 'Vendor Fraud Investigation', 'CASE-2023-020', 'Vendor billing fraud investigation', 'Suspected fraudulent invoices', 'Forensic Accounting', '2023-10-01', '2024-01-31', false, (SELECT id FROM auth.users WHERE username='jane.smith'), NOW() - INTERVAL '4 months'),
  (uuid_generate_v4(), 'Non-Compete Violation', 'CASE-2024-011', 'Former employee non-compete violation', 'Non-compete clause enforcement', 'Employment Law Group', '2024-02-12', NULL, true, (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '3 days');

-- ======================================
-- 14. COLLABORATION SITES (16 sites)
-- ======================================
INSERT INTO collaboration.sites (id, short_name, title, description, visibility, created_by, created_at) VALUES
  (uuid_generate_v4(), 'engineering', 'Engineering Hub', 'Central hub for engineering team collaboration', 'private', (SELECT id FROM auth.users WHERE username='bob.wilson'), NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'marketing', 'Marketing Central', 'Marketing team workspace and campaigns', 'public', (SELECT id FROM auth.users WHERE username='carlos.garcia'), NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'hr-team', 'HR Team Site', 'Human resources team collaboration', 'private', (SELECT id FROM auth.users WHERE username='john.doe'), NOW() - INTERVAL '18 months'),
  (uuid_generate_v4(), 'finance-ops', 'Finance Operations', 'Finance department operations hub', 'private', (SELECT id FROM auth.users WHERE username='jane.smith'), NOW() - INTERVAL '15 months'),
  (uuid_generate_v4(), 'legal-team', 'Legal Department', 'Legal team document collaboration', 'private', (SELECT id FROM auth.users WHERE username='alice.johnson'), NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'project-alpha', 'Project Alpha', 'Cloud migration project site', 'private', (SELECT id FROM auth.users WHERE username='david.lee'), NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'project-beta', 'Project Beta', 'Mobile app development project', 'private', (SELECT id FROM auth.users WHERE username='emma.brown'), NOW() - INTERVAL '5 months'),
  (uuid_generate_v4(), 'executive', 'Executive Board', 'Executive team discussions and decisions', 'private', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'all-hands', 'All Hands', 'Company-wide announcements and discussions', 'public', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '2 years'),
  (uuid_generate_v4(), 'training', 'Training Center', 'Training materials and courses', 'public', (SELECT id FROM auth.users WHERE username='grace.taylor'), NOW() - INTERVAL '10 months'),
  (uuid_generate_v4(), 'qa-team', 'QA Team', 'Quality assurance team workspace', 'private', (SELECT id FROM auth.users WHERE username='grace.taylor'), NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'devops', 'DevOps Hub', 'DevOps and infrastructure team', 'private', (SELECT id FROM auth.users WHERE username='frank.miller'), NOW() - INTERVAL '8 months'),
  (uuid_generate_v4(), 'sales-team', 'Sales Team', 'Sales team collaboration and pipeline', 'private', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '12 months'),
  (uuid_generate_v4(), 'innovation', 'Innovation Lab', 'Ideas and innovation proposals', 'public', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '6 months'),
  (uuid_generate_v4(), 'support', 'Customer Support', 'Support team knowledge base', 'private', (SELECT id FROM auth.users WHERE username='admin'), NOW() - INTERVAL '9 months'),
  (uuid_generate_v4(), 'project-gamma', 'Project Gamma', 'Data analytics platform project', 'private', (SELECT id FROM auth.users WHERE username='frank.miller'), NOW() - INTERVAL '4 months');

-- ======================================
-- 15. AUDIT ENTRIES (20 entries)
-- ======================================
INSERT INTO audit.audit_entries (id, user_id, username, action, resource_type, resource_name, result, ip_address, user_agent, created_at) VALUES
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'LOGIN', 'auth', 'System Login', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '1 hour'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='john.doe'), 'john.doe', 'LOGIN', 'auth', 'System Login', 'success', '192.168.1.101', 'Mozilla/5.0 Firefox/121.0', NOW() - INTERVAL '2 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='jane.smith'), 'jane.smith', 'CREATE', 'document', 'Q4 Financial Report.xlsx', 'success', '192.168.1.102', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '3 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='bob.wilson'), 'bob.wilson', 'UPDATE', 'document', 'API Documentation.md', 'success', '192.168.1.103', 'Mozilla/5.0 Safari/17.0', NOW() - INTERVAL '4 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='alice.johnson'), 'alice.johnson', 'DELETE', 'document', 'Old Contract Draft.pdf', 'success', '192.168.1.104', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '5 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='carlos.garcia'), 'carlos.garcia', 'DOWNLOAD', 'document', 'Brand Guidelines.pdf', 'success', '192.168.1.105', 'Mozilla/5.0 Edge/120.0', NOW() - INTERVAL '6 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='david.lee'), 'david.lee', 'SHARE', 'document', 'Architecture Design.docx', 'success', '192.168.1.106', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '7 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='emma.brown'), 'emma.brown', 'CREATE', 'workflow', 'Leave Request', 'success', '192.168.1.107', 'Mozilla/5.0 Firefox/121.0', NOW() - INTERVAL '8 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='frank.miller'), 'frank.miller', 'UPDATE', 'site', 'DevOps Hub Settings', 'success', '192.168.1.108', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '9 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='grace.taylor'), 'grace.taylor', 'CREATE', 'site', 'QA Team Site', 'success', '192.168.1.109', 'Mozilla/5.0 Safari/17.0', NOW() - INTERVAL '10 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'BULK_DELETE', 'document', '15 archived documents', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'EXPORT_CSV', 'user', 'User List Export', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'EXPORT_PDF', 'audit', 'Audit Report Export', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='henry.clark'), 'henry.clark', 'LOGIN', 'auth', 'System Login', 'failure', '192.168.1.150', 'Mozilla/5.0 Chrome/119.0', NOW() - INTERVAL '3 days'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='ivy.martinez'), 'ivy.martinez', 'LOGIN', 'auth', 'System Login', 'failure', '10.0.0.50', 'curl/7.64.1', NOW() - INTERVAL '4 days'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'CHANGE_PASSWORD', 'user', 'Password Changed for john.doe', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '5 days'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'REGISTER_USER', 'user', 'New User: noah.harris', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '1 week'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'BULK_UPDATE', 'user', 'Updated roles for 8 users', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '1 week'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='john.doe'), 'john.doe', 'VERIFY_EMAIL', 'user', 'Email Verified: jack.anderson', 'success', '192.168.1.101', 'Mozilla/5.0 Firefox/121.0', NOW() - INTERVAL '1 week'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'admin', 'RESET_PASSWORD', 'user', 'Password Reset for ivy.martinez', 'success', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() - INTERVAL '2 weeks');

-- ======================================
-- 16. SESSIONS (15 sessions)
-- ======================================
INSERT INTO auth.sessions (id, user_id, token, refresh_token, device_info, ip_address, user_agent, expires_at, refresh_expires_at, created_at, last_accessed_at) VALUES
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'eyJhbGciOiJIUzI1NiJ9.admin.token1', 'refresh_admin_1', '{"browser": "Chrome", "os": "macOS"}', '192.168.1.100', 'Mozilla/5.0 Chrome/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '1 hour', NOW()),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='john.doe'), 'eyJhbGciOiJIUzI1NiJ9.john.token1', 'refresh_john_1', '{"browser": "Firefox", "os": "Windows"}', '192.168.1.101', 'Mozilla/5.0 Firefox/121.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='jane.smith'), 'eyJhbGciOiJIUzI1NiJ9.jane.token1', 'refresh_jane_1', '{"browser": "Chrome", "os": "macOS"}', '192.168.1.102', 'Mozilla/5.0 Chrome/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '5 minutes'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='bob.wilson'), 'eyJhbGciOiJIUzI1NiJ9.bob.token1', 'refresh_bob_1', '{"browser": "Safari", "os": "macOS"}', '192.168.1.103', 'Mozilla/5.0 Safari/17.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='alice.johnson'), 'eyJhbGciOiJIUzI1NiJ9.alice.token1', 'refresh_alice_1', '{"browser": "Chrome", "os": "Windows"}', '192.168.1.104', 'Mozilla/5.0 Chrome/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='carlos.garcia'), 'eyJhbGciOiJIUzI1NiJ9.carlos.token1', 'refresh_carlos_1', '{"browser": "Edge", "os": "Windows"}', '192.168.1.105', 'Mozilla/5.0 Edge/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='david.lee'), 'eyJhbGciOiJIUzI1NiJ9.david.token1', 'refresh_david_1', '{"browser": "Chrome", "os": "Linux"}', '192.168.1.106', 'Mozilla/5.0 Chrome/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '6 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='emma.brown'), 'eyJhbGciOiJIUzI1NiJ9.emma.token1', 'refresh_emma_1', '{"browser": "Firefox", "os": "macOS"}', '192.168.1.107', 'Mozilla/5.0 Firefox/121.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '2 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='frank.miller'), 'eyJhbGciOiJIUzI1NiJ9.frank.token1', 'refresh_frank_1', '{"browser": "Chrome", "os": "Linux"}', '192.168.1.108', 'Mozilla/5.0 Chrome/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 hour'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='grace.taylor'), 'eyJhbGciOiJIUzI1NiJ9.grace.token1', 'refresh_grace_1', '{"browser": "Safari", "os": "macOS"}', '192.168.1.109', 'Mozilla/5.0 Safari/17.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '4 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='kate.thomas'), 'eyJhbGciOiJIUzI1NiJ9.kate.token1', 'refresh_kate_1', '{"browser": "Chrome", "os": "Windows"}', '192.168.1.110', 'Mozilla/5.0 Chrome/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '10 minutes'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='leo.jackson'), 'eyJhbGciOiJIUzI1NiJ9.leo.token1', 'refresh_leo_1', '{"browser": "Firefox", "os": "Windows"}', '192.168.1.111', 'Mozilla/5.0 Firefox/121.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='mia.white'), 'eyJhbGciOiJIUzI1NiJ9.mia.token1', 'refresh_mia_1', '{"browser": "Chrome", "os": "macOS"}', '192.168.1.112', 'Mozilla/5.0 Chrome/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '5 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='noah.harris'), 'eyJhbGciOiJIUzI1NiJ9.noah.token1', 'refresh_noah_1', '{"browser": "Edge", "os": "Windows"}', '192.168.1.113', 'Mozilla/5.0 Edge/120.0', NOW() + INTERVAL '7 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '15 hours'),
  (uuid_generate_v4(), (SELECT id FROM auth.users WHERE username='admin'), 'eyJhbGciOiJIUzI1NiJ9.admin.expired', 'refresh_admin_expired', '{"browser": "Chrome", "os": "macOS"}', '192.168.1.100', 'Mozilla/5.0 Chrome/119.0', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days');

COMMIT;
