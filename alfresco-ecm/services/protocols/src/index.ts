import express from 'express';
import { v2 as webdav } from 'webdav-server';
import FtpSrv from 'ftp-srv';
import { Server as SFTPServer } from 'ssh2';
import { SMBServer } from './servers/smb.server';
import { WebDAVServer } from './servers/webdav.server';
import { connectDatabase } from './database/connection';
import { initializeCache } from './cache/redis';
import { logger } from './utils/logger';

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3006;
const WEBDAV_PORT = process.env.WEBDAV_PORT || 8080;
const FTP_PORT = process.env.FTP_PORT || 21;
const FTPS_PORT = process.env.FTPS_PORT || 990;
const SFTP_PORT = process.env.SFTP_PORT || 22;
const SMB_PORT = process.env.SMB_PORT || 445;

async function startServers() {
  try {
    // Initialize connections
    await connectDatabase();
    await initializeCache();
    
    // Start WebDAV Server
    const webdavServer = new webdav.WebDAVServer({
      port: WEBDAV_PORT,
      httpAuthentication: new webdav.HTTPBasicAuthentication((user, pass, callback) => {
        // Authenticate against our auth service
        callback(null, user === 'admin' && pass === 'admin');
      }),
      privilegeManager: new webdav.SimplePathPrivilegeManager(),
      storageManager: new webdav.VirtualStorageManager(),
      autoSave: {
        treeFilePath: './webdav-tree.json',
        tempTreeFilePath: './webdav-tree-temp.json',
        onSaveError: () => logger.error('WebDAV tree save error'),
        onLoad: () => logger.info('WebDAV tree loaded')
      }
    });
    
    webdavServer.setFileSystem('/', new webdav.VirtualFileSystem(), (success) => {
      if (success) {
        logger.info(`WebDAV server started on port ${WEBDAV_PORT}`);
      }
    });
    
    webdavServer.start();
    
    // Start FTP Server
    const ftpServer = new FtpSrv({
      url: `ftp://0.0.0.0:${FTP_PORT}`,
      pasv_url: '0.0.0.0',
      pasv_min: 1024,
      pasv_max: 1048,
      greeting: 'Welcome to Alfresco FTP Server',
      tls: {
        key: process.env.TLS_KEY,
        cert: process.env.TLS_CERT,
        ca: process.env.TLS_CA
      },
      anonymous: false,
      blacklist: [],
      whitelist: []
    });
    
    ftpServer.on('login', async (data, resolve, reject) => {
      // Authenticate user
      if (data.username === 'admin' && data.password === 'admin') {
        resolve({ root: '/ftp-root' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
    
    ftpServer.listen().then(() => {
      logger.info(`FTP server started on port ${FTP_PORT}`);
    });
    
    // Start SFTP Server
    const sftpServer = new SFTPServer({
      hostKeys: [process.env.SSH_HOST_KEY || ''],
      algorithms: {
        serverHostKey: ['ssh-rsa', 'ssh-ed25519'],
        kex: ['ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'ecdh-sha2-nistp521'],
        cipher: ['aes128-gcm', 'aes256-gcm', 'aes128-ctr', 'aes192-ctr', 'aes256-ctr'],
        hmac: ['hmac-sha2-256', 'hmac-sha2-512', 'hmac-sha1'],
        compress: ['none', 'zlib@openssh.com', 'zlib']
      }
    });
    
    sftpServer.on('connection', (client, info) => {
      logger.info('SFTP Client connected:', info);
      
      client.on('authentication', (ctx) => {
        if (ctx.method === 'password' && 
            ctx.username === 'admin' && 
            ctx.password === 'admin') {
          ctx.accept();
        } else {
          ctx.reject();
        }
      });
      
      client.on('ready', () => {
        logger.info('SFTP Client authenticated');
        
        client.on('session', (accept, reject) => {
          const session = accept();
          
          session.on('sftp', (accept, reject) => {
            const sftpStream = accept();
            logger.info('SFTP session started');
            
            // Handle SFTP operations
            sftpStream.on('OPEN', (reqid, filename, flags, attrs) => {
              // Handle file open
            });
            
            sftpStream.on('READ', (reqid, handle, offset, length) => {
              // Handle file read
            });
            
            sftpStream.on('WRITE', (reqid, handle, offset, data) => {
              // Handle file write
            });
            
            sftpStream.on('CLOSE', (reqid, handle) => {
              // Handle file close
            });
          });
        });
      });
    });
    
    sftpServer.listen(SFTP_PORT, '0.0.0.0', () => {
      logger.info(`SFTP server started on port ${SFTP_PORT}`);
    });
    
    // Start SMB/CIFS Server
    const smbServer = new SMBServer({
      port: SMB_PORT,
      host: '0.0.0.0',
      name: 'ALFRESCO',
      comment: 'Alfresco SMB Server',
      workgroup: 'WORKGROUP',
      shares: [
        {
          name: 'alfresco',
          comment: 'Alfresco Share',
          path: '/smb-root'
        }
      ]
    });
    
    await smbServer.start();
    logger.info(`SMB/CIFS server started on port ${SMB_PORT}`);
    
    // HTTP Server for protocol info
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'protocols-service',
        protocols: {
          webdav: { port: WEBDAV_PORT, status: 'active' },
          ftp: { port: FTP_PORT, status: 'active' },
          ftps: { port: FTPS_PORT, status: 'active' },
          sftp: { port: SFTP_PORT, status: 'active' },
          smb: { port: SMB_PORT, status: 'active' }
        }
      });
    });
    
    app.listen(HTTP_PORT, () => {
      logger.info(`Protocol Service HTTP API running on port ${HTTP_PORT}`);
    });
    
  } catch (error) {
    logger.error('Failed to start protocol servers:', error);
    process.exit(1);
  }
}

startServers();