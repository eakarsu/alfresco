'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Avatar,
  AvatarGroup,
  Chip,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Toolbar,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
  Divider,
  Stack,
  Badge,
} from '@mui/material';
import {
  Folder as FolderIcon,
  InsertDriveFile,
  CloudUpload,
  CreateNewFolder,
  Share,
  Delete,
  Edit,
  Download,
  Visibility,
  Lock,
  LockOpen,
  History,
  Comment,
  Star,
  StarBorder,
  MoreVert,
  FilterList,
  Sort,
  ViewList,
  ViewModule,
  ViewCompact,
  Search,
  Refresh,
  Settings,
  Info,
  CheckCircle,
  Warning,
  Error,
  Person,
  Group,
  Public,
  VpnLock,
  Assignment,
  LocalOffer,
  Category,
  Transform,
  ContentCopy,
  ContentCut,
  ContentPaste,
  Archive,
  Unarchive,
  Print,
  Email,
  Link as LinkIcon,
  QrCode,
  PictureAsPdf,
  Image,
  VideoLibrary,
  AudioFile,
  Code,
  Description,
  TableChart,
  Dashboard,
  Timeline,
  AccountTree,
  WorkspacePremium,
  Policy,
  Gavel,
  Schedule,
  Event,
  FormatListBulleted,
  Forum,
  RssFeed,
  Bookmark,
  Language,
  Translate,
  CompareArrows,
  Sync,
  CloudSync,
  CloudDownload,
  FolderShared,
  FolderSpecial,
  DriveFileMove,
  Rule,
  AutoAwesome,
  SmartToy,
  Psychology,
  Insights,
  TrendingUp,
  Speed,
  Storage,
  Memory,
  BugReport,
  Build,
  Extension,
  IntegrationInstructions,
  Api,
  Webhook,
  Terminal,
  DeveloperMode,
} from '@mui/icons-material';

interface Document {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  modified: Date;
  modifier: string;
  created: Date;
  creator: string;
  path: string;
  version?: string;
  locked?: boolean;
  favorite?: boolean;
  shared?: boolean;
  permissions?: string[];
  tags?: string[];
  categories?: string[];
  description?: string;
  thumbnail?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AlfrescoSharePage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'gallery'>('list');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('/Company Home');
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Budget 2024.xlsx',
      type: 'file',
      mimeType: 'application/vnd.ms-excel',
      size: 1048576,
      modified: new Date(),
      modifier: 'John Doe',
      created: new Date(),
      creator: 'John Doe',
      path: '/Company Home/Finance',
      version: '1.2',
      locked: false,
      favorite: true,
      shared: true,
      tags: ['finance', 'budget', '2024'],
      categories: ['Finance', 'Planning'],
    },
    {
      id: '2',
      name: 'Marketing',
      type: 'folder',
      modified: new Date(),
      modifier: 'Jane Smith',
      created: new Date(),
      creator: 'Jane Smith',
      path: '/Company Home',
      shared: true,
    },
  ]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [propertiesDialogOpen, setPropertiesDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === documents.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(documents.map(doc => doc.id));
    }
  };

  const handleDoubleClick = (doc: Document) => {
    if (doc.type === 'folder') {
      setCurrentPath(`${currentPath}/${doc.name}`);
      // Load folder contents
    } else {
      setPreviewOpen(true);
      setSelectedDocument(doc);
    }
  };

  const renderDocumentIcon = (doc: Document) => {
    if (doc.type === 'folder') {
      return doc.shared ? <FolderShared /> : <FolderIcon />;
    }
    
    const mimeType = doc.mimeType || '';
    if (mimeType.includes('pdf')) return <PictureAsPdf />;
    if (mimeType.includes('image')) return <Image />;
    if (mimeType.includes('video')) return <VideoLibrary />;
    if (mimeType.includes('audio')) return <AudioFile />;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return <TableChart />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <Description />;
    if (mimeType.includes('code') || mimeType.includes('text')) return <Code />;
    return <InsertDriveFile />;
  };

  const speedDialActions = [
    { icon: <CloudUpload />, name: 'Upload Files', action: () => setUploadDialogOpen(true) },
    { icon: <CreateNewFolder />, name: 'Create Folder', action: () => setCreateFolderDialogOpen(true) },
    { icon: <Assignment />, name: 'Start Workflow', action: () => setWorkflowDialogOpen(true) },
    { icon: <SmartToy />, name: 'Smart Folder', action: () => {} },
    { icon: <Rule />, name: 'Create Rule', action: () => {} },
    { icon: <Link />, name: 'Create Link', action: () => {} },
  ];

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Toolbar */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar variant="dense">
          <Breadcrumbs sx={{ flexGrow: 1 }}>
            <Link href="#" underline="hover" color="inherit">
              Company Home
            </Link>
            <Link href="#" underline="hover" color="inherit">
              Sites
            </Link>
            <Typography color="text.primary">Marketing</Typography>
          </Breadcrumbs>
          
          <IconButton size="small" onClick={() => setViewMode('list')}>
            <ViewList />
          </IconButton>
          <IconButton size="small" onClick={() => setViewMode('grid')}>
            <ViewModule />
          </IconButton>
          <IconButton size="small" onClick={() => setViewMode('gallery')}>
            <ViewCompact />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton size="small">
            <FilterList />
          </IconButton>
          <IconButton size="small">
            <Sort />
          </IconButton>
          <IconButton size="small">
            <Refresh />
          </IconButton>
        </Toolbar>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Paper sx={{ width: 240, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          <List dense>
            <ListItem button>
              <ListItemIcon><Storage /></ListItemIcon>
              <ListItemText primary="Repository" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><FolderShared /></ListItemIcon>
              <ListItemText primary="My Files" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Share /></ListItemIcon>
              <ListItemText primary="Shared Files" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Group /></ListItemIcon>
              <ListItemText primary="Sites" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText primary="My Tasks" />
              <Chip label="3" size="small" color="primary" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><AccountTree /></ListItemIcon>
              <ListItemText primary="Workflows" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemIcon><Star /></ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><History /></ListItemIcon>
              <ListItemText primary="Recently Viewed" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Delete /></ListItemIcon>
              <ListItemText primary="Trashcan" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemIcon><FolderSpecial /></ListItemIcon>
              <ListItemText primary="Smart Folders" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Category /></ListItemIcon>
              <ListItemText primary="Categories" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><LocalOffer /></ListItemIcon>
              <ListItemText primary="Tags" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemIcon><Archive /></ListItemIcon>
              <ListItemText primary="Records" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Policy /></ListItemIcon>
              <ListItemText primary="File Plan" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><Gavel /></ListItemIcon>
              <ListItemText primary="Legal Holds" />
            </ListItem>
          </List>
        </Paper>

        {/* Center Content */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Documents" icon={<Folder />} iconPosition="start" />
            <Tab label="Wiki" icon={<Description />} iconPosition="start" />
            <Tab label="Blog" icon={<RssFeed />} iconPosition="start" />
            <Tab label="Discussions" icon={<Forum />} iconPosition="start" />
            <Tab label="Calendar" icon={<Event />} iconPosition="start" />
            <Tab label="Links" icon={<LinkIcon />} iconPosition="start" />
            <Tab label="Data Lists" icon={<FormatListBulleted />} iconPosition="start" />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            {/* Documents Tab */}
            {viewMode === 'list' && (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox 
                          indeterminate={selectedItems.length > 0 && selectedItems.length < documents.length}
                          checked={selectedItems.length === documents.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Modified</TableCell>
                      <TableCell>Modifier</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow 
                        key={doc.id}
                        hover
                        selected={selectedItems.includes(doc.id)}
                        onDoubleClick={() => handleDoubleClick(doc)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedItems.includes(doc.id)}
                            onChange={() => handleSelectItem(doc.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {renderDocumentIcon(doc)}
                            <Typography>{doc.name}</Typography>
                            {doc.locked && <Lock fontSize="small" />}
                            {doc.favorite && <Star fontSize="small" color="warning" />}
                            {doc.shared && <Share fontSize="small" color="primary" />}
                          </Box>
                        </TableCell>
                        <TableCell>{doc.modified.toLocaleDateString()}</TableCell>
                        <TableCell>{doc.modifier}</TableCell>
                        <TableCell>{doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : '-'}</TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Download />
                          </IconButton>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small">
                            <Share />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {viewMode === 'grid' && (
              <Grid container spacing={2}>
                {documents.map((doc) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3 }
                      }}
                      onDoubleClick={() => handleDoubleClick(doc)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          {renderDocumentIcon(doc)}
                        </Box>
                        <Typography variant="body2" noWrap>
                          {doc.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doc.modified.toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            {/* Wiki Tab */}
            <Typography>Wiki content here</Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            {/* Blog Tab */}
            <Typography>Blog content here</Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            {/* Discussions Tab */}
            <Typography>Discussions content here</Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={4}>
            {/* Calendar Tab */}
            <Typography>Calendar content here</Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={5}>
            {/* Links Tab */}
            <Typography>Links content here</Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={6}>
            {/* Data Lists Tab */}
            <Typography>Data Lists content here</Typography>
          </TabPanel>
        </Box>

        {/* Right Sidebar - Properties/Preview */}
        <Paper sx={{ width: 320, borderLeft: 1, borderColor: 'divider', p: 2, overflow: 'auto' }}>
          {selectedDocument ? (
            <>
              <Typography variant="h6" gutterBottom>
                Properties
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Name" secondary={selectedDocument.name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Type" secondary={selectedDocument.mimeType || 'Folder'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Size" secondary={selectedDocument.size ? `${(selectedDocument.size / 1024).toFixed(1)} KB` : '-'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Modified" secondary={selectedDocument.modified.toLocaleString()} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Modifier" secondary={selectedDocument.modifier} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Version" secondary={selectedDocument.version || '-'} />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                {selectedDocument.tags?.map(tag => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {selectedDocument.categories?.map(cat => (
                  <Chip key={cat} label={cat} size="small" variant="outlined" />
                ))}
              </Box>
            </>
          ) : (
            <Typography color="text.secondary">
              Select a document to view properties
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Floating Action Button */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}