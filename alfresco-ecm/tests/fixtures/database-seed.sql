-- Comprehensive Database Seed Data for Testing
-- Covers all scenarios, edge cases, and boundary conditions

-- ======================================
-- USERS AND AUTHENTICATION
-- ======================================

-- Clear existing test data
TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE auth.roles CASCADE;
TRUNCATE TABLE auth.permissions CASCADE;
TRUNCATE TABLE auth.sessions CASCADE;

-- Insert Roles
INSERT INTO auth.roles (id, name, description, permissions, created_at) VALUES
-- Standard roles
('role_admin', 'Administrator', 'Full system access', '{"*": ["create", "read", "update", "delete"]}', NOW()),
('role_manager', 'Manager', 'Department management access', '{"documents": ["create", "read", "update"], "users": ["read"]}', NOW()),
('role_user', 'User', 'Basic user access', '{"documents": ["create", "read"], "profile": ["read", "update"]}', NOW()),
('role_viewer', 'Viewer', 'Read-only access', '{"documents": ["read"]}', NOW()),
-- Edge case roles
('role_suspended', 'Suspended', 'No access', '{}', NOW()),
('role_custom_123', 'Custom Role with Special Chars !@#', 'Test special characters', '{"test": ["read"]}', NOW()),
('role_null_perms', 'Null Permissions', 'Role with null permissions', NULL, NOW());

-- Insert Users (covering all scenarios)
INSERT INTO auth.users (id, username, email, password_hash, full_name, role_id, status, created_at, last_login, metadata) VALUES
-- Happy path users
('usr_admin_001', 'admin', 'admin@alfresco.test', '$2b$10$YBvDR.example', 'Admin User', 'role_admin', 'active', NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 hour', '{"theme": "dark", "language": "en"}'),
('usr_manager_001', 'john.manager', 'john@alfresco.test', '$2b$10$YBvDR.example', 'John Manager', 'role_manager', 'active', NOW() - INTERVAL '6 months', NOW() - INTERVAL '2 hours', '{"department": "Sales"}'),
('usr_user_001', 'jane.doe', 'jane@alfresco.test', '$2b$10$YBvDR.example', 'Jane Doe', 'role_user', 'active', NOW() - INTERVAL '3 months', NOW() - INTERVAL '5 minutes', '{"notifications": true}'),
('usr_user_002', 'bob.smith', 'bob@alfresco.test', '$2b$10$YBvDR.example', 'Bob Smith', 'role_user', 'active', NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 day', NULL),

-- Edge case users
('usr_long_name', 'verylongusernamethattestscharacterlimitsinthesystem123456789', 'longname@test.com', '$2b$10$YBvDR.example', 'User With Extremely Long Name That Tests Database Field Limits And UI Display', 'role_user', 'active', NOW(), NULL, '{}'),
('usr_special_char', 'user.with-special_chars!@#$', 'special@test.com', '$2b$10$YBvDR.example', 'Special !@#$%^&*()', 'role_user', 'active', NOW(), NULL, '{"test": "special"}'),
('usr_inactive', 'inactive.user', 'inactive@test.com', '$2b$10$YBvDR.example', 'Inactive User', 'role_user', 'inactive', NOW() - INTERVAL '1 year', NULL, NULL),
('usr_suspended', 'suspended.user', 'suspended@test.com', '$2b$10$YBvDR.example', 'Suspended User', 'role_suspended', 'suspended', NOW(), NULL, '{"reason": "policy violation"}'),
('usr_pending', 'pending.user', 'pending@test.com', '$2b$10$YBvDR.example', 'Pending User', 'role_viewer', 'pending', NOW(), NULL, '{"activation_token": "abc123"}'),
('usr_deleted', 'deleted.user', 'deleted@test.com', '$2b$10$YBvDR.example', 'Deleted User', 'role_user', 'deleted', NOW() - INTERVAL '2 years', NOW() - INTERVAL '2 years', '{"deleted_at": "2023-01-01"}'),

-- Boundary condition users
('usr_min', 'a', 'a@b.c', '$2b$10$min', 'A', 'role_viewer', 'active', '2020-01-01 00:00:00', NULL, '{}'),
('usr_null_email', 'no_email_user', NULL, '$2b$10$YBvDR.example', 'No Email User', 'role_user', 'active', NOW(), NULL, NULL),
('usr_null_name', 'null_name', 'nullname@test.com', '$2b$10$YBvDR.example', NULL, 'role_user', 'active', NOW(), NULL, NULL),
('usr_duplicate_email', 'dup_email', 'admin@alfresco.test', '$2b$10$YBvDR.example', 'Duplicate Email', 'role_user', 'active', NOW(), NULL, NULL);

-- ======================================
-- DOCUMENTS AND CONTENT
-- ======================================

-- Insert Folders
INSERT INTO content.folders (id, name, parent_id, owner_id, path, permissions, created_at, metadata) VALUES
('fld_root', 'Root', NULL, 'usr_admin_001', '/', '{"public": true}', NOW() - INTERVAL '2 years', '{"type": "root"}'),
('fld_shared', 'Shared Documents', 'fld_root', 'usr_admin_001', '/shared', '{"public": true}', NOW() - INTERVAL '1 year', '{"description": "Company shared folder"}'),
('fld_hr', 'HR Documents', 'fld_root', 'usr_manager_001', '/hr', '{"roles": ["role_admin", "role_manager"]}', NOW() - INTERVAL '6 months', '{"department": "HR", "confidential": true}'),
('fld_finance', 'Finance', 'fld_root', 'usr_manager_001', '/finance', '{"roles": ["role_admin", "role_manager"]}', NOW() - INTERVAL '6 months', '{"department": "Finance"}'),
('fld_projects', 'Projects', 'fld_root', 'usr_admin_001', '/projects', '{"public": false}', NOW() - INTERVAL '3 months', NULL),
('fld_archive', 'Archive', 'fld_root', 'usr_admin_001', '/archive', '{"roles": ["role_admin"]}', NOW() - INTERVAL '1 year', '{"retention": "7years"}'),
-- Nested folders
('fld_project_alpha', 'Project Alpha', 'fld_projects', 'usr_user_001', '/projects/alpha', '{}', NOW() - INTERVAL '2 months', '{"status": "active"}'),
('fld_project_beta', 'Project Beta', 'fld_projects', 'usr_user_002', '/projects/beta', '{}', NOW() - INTERVAL '1 month', '{"status": "completed"}'),
-- Edge case folders
('fld_deep_nest_1', 'Level1', 'fld_shared', 'usr_user_001', '/shared/level1', '{}', NOW(), NULL),
('fld_deep_nest_2', 'Level2', 'fld_deep_nest_1', 'usr_user_001', '/shared/level1/level2', '{}', NOW(), NULL),
('fld_deep_nest_3', 'Level3', 'fld_deep_nest_2', 'usr_user_001', '/shared/level1/level2/level3', '{}', NOW(), NULL),
('fld_special_chars', 'Folder with !@#$%^&*() special chars', 'fld_root', 'usr_user_001', '/special', '{}', NOW(), NULL);

-- Insert Documents (various types and states)
INSERT INTO content.documents (id, title, folder_id, owner_id, file_path, file_size, mime_type, version, status, tags, metadata, created_at, updated_at) VALUES
-- Standard documents
('doc_001', 'Company Policy 2024.pdf', 'fld_shared', 'usr_admin_001', '/storage/doc_001.pdf', 2048576, 'application/pdf', '1.0', 'published', ARRAY['policy', 'hr', '2024'], '{"pages": 45, "author": "HR Team"}', NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 week'),
('doc_002', 'Financial Report Q4.xlsx', 'fld_finance', 'usr_manager_001', '/storage/doc_002.xlsx', 524288, 'application/vnd.ms-excel', '2.1', 'published', ARRAY['finance', 'report', 'q4'], '{"protected": true}', NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 days'),
('doc_003', 'Project Alpha Proposal.docx', 'fld_project_alpha', 'usr_user_001', '/storage/doc_003.docx', 1048576, 'application/vnd.ms-word', '1.5', 'draft', ARRAY['project', 'proposal'], '{"status": "in_review"}', NOW() - INTERVAL '1 month', NOW()),
('doc_004', 'Meeting Notes.txt', 'fld_shared', 'usr_user_002', '/storage/doc_004.txt', 4096, 'text/plain', '1.0', 'published', ARRAY['meeting', 'notes'], NULL, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),

-- Various file types
('doc_img_001', 'Company Logo.png', 'fld_shared', 'usr_admin_001', '/storage/logo.png', 102400, 'image/png', '1.0', 'published', ARRAY['logo', 'branding'], '{"width": 1920, "height": 1080}', NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 year'),
('doc_video_001', 'Training Video.mp4', 'fld_hr', 'usr_manager_001', '/storage/training.mp4', 104857600, 'video/mp4', '1.0', 'published', ARRAY['training', 'video'], '{"duration": "00:15:30"}', NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months'),
('doc_zip_001', 'Archive Bundle.zip', 'fld_archive', 'usr_admin_001', '/storage/bundle.zip', 52428800, 'application/zip', '1.0', 'archived', ARRAY['archive', 'backup'], '{"files_count": 250}', NOW() - INTERVAL '2 years', NOW() - INTERVAL '2 years'),
('doc_code_001', 'Script.py', 'fld_projects', 'usr_user_001', '/storage/script.py', 8192, 'text/x-python', '3.2', 'published', ARRAY['code', 'python'], '{"lines": 200}', NOW() - INTERVAL '1 week', NOW() - INTERVAL '2 days'),

-- Edge cases and boundary conditions
('doc_large', 'Large File Test', 'fld_shared', 'usr_user_001', '/storage/large.bin', 2147483648, 'application/octet-stream', '1.0', 'published', ARRAY['test', 'large'], '{"warning": "large file"}', NOW(), NOW()),
('doc_zero', 'Empty File', 'fld_shared', 'usr_user_001', '/storage/empty.txt', 0, 'text/plain', '1.0', 'published', ARRAY['test', 'empty'], NULL, NOW(), NOW()),
('doc_special', 'File with !@#$%^&*() chars.pdf', 'fld_special_chars', 'usr_user_001', '/storage/special.pdf', 1024, 'application/pdf', '1.0', 'draft', ARRAY['test!', 'special@'], '{"special": true}', NOW(), NOW()),
('doc_long_name', 'This is a very long document name that tests the maximum character limit for document titles in the system and should be truncated properly in the UI.pdf', 'fld_shared', 'usr_user_001', '/storage/long.pdf', 1024, 'application/pdf', '1.0', 'published', NULL, NULL, NOW(), NOW()),
('doc_deleted', 'Deleted Document', 'fld_archive', 'usr_deleted', '/storage/deleted.pdf', 1024, 'application/pdf', '1.0', 'deleted', ARRAY['deleted'], '{"deleted_at": "2024-01-01"}', NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 year'),
('doc_locked', 'Locked Document', 'fld_shared', 'usr_admin_001', '/storage/locked.docx', 2048, 'application/vnd.ms-word', '1.0', 'locked', ARRAY['locked'], '{"locked_by": "usr_admin_001", "locked_at": "2024-01-15"}', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month');

-- Insert Document Versions
INSERT INTO content.versions (id, document_id, version_number, file_path, file_size, created_by, created_at, comment) VALUES
('ver_001_1', 'doc_001', '1.0', '/storage/versions/doc_001_v1.pdf', 2000000, 'usr_admin_001', NOW() - INTERVAL '3 months', 'Initial version'),
('ver_001_2', 'doc_001', '1.1', '/storage/versions/doc_001_v1.1.pdf', 2048576, 'usr_admin_001', NOW() - INTERVAL '2 months', 'Updated policy sections'),
('ver_002_1', 'doc_002', '1.0', '/storage/versions/doc_002_v1.xlsx', 500000, 'usr_manager_001', NOW() - INTERVAL '2 months', 'Initial report'),
('ver_002_2', 'doc_002', '2.0', '/storage/versions/doc_002_v2.xlsx', 520000, 'usr_manager_001', NOW() - INTERVAL '1 month', 'Major revision'),
('ver_002_3', 'doc_002', '2.1', '/storage/versions/doc_002_v2.1.xlsx', 524288, 'usr_manager_001', NOW() - INTERVAL '3 days', 'Minor corrections');

-- ======================================
-- WORKFLOWS AND TASKS
-- ======================================

INSERT INTO workflow.workflows (id, name, description, definition, status, created_by, created_at) VALUES
('wf_001', 'Document Approval', 'Standard document approval workflow', '{"nodes": ["start", "review", "approve", "end"]}', 'active', 'usr_admin_001', NOW() - INTERVAL '6 months'),
('wf_002', 'Content Publishing', 'Publishing workflow for content', '{"nodes": ["start", "create", "review", "publish", "end"]}', 'active', 'usr_manager_001', NOW() - INTERVAL '3 months'),
('wf_003', 'Invoice Processing', 'Invoice approval and payment', '{"nodes": ["start", "submit", "validate", "approve", "payment", "end"]}', 'active', 'usr_admin_001', NOW() - INTERVAL '2 months'),
('wf_004', 'Employee Onboarding', 'New employee onboarding process', '{"nodes": ["start", "hr", "it", "manager", "complete"]}', 'active', 'usr_manager_001', NOW() - INTERVAL '1 month'),
('wf_005', 'Deprecated Workflow', 'Old workflow no longer used', '{"nodes": ["start", "end"]}', 'deprecated', 'usr_admin_001', NOW() - INTERVAL '1 year');

INSERT INTO workflow.instances (id, workflow_id, document_id, current_step, status, started_by, started_at, completed_at, variables) VALUES
-- Active instances
('wfi_001', 'wf_001', 'doc_003', 'review', 'in_progress', 'usr_user_001', NOW() - INTERVAL '2 days', NULL, '{"priority": "high", "deadline": "2024-02-01"}'),
('wfi_002', 'wf_002', 'doc_004', 'create', 'in_progress', 'usr_user_002', NOW() - INTERVAL '1 day', NULL, '{"author": "usr_user_002"}'),
('wfi_003', 'wf_003', 'doc_002', 'approve', 'in_progress', 'usr_manager_001', NOW() - INTERVAL '3 days', NULL, '{"amount": 50000, "currency": "USD"}'),
-- Completed instances
('wfi_004', 'wf_001', 'doc_001', 'end', 'completed', 'usr_admin_001', NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks', '{"approved_by": "usr_manager_001"}'),
('wfi_005', 'wf_002', 'doc_img_001', 'end', 'completed', 'usr_admin_001', NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months', '{"published": true}'),
-- Failed/Cancelled instances
('wfi_006', 'wf_001', 'doc_deleted', 'review', 'cancelled', 'usr_deleted', NOW() - INTERVAL '1 year', NOW() - INTERVAL '1 year', '{"reason": "document deleted"}'),
('wfi_007', 'wf_003', NULL, 'validate', 'failed', 'usr_user_001', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks', '{"error": "validation failed"}');

INSERT INTO workflow.tasks (id, instance_id, name, assignee, status, due_date, created_at, completed_at, data) VALUES
-- Active tasks
('task_001', 'wfi_001', 'Review Document', 'usr_manager_001', 'pending', NOW() + INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL, '{"document_id": "doc_003"}'),
('task_002', 'wfi_002', 'Create Content', 'usr_user_002', 'in_progress', NOW() + INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL, '{"template": "blog_post"}'),
('task_003', 'wfi_003', 'Approve Invoice', 'usr_admin_001', 'pending', NOW() + INTERVAL '3 days', NOW() - INTERVAL '3 days', NULL, '{"amount": 50000}'),
-- Completed tasks
('task_004', 'wfi_004', 'Initial Review', 'usr_user_001', 'completed', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '1 month', NOW() - INTERVAL '3 weeks', '{"result": "approved"}'),
('task_005', 'wfi_004', 'Final Approval', 'usr_manager_001', 'completed', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '2 weeks', '{"result": "approved"}'),
-- Overdue tasks
('task_006', 'wfi_001', 'Urgent Review', 'usr_manager_001', 'pending', NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 days', NULL, '{"priority": "urgent", "overdue": true}'),
-- Reassigned tasks
('task_007', 'wfi_002', 'Review Content', 'usr_manager_001', 'pending', NOW() + INTERVAL '2 days', NOW() - INTERVAL '1 day', NULL, '{"reassigned_from": "usr_user_001", "reassigned_at": "2024-01-20"}');

-- ======================================
-- RECORDS MANAGEMENT
-- ======================================

INSERT INTO records.categories (id, name, code, retention_period, parent_id, created_at) VALUES
('cat_001', 'Financial Records', 'FIN', '7 years', NULL, NOW() - INTERVAL '2 years'),
('cat_002', 'HR Records', 'HR', '5 years', NULL, NOW() - INTERVAL '2 years'),
('cat_003', 'Legal Documents', 'LEG', '10 years', NULL, NOW() - INTERVAL '2 years'),
('cat_004', 'Contracts', 'CON', '7 years', 'cat_003', NOW() - INTERVAL '1 year'),
('cat_005', 'Tax Records', 'TAX', '7 years', 'cat_001', NOW() - INTERVAL '1 year'),
('cat_006', 'Temporary Records', 'TEMP', '1 year', NULL, NOW() - INTERVAL '6 months');

INSERT INTO records.records (id, document_id, category_id, classification, retention_date, disposition_action, status, created_at) VALUES
-- Active records
('rec_001', 'doc_001', 'cat_002', 'confidential', '2031-01-01', 'archive', 'active', NOW() - INTERVAL '3 months'),
('rec_002', 'doc_002', 'cat_001', 'internal', '2031-12-31', 'review', 'active', NOW() - INTERVAL '2 months'),
('rec_003', 'doc_003', 'cat_004', 'public', '2031-06-30', 'destroy', 'active', NOW() - INTERVAL '1 month'),
-- Cutoff records
('rec_004', 'doc_004', 'cat_006', 'public', '2025-01-01', 'destroy', 'cutoff', NOW() - INTERVAL '2 weeks'),
-- Destroyed records
('rec_005', 'doc_deleted', 'cat_006', 'internal', '2023-01-01', 'destroy', 'destroyed', NOW() - INTERVAL '1 year'),
-- Hold records
('rec_006', 'doc_locked', 'cat_003', 'confidential', '2034-01-01', 'review', 'hold', NOW() - INTERVAL '1 month');

-- ======================================
-- AUDIT AND COMPLIANCE
-- ======================================

INSERT INTO audit.events (id, user_id, action, resource_type, resource_id, ip_address, user_agent, success, details, created_at) VALUES
-- Successful operations
('evt_001', 'usr_admin_001', 'login', 'auth', NULL, '192.168.1.100', 'Mozilla/5.0', true, '{"method": "password"}', NOW() - INTERVAL '1 hour'),
('evt_002', 'usr_user_001', 'create', 'document', 'doc_003', '192.168.1.101', 'Chrome/120.0', true, '{"title": "Project Alpha Proposal.docx"}', NOW() - INTERVAL '1 month'),
('evt_003', 'usr_manager_001', 'update', 'document', 'doc_002', '192.168.1.102', 'Firefox/121.0', true, '{"version": "2.1"}', NOW() - INTERVAL '3 days'),
('evt_004', 'usr_user_002', 'read', 'document', 'doc_001', '192.168.1.103', 'Safari/17.0', true, '{"bytes_read": 2048576}', NOW() - INTERVAL '2 hours'),
-- Failed operations
('evt_005', 'usr_suspended', 'login', 'auth', NULL, '192.168.1.200', 'curl/7.64.1', false, '{"reason": "account suspended"}', NOW() - INTERVAL '1 day'),
('evt_006', 'usr_user_001', 'delete', 'document', 'doc_002', '192.168.1.101', 'Chrome/120.0', false, '{"reason": "permission denied"}', NOW() - INTERVAL '2 days'),
('evt_007', NULL, 'login', 'auth', NULL, '10.0.0.1', 'bot/1.0', false, '{"reason": "invalid credentials", "username": "hacker"}', NOW() - INTERVAL '3 hours'),
-- Bulk operations
('evt_008', 'usr_admin_001', 'bulk_update', 'document', NULL, '192.168.1.100', 'Mozilla/5.0', true, '{"count": 50, "folder": "fld_shared"}', NOW() - INTERVAL '1 week'),
-- System events
('evt_009', 'system', 'cleanup', 'audit', NULL, '127.0.0.1', 'system', true, '{"deleted_count": 1000, "older_than": "90 days"}', NOW() - INTERVAL '1 day'),
('evt_010', 'system', 'backup', 'database', NULL, '127.0.0.1', 'system', true, '{"size_mb": 5120, "duration_seconds": 300}', NOW() - INTERVAL '12 hours');

-- ======================================
-- COLLABORATION
-- ======================================

INSERT INTO collaboration.sites (id, name, description, visibility, owner_id, created_at, member_count, settings) VALUES
('site_001', 'Engineering Team', 'Engineering collaboration site', 'private', 'usr_manager_001', NOW() - INTERVAL '6 months', 15, '{"allow_external": false}'),
('site_002', 'Marketing Hub', 'Marketing team workspace', 'public', 'usr_user_001', NOW() - INTERVAL '3 months', 8, '{"theme": "marketing"}'),
('site_003', 'Executive Board', 'Executive only site', 'private', 'usr_admin_001', NOW() - INTERVAL '1 year', 5, '{"restricted": true}'),
('site_004', 'Project Alpha', 'Project Alpha collaboration', 'private', 'usr_user_001', NOW() - INTERVAL '2 months', 10, '{"project_id": "alpha"}'),
('site_005', 'Archived Site', 'No longer active', 'private', 'usr_deleted', NOW() - INTERVAL '2 years', 0, '{"archived": true}');

INSERT INTO collaboration.members (id, site_id, user_id, role, joined_at, last_activity) VALUES
-- Site 1 members
('mem_001', 'site_001', 'usr_manager_001', 'owner', NOW() - INTERVAL '6 months', NOW() - INTERVAL '1 hour'),
('mem_002', 'site_001', 'usr_user_001', 'contributor', NOW() - INTERVAL '5 months', NOW() - INTERVAL '2 hours'),
('mem_003', 'site_001', 'usr_user_002', 'contributor', NOW() - INTERVAL '4 months', NOW() - INTERVAL '1 day'),
('mem_004', 'site_001', 'usr_admin_001', 'admin', NOW() - INTERVAL '6 months', NOW()),
-- Site 2 members
('mem_005', 'site_002', 'usr_user_001', 'owner', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 hours'),
('mem_006', 'site_002', 'usr_user_002', 'contributor', NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 week'),
-- Site 3 members (executives only)
('mem_007', 'site_003', 'usr_admin_001', 'owner', NOW() - INTERVAL '1 year', NOW()),
('mem_008', 'site_003', 'usr_manager_001', 'member', NOW() - INTERVAL '11 months', NOW() - INTERVAL '2 days'),
-- Inactive members
('mem_009', 'site_004', 'usr_inactive', 'member', NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'),
('mem_010', 'site_005', 'usr_deleted', 'owner', NOW() - INTERVAL '2 years', NOW() - INTERVAL '2 years');

INSERT INTO collaboration.activities (id, site_id, user_id, type, title, description, data, created_at) VALUES
-- Recent activities
('act_001', 'site_001', 'usr_user_001', 'document_added', 'New document uploaded', 'Project proposal added', '{"document_id": "doc_003"}', NOW() - INTERVAL '1 hour'),
('act_002', 'site_001', 'usr_manager_001', 'comment_added', 'Commented on proposal', 'Great work on the proposal', '{"document_id": "doc_003", "comment_id": "com_001"}', NOW() - INTERVAL '30 minutes'),
('act_003', 'site_002', 'usr_user_002', 'member_joined', 'New member joined', 'Bob Smith joined the site', '{"member_id": "mem_006"}', NOW() - INTERVAL '2 hours'),
('act_004', 'site_003', 'usr_admin_001', 'site_updated', 'Site settings updated', 'Updated access permissions', '{"changes": ["permissions"]}', NOW() - INTERVAL '1 day'),
-- Bulk activities
('act_005', 'site_001', 'usr_admin_001', 'bulk_upload', 'Multiple documents added', '25 documents uploaded', '{"count": 25, "folder": "fld_shared"}', NOW() - INTERVAL '1 week'),
-- System activities
('act_006', 'site_004', 'system', 'auto_archive', 'Content auto-archived', 'Old content moved to archive', '{"count": 10, "age_days": 90}', NOW() - INTERVAL '1 month');

-- ======================================
-- SEARCH AND INDEXING
-- ======================================

INSERT INTO search.indexed_content (id, content_type, content_id, title, content, tags, indexed_at, boost_factor) VALUES
('idx_001', 'document', 'doc_001', 'Company Policy 2024.pdf', 'Company policy employee handbook guidelines procedures hr human resources...', ARRAY['policy', 'hr', '2024'], NOW() - INTERVAL '3 months', 1.5),
('idx_002', 'document', 'doc_002', 'Financial Report Q4.xlsx', 'Financial report quarter four revenue expenses profit loss balance sheet...', ARRAY['finance', 'report', 'q4'], NOW() - INTERVAL '2 months', 1.2),
('idx_003', 'document', 'doc_003', 'Project Alpha Proposal.docx', 'Project proposal alpha development timeline budget resources milestones...', ARRAY['project', 'proposal'], NOW() - INTERVAL '1 month', 1.0),
('idx_004', 'folder', 'fld_shared', 'Shared Documents', 'Shared documents company wide access public folder...', ARRAY['shared', 'public'], NOW() - INTERVAL '1 year', 0.8),
('idx_005', 'site', 'site_001', 'Engineering Team', 'Engineering team collaboration workspace development technical...', ARRAY['engineering', 'team'], NOW() - INTERVAL '6 months', 0.9);

-- ======================================
-- PERFORMANCE TEST DATA
-- ======================================

-- Generate large dataset for performance testing
INSERT INTO content.documents (id, title, folder_id, owner_id, file_path, file_size, mime_type, version, status, tags, created_at)
SELECT 
    'perf_doc_' || generate_series,
    'Performance Test Document ' || generate_series || '.pdf',
    CASE 
        WHEN generate_series % 5 = 0 THEN 'fld_shared'
        WHEN generate_series % 5 = 1 THEN 'fld_hr'
        WHEN generate_series % 5 = 2 THEN 'fld_finance'
        WHEN generate_series % 5 = 3 THEN 'fld_projects'
        ELSE 'fld_archive'
    END,
    CASE 
        WHEN generate_series % 4 = 0 THEN 'usr_admin_001'
        WHEN generate_series % 4 = 1 THEN 'usr_manager_001'
        WHEN generate_series % 4 = 2 THEN 'usr_user_001'
        ELSE 'usr_user_002'
    END,
    '/storage/perf/doc_' || generate_series || '.pdf',
    (random() * 10485760)::bigint, -- Random size up to 10MB
    'application/pdf',
    '1.0',
    CASE 
        WHEN generate_series % 10 = 0 THEN 'draft'
        WHEN generate_series % 10 = 1 THEN 'archived'
        ELSE 'published'
    END,
    ARRAY['performance', 'test', 'batch' || (generate_series / 100)::text],
    NOW() - (generate_series || ' hours')::interval
FROM generate_series(1, 1000);

-- Generate audit events for performance testing
INSERT INTO audit.events (id, user_id, action, resource_type, resource_id, ip_address, success, created_at)
SELECT 
    'perf_evt_' || generate_series,
    CASE 
        WHEN generate_series % 4 = 0 THEN 'usr_admin_001'
        WHEN generate_series % 4 = 1 THEN 'usr_manager_001'
        WHEN generate_series % 4 = 2 THEN 'usr_user_001'
        ELSE 'usr_user_002'
    END,
    CASE 
        WHEN generate_series % 5 = 0 THEN 'create'
        WHEN generate_series % 5 = 1 THEN 'read'
        WHEN generate_series % 5 = 2 THEN 'update'
        WHEN generate_series % 5 = 3 THEN 'delete'
        ELSE 'login'
    END,
    'document',
    'perf_doc_' || (generate_series % 1000)::text,
    '192.168.1.' || (generate_series % 255)::text,
    generate_series % 10 != 0, -- 10% failure rate
    NOW() - (generate_series || ' minutes')::interval
FROM generate_series(1, 10000);

-- ======================================
-- EDGE CASES AND ERROR SCENARIOS
-- ======================================

-- Documents with missing references (orphaned)
INSERT INTO content.documents (id, title, folder_id, owner_id, file_path, file_size, mime_type, version, status, created_at) VALUES
('orphan_doc_001', 'Orphaned Document 1', 'non_existent_folder', 'usr_user_001', '/storage/orphan1.pdf', 1024, 'application/pdf', '1.0', 'published', NOW()),
('orphan_doc_002', 'Orphaned Document 2', 'fld_shared', 'non_existent_user', '/storage/orphan2.pdf', 1024, 'application/pdf', '1.0', 'published', NOW());

-- Circular references (should be caught by constraints)
-- INSERT INTO content.folders (id, name, parent_id, owner_id, path, created_at) VALUES
-- ('circular_1', 'Circular 1', 'circular_2', 'usr_admin_001', '/circular1', NOW()),
-- ('circular_2', 'Circular 2', 'circular_1', 'usr_admin_001', '/circular2', NOW());

-- Documents with invalid data
INSERT INTO content.documents (id, title, folder_id, owner_id, file_path, file_size, mime_type, version, status, tags, created_at) VALUES
('invalid_doc_001', '', 'fld_shared', 'usr_user_001', '/storage/notitle.pdf', 1024, 'application/pdf', '1.0', 'published', ARRAY['test'], NOW()),
('invalid_doc_002', 'Negative Size', 'fld_shared', 'usr_user_001', '/storage/negative.pdf', -1, 'application/pdf', '1.0', 'published', ARRAY['test'], NOW()),
('invalid_doc_003', 'Invalid MIME', 'fld_shared', 'usr_user_001', '/storage/invalid.xyz', 1024, 'application/invalid', '1.0', 'published', ARRAY['test'], NOW()),
('invalid_doc_004', 'Future Date', 'fld_shared', 'usr_user_001', '/storage/future.pdf', 1024, 'application/pdf', '1.0', 'published', ARRAY['test'], NOW() + INTERVAL '1 year');

-- ======================================
-- STATISTICS AND ANALYTICS DATA
-- ======================================

-- Update statistics
ANALYZE;

-- Create summary view for testing
CREATE OR REPLACE VIEW test_statistics AS
SELECT 
    'users' as entity,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status != 'active' THEN 1 END) as inactive_count
FROM auth.users
UNION ALL
SELECT 
    'documents' as entity,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as active_count,
    COUNT(CASE WHEN status != 'published' THEN 1 END) as inactive_count
FROM content.documents
UNION ALL
SELECT 
    'workflows' as entity,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status != 'active' THEN 1 END) as inactive_count
FROM workflow.workflows;

-- Display summary
SELECT * FROM test_statistics;

COMMIT;