import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { wopiRouter } from './routes/wopi.routes';
import { office365Router } from './routes/office365.routes';
import { googleRouter } from './routes/google.routes';
import { onlyofficeRouter } from './routes/onlyoffice.routes';
import { collaboraRouter } from './routes/collabora.routes';
import { coauthoringRouter } from './routes/coauthoring.routes';
import { addinRouter } from './routes/addin.routes';
import { teamsRouter } from './routes/teams.routes';
import { sharepointRouter } from './routes/sharepoint.routes';
import { outlookRouter } from './routes/outlook.routes';
import { onedriveRouter } from './routes/onedrive.routes';
import { excelRouter } from './routes/excel.routes';
import { wordRouter } from './routes/word.routes';
import { powerpointRouter } from './routes/powerpoint.routes';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { initializeMSGraph } from './integrations/msgraph';
import { initializeGoogleAPIs } from './integrations/google';
import { startCoauthoringServer } from './servers/coauthoring';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3007;

async function startServer() {
  try {
    // Initialize connections
    await connectDatabase();
    await initializeCache();
    await initializeMSGraph();
    await initializeGoogleAPIs();
    
    // Start co-authoring server
    await startCoauthoringServer(io);
    
    // Middleware
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    
    // WOPI Protocol (Web Application Open Platform Interface)
    app.use('/wopi', wopiRouter);
    
    // Microsoft Office 365 Integration
    app.use('/api/v1/office365', office365Router);
    app.use('/api/v1/teams', teamsRouter);
    app.use('/api/v1/sharepoint', sharepointRouter);
    app.use('/api/v1/outlook', outlookRouter);
    app.use('/api/v1/onedrive', onedriveRouter);
    
    // Office Applications
    app.use('/api/v1/excel', excelRouter);
    app.use('/api/v1/word', wordRouter);
    app.use('/api/v1/powerpoint', powerpointRouter);
    
    // Google Workspace Integration
    app.use('/api/v1/google', googleRouter);
    
    // OnlyOffice Document Server
    app.use('/api/v1/onlyoffice', onlyofficeRouter);
    
    // Collabora Online
    app.use('/api/v1/collabora', collaboraRouter);
    
    // Co-authoring
    app.use('/api/v1/coauthoring', coauthoringRouter);
    
    // Office Add-ins
    app.use('/api/v1/addins', addinRouter);
    
    // Office Add-in Manifest
    app.get('/manifest.xml', (req, res) => {
      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:type="TaskPaneApp">
          <Id>e504fb41-a92a-4526-b101-542f357b7d4d</Id>
          <Version>1.0.0.0</Version>
          <ProviderName>Alfresco ECM</ProviderName>
          <DefaultLocale>en-US</DefaultLocale>
          <DisplayName DefaultValue="Alfresco ECM"/>
          <Description DefaultValue="Alfresco ECM Integration for Office"/>
          <IconUrl DefaultValue="https://localhost:3000/icon.png"/>
          <HighResolutionIconUrl DefaultValue="https://localhost:3000/icon-highres.png"/>
          <SupportUrl DefaultValue="https://alfresco.com/support"/>
          <AppDomains>
            <AppDomain>localhost:3000</AppDomain>
          </AppDomains>
          <Hosts>
            <Host Name="Document"/>
            <Host Name="Workbook"/>
            <Host Name="Presentation"/>
          </Hosts>
          <DefaultSettings>
            <SourceLocation DefaultValue="https://localhost:3000/office-addin"/>
            <RequestedWidth>350</RequestedWidth>
            <RequestedHeight>500</RequestedHeight>
          </DefaultSettings>
          <Permissions>ReadWriteDocument</Permissions>
          <VersionOverrides xmlns="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="VersionOverridesV1_0">
            <Hosts>
              <Host xsi:type="Document">
                <DesktopFormFactor>
                  <GetStarted>
                    <Title resid="GetStarted.Title"/>
                    <Description resid="GetStarted.Description"/>
                    <LearnMoreUrl resid="GetStarted.LearnMoreUrl"/>
                  </GetStarted>
                  <ExtensionPoint xsi:type="PrimaryCommandSurface">
                    <OfficeTab id="TabHome">
                      <Group id="CommandsGroup">
                        <Label resid="CommandsGroup.Label"/>
                        <Icon>
                          <bt:Image size="16" resid="Icon.16x16"/>
                          <bt:Image size="32" resid="Icon.32x32"/>
                          <bt:Image size="80" resid="Icon.80x80"/>
                        </Icon>
                        <Control xsi:type="Button" id="TaskpaneButton">
                          <Label resid="TaskpaneButton.Label"/>
                          <Supertip>
                            <Title resid="TaskpaneButton.Label"/>
                            <Description resid="TaskpaneButton.Tooltip"/>
                          </Supertip>
                          <Icon>
                            <bt:Image size="16" resid="Icon.16x16"/>
                            <bt:Image size="32" resid="Icon.32x32"/>
                            <bt:Image size="80" resid="Icon.80x80"/>
                          </Icon>
                          <Action xsi:type="ShowTaskpane">
                            <TaskpaneId>ButtonId1</TaskpaneId>
                            <SourceLocation resid="Taskpane.Url"/>
                          </Action>
                        </Control>
                      </Group>
                    </OfficeTab>
                  </ExtensionPoint>
                </DesktopFormFactor>
              </Host>
            </Hosts>
            <Resources>
              <bt:Images>
                <bt:Image id="Icon.16x16" DefaultValue="https://localhost:3000/icon-16.png"/>
                <bt:Image id="Icon.32x32" DefaultValue="https://localhost:3000/icon-32.png"/>
                <bt:Image id="Icon.80x80" DefaultValue="https://localhost:3000/icon-80.png"/>
              </bt:Images>
              <bt:Urls>
                <bt:Url id="GetStarted.LearnMoreUrl" DefaultValue="https://alfresco.com/help"/>
                <bt:Url id="Taskpane.Url" DefaultValue="https://localhost:3000/office-taskpane"/>
              </bt:Urls>
              <bt:ShortStrings>
                <bt:String id="GetStarted.Title" DefaultValue="Get started with Alfresco!"/>
                <bt:String id="CommandsGroup.Label" DefaultValue="Alfresco ECM"/>
                <bt:String id="TaskpaneButton.Label" DefaultValue="Open Alfresco"/>
              </bt:ShortStrings>
              <bt:LongStrings>
                <bt:String id="GetStarted.Description" DefaultValue="Alfresco ECM integration loaded successfully. Click the Alfresco button to get started."/>
                <bt:String id="TaskpaneButton.Tooltip" DefaultValue="Click to open Alfresco ECM panel"/>
              </bt:LongStrings>
            </Resources>
          </VersionOverrides>
        </OfficeApp>`);
    });
    
    // WebSocket for real-time collaboration
    io.on('connection', (socket) => {
      logger.info('Office client connected:', socket.id);
      
      socket.on('join:document', (documentId) => {
        socket.join(`document:${documentId}`);
        socket.to(`document:${documentId}`).emit('user:joined', {
          userId: socket.data.userId,
          socketId: socket.id
        });
      });
      
      socket.on('cursor:move', (data) => {
        socket.to(`document:${data.documentId}`).emit('cursor:update', {
          userId: socket.data.userId,
          cursor: data.cursor
        });
      });
      
      socket.on('content:change', (data) => {
        socket.to(`document:${data.documentId}`).emit('content:update', data);
      });
      
      socket.on('disconnect', () => {
        logger.info('Office client disconnected:', socket.id);
      });
    });
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'office-service',
        integrations: {
          office365: 'connected',
          google: 'connected',
          onlyoffice: 'connected',
          collabora: 'connected'
        }
      });
    });
    
    // Error handling
    app.use(errorHandler);
    
    httpServer.listen(PORT, () => {
      logger.info(`Office Integration Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start office service:', error);
    process.exit(1);
  }
}

startServer();

export { io };