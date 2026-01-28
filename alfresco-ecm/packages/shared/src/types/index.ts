// Core Types for Alfresco ECM Platform

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  groups?: Group[];
  roles?: Role[];
  permissions?: Permission[];
}

export interface Group {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  parentGroupId?: string;
  type: 'system' | 'custom' | 'dynamic';
  metadata?: Record<string, any>;
  members?: User[];
  subGroups?: Group[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  isSystem: boolean;
  permissions?: Permission[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
  constraints?: Record<string, any>;
}

export interface Node {
  id: string;
  nodeRef: string;
  name: string;
  type: NodeType;
  mimeType?: string;
  size?: number;
  parentId?: string;
  path: string;
  storeId: string;
  createdBy: string;
  modifiedBy: string;
  ownerId: string;
  isFolder: boolean;
  isLink: boolean;
  linkTargetId?: string;
  locked: boolean;
  lockedBy?: string;
  lockedAt?: Date;
  lockType?: 'READ' | 'WRITE' | 'NODE' | 'FULL';
  metadata: NodeMetadata;
  properties: Record<string, any>;
  aspects: string[];
  permissions: NodePermissions;
  versions?: Version[];
  tags?: Tag[];
  categories?: Category[];
  comments?: Comment[];
  ratings?: Rating;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface NodeType {
  name: string;
  title: string;
  description?: string;
  parent?: string;
  properties: PropertyDefinition[];
  associations: AssociationDefinition[];
  mandatoryAspects?: string[];
}

export interface PropertyDefinition {
  name: string;
  title: string;
  description?: string;
  dataType: DataType;
  mandatory: boolean;
  multiple: boolean;
  defaultValue?: any;
  constraints?: Constraint[];
}

export interface AssociationDefinition {
  name: string;
  title: string;
  sourceRole: string;
  targetRole: string;
  sourceMin: number;
  sourceMax: number;
  targetMin: number;
  targetMax: number;
  type: 'ASSOCIATION' | 'CHILD_ASSOCIATION';
}

export interface Constraint {
  type: 'REGEX' | 'LENGTH' | 'MINMAX' | 'LIST' | 'CUSTOM';
  parameters: Record<string, any>;
}

export type DataType = 
  | 'text' | 'int' | 'long' | 'float' | 'double' | 'boolean'
  | 'date' | 'datetime' | 'binary' | 'qname' | 'noderef'
  | 'category' | 'email' | 'url' | 'json';

export interface NodeMetadata {
  title?: string;
  description?: string;
  author?: string;
  keywords?: string[];
  customProperties?: Record<string, any>;
}

export interface NodePermissions {
  inherited: boolean;
  entries: PermissionEntry[];
}

export interface PermissionEntry {
  authorityId: string;
  authorityType: 'USER' | 'GROUP' | 'ROLE' | 'EVERYONE';
  permission: string;
  accessStatus: 'ALLOWED' | 'DENIED';
}

export interface Version {
  id: string;
  nodeId: string;
  versionLabel: string;
  majorVersion: number;
  minorVersion: number;
  description?: string;
  contentUrl?: string;
  size?: number;
  mimeType?: string;
  encoding?: string;
  createdBy: string;
  properties: Record<string, any>;
  isCurrent: boolean;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdBy: string;
  createdAt: Date;
  nodeCount?: number;
}

export interface Category {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  nodeId: string;
  parentCommentId?: string;
  content: string;
  createdBy: string;
  editedAt?: Date;
  createdAt: Date;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface Rating {
  average: number;
  count: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  myRating?: number;
}

export interface Workflow {
  id: string;
  definitionId: string;
  definitionKey: string;
  name: string;
  description?: string;
  businessKey?: string;
  status: WorkflowStatus;
  startedBy: string;
  startedAt: Date;
  endedAt?: Date;
  dueDate?: Date;
  priority: number;
  variables: Record<string, any>;
  tasks?: Task[];
  parentInstanceId?: string;
}

export type WorkflowStatus = 
  | 'active' | 'suspended' | 'completed' | 'cancelled' | 'terminated';

export interface Task {
  id: string;
  processInstanceId: string;
  taskDefinitionKey: string;
  name: string;
  description?: string;
  assignee?: string;
  candidateUsers?: string[];
  candidateGroups?: string[];
  owner?: string;
  priority: number;
  dueDate?: Date;
  status: TaskStatus;
  formKey?: string;
  variables: Record<string, any>;
  createdAt: Date;
  claimedAt?: Date;
  completedAt?: Date;
  completedBy?: string;
}

export type TaskStatus = 
  | 'created' | 'ready' | 'reserved' | 'in_progress' | 'suspended' 
  | 'completed' | 'failed' | 'error' | 'exited' | 'obsolete';

export interface ProcessDefinition {
  id: string;
  key: string;
  name: string;
  version: number;
  category?: string;
  description?: string;
  deploymentId: string;
  resourceName: string;
  diagramResourceName?: string;
  hasStartForm: boolean;
  hasGraphicalNotation: boolean;
  suspended: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface Site {
  id: string;
  shortName: string;
  title: string;
  description?: string;
  visibility: 'PUBLIC' | 'MODERATED' | 'PRIVATE';
  preset: string;
  rootFolderId: string;
  createdBy: string;
  metadata?: Record<string, any>;
  memberCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteMember {
  siteId: string;
  userId: string;
  role: 'SiteManager' | 'SiteCollaborator' | 'SiteContributor' | 'SiteConsumer';
  joinedAt: Date;
  invitedBy?: string;
  user?: User;
}

export interface Activity {
  id: string;
  siteId?: string;
  userId: string;
  activityType: ActivityType;
  summary: string;
  objectId?: string;
  objectType?: string;
  data: Record<string, any>;
  createdAt: Date;
}

export type ActivityType = 
  | 'file-added' | 'file-updated' | 'file-deleted' | 'file-downloaded'
  | 'file-previewed' | 'file-shared' | 'file-liked' | 'file-commented'
  | 'folder-added' | 'folder-deleted'
  | 'user-joined' | 'user-left' | 'user-role-changed'
  | 'site-created' | 'site-updated' | 'site-deleted'
  | 'workflow-started' | 'workflow-completed' | 'task-assigned' | 'task-completed';

export interface Record {
  id: string;
  nodeId: string;
  categoryId: string;
  identifier: string;
  title: string;
  recordType?: string;
  classification?: string;
  originator?: string;
  originatingOrganization?: string;
  publicationDate?: Date;
  dateFiled: Date;
  cutoffDate?: Date;
  retentionDate?: Date;
  dispositionDate?: Date;
  dispositionAction?: DispositionAction;
  dispositionAuthority?: string;
  holdIds: string[];
  vitalRecord: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
}

export type DispositionAction = 
  | 'retain' | 'cutoff' | 'transfer' | 'accession' | 'destroy';

export interface RetentionSchedule {
  id: string;
  name: string;
  description?: string;
  triggerEvent: TriggerEvent;
  retentionPeriod: {
    value: number;
    unit: 'days' | 'months' | 'years';
  };
  dispositionAction: DispositionAction;
  createdBy: string;
  createdAt: Date;
}

export type TriggerEvent = 
  | 'case_closed' | 'case_complete' | 'obsolete' | 'superseded' 
  | 'related_record_transferred' | 'no_longer_needed';

export interface LegalHold {
  id: string;
  name: string;
  caseNumber?: string;
  description?: string;
  reason: string;
  legalOfficer: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'released' | 'pending';
  recordIds: string[];
  createdBy: string;
  createdAt: Date;
  releasedAt?: Date;
  releasedBy?: string;
}

export interface AuditEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent?: string;
  sessionId?: string;
  success: boolean;
  errorMessage?: string;
  createdAt: Date;
}

export interface SearchQuery {
  query: string;
  language?: 'afts' | 'lucene' | 'cmis' | 'fts-alfresco';
  fields?: string[];
  facets?: FacetQuery[];
  filters?: FilterQuery[];
  sort?: SortQuery[];
  pagination?: {
    skipCount?: number;
    maxItems?: number;
  };
  includeFields?: string[];
  excludeFields?: string[];
  highlight?: {
    fields: string[];
    prefix?: string;
    suffix?: string;
  };
}

export interface FacetQuery {
  field: string;
  label?: string;
  minCount?: number;
  limit?: number;
  excludeFilters?: string[];
}

export interface FilterQuery {
  field: string;
  value: any;
  operator?: 'equals' | 'contains' | 'starts' | 'ends' | 'range' | 'exists';
}

export interface SortQuery {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchResult {
  totalItems: number;
  hasMoreItems: boolean;
  items: SearchResultItem[];
  facets?: FacetResult[];
  suggestions?: string[];
  queryTime: number;
}

export interface SearchResultItem {
  id: string;
  name: string;
  title?: string;
  description?: string;
  nodeType: string;
  path: string;
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  content?: {
    mimeType: string;
    size: number;
    encoding?: string;
  };
  properties?: Record<string, any>;
  permissions?: string[];
  highlight?: Record<string, string[]>;
  score?: number;
}

export interface FacetResult {
  field: string;
  label: string;
  buckets: FacetBucket[];
}

export interface FacetBucket {
  value: string;
  count: number;
  label?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

export type NotificationType = 
  | 'info' | 'success' | 'warning' | 'error'
  | 'task-assigned' | 'task-completed' | 'workflow-completed'
  | 'document-shared' | 'comment-added' | 'mention'
  | 'site-invitation' | 'deadline-approaching';

export interface SystemInfo {
  version: string;
  edition: string;
  schema: number;
  licenseMode: string;
  licenseExpiryDate?: Date;
  readOnly: boolean;
  auditEnabled: boolean;
  thumbnailGenerationEnabled: boolean;
  modules: ModuleInfo[];
  patches: PatchInfo[];
}

export interface ModuleInfo {
  id: string;
  title: string;
  description: string;
  version: string;
  installState: string;
  installDate?: Date;
  evaluatorClass?: string;
}

export interface PatchInfo {
  id: string;
  description: string;
  fixesFromSchema: number;
  fixesToSchema: number;
  targetSchema: number;
  applied: boolean;
  appliedOnDate?: Date;
  appliedToSchema?: number;
  appliedToServer?: string;
  wasExecuted: boolean;
  succeeded: boolean;
  report?: string;
}

export interface Tenant {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: Date;
  contentRoot?: string;
  dbUrl?: string;
}

export interface ReplicationJob {
  id: string;
  name: string;
  description?: string;
  sourceRepo: string;
  targetRepo: string;
  enabled: boolean;
  schedule?: string;
  payload?: ReplicationPayload;
  status: 'new' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  runStartTime?: Date;
  runEndTime?: Date;
  transferLocalReport?: string;
  transferRemoteReport?: string;
}

export interface ReplicationPayload {
  nodeRefs: string[];
  excludedAspects?: string[];
  includedAspects?: string[];
  excludeOlderThan?: Date;
  includeNewerThan?: Date;
}