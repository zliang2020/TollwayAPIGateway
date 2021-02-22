const express = require('express');
const morgan = require("morgan");
const fs = require('fs');
const http = require('http');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');
const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// Create Express Server
const credentials = {key: privateKey, cert: certificate};
const app = express();

// Configuration to be changed -----      
const PORT = 80;   // HTTP PORT
const SSL_PORT = 443;  // HTTPS PORT
const HOST = "localhost";  // external hostname
const SANDBOX_TOKEN = "xxxxx"; // Twilio token for QA
const PROD_TOKEN = "xxxxxx"; // Twilio token for Prod
const TOKEN = SANDBOX_TOKEN; // set based on where the API gateway is installed.
const API_DEV_ENDPOINT = "http://drdx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter";  // SAP API DEV endpoint
const API_QUA_ENDPOINT = "http://drqx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter";  // SAP API QUA endpoint
const API_TRN_ENDPOINT = "http://drtx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter";  // SAP API TRN endpoint
const API_PRE_ENDPOINT = "http://carx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter";  // SAP API PRE-PROD endpoint
const API_PROD_ENDPOINT = "http://capx1cslv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter";  // SAP API PROD endpoint
// Configuration to be changed ---------------  

// Logging
app.set('env', 'production');

if(app.get("env")=="production") {
   var accessLogStream = fs.createWriteStream(__dirname + '/logs/' + "access.log", {flags: 'a'});
   app.use(morgan({stream: accessLogStream}));
} else {
   app.use(morgan("dev")); //log to console on development
}

// Info GET endpoint
app.get('/info', (req, res, next) => {
   res.send('This is a proxy service which proxies to Atomic Credit Union KeyBridge APIs.');
});

// Authorization
app.use('', (req, res, next) => {
   if (req.headers.authorization) {
      console.log(req.body);
       if ( req.headers['x-twilio-token'] !== TOKEN ) {
         res.sendStatus(403);
       } else {
         next();
       }
   } else {
       res.sendStatus(403);
   }
});


const devPath = '/dev-sapivr';
const quaPath = '/qua-sapivr';
const trnPath = '/trn-sapivr';
const prePath = '/pre-sapivr';
const prodPath = '/sapivr';

// SAP DEV endpoint
app.all(devPath, createProxyMiddleware({
   target: API_DEV_ENDPOINT,
   changeOrigin: true,
   pathRewrite: {
       [`^`+devPath]: '',
   },
   onProxyReq: function onProxyReq(proxyReq, req, res) {
      // Log outbound request to remote target
      console.log('-->  ', req.method, devPath, '->', API_DEV_ENDPOINT + proxyReq.path);
  },
  onError: function onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({error: 'Error when connecting to remote server.'});
   },
   logLevel: 'debug',
   secure: true
}));

// SAP QUA endpoint
app.all(quaPath, createProxyMiddleware({
   target: API_QUA_ENDPOINT,
   changeOrigin: true,
   pathRewrite: {
      [`^`+quaPath]: '',
   },
   onProxyReq: function onProxyReq(proxyReq, req, res) {
      // Log outbound request to remote target
      console.log('-->  ', req.method, quaPath, '->', API_QUA_ENDPOINT + proxyReq.path);
  },
  onError: function onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({error: 'Error when connecting to remote server.'});
   },
   logLevel: 'debug',
   secure: true
}));

// SAP TRN endpoint
app.all(trnPath, createProxyMiddleware({
   target: API_TRN_ENDPOINT,
   changeOrigin: true,
   pathRewrite: {
      [`^`+trnPath]: '',
   },
   onProxyReq: function onProxyReq(proxyReq, req, res) {
      // Log outbound request to remote target
      console.log('-->  ', req.method, trnPath, '->', API_TRN_ENDPOINT + proxyReq.path);
  },
  onError: function onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({error: 'Error when connecting to remote server.'});
   },
   logLevel: 'debug',
   secure: true
}));

// SAP PRE-PROD endpoint
app.all(prePath, createProxyMiddleware({
   target: API_PRE_ENDPOINT,
   changeOrigin: true,
   pathRewrite: {
      [`^`+prePath]: '',
   },
   onProxyReq: function onProxyReq(proxyReq, req, res) {
      // Log outbound request to remote target
      console.log('-->  ', req.method, prePath, '->', API_PRE_ENDPOINT + proxyReq.path);
  },
  onError: function onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({error: 'Error when connecting to remote server.'});
   },
   logLevel: 'debug',
   secure: true
}));


// SAP PROD endpoint
app.all(prodPath, createProxyMiddleware({
   target: API_PROD_ENDPOINT,
   changeOrigin: true,
   pathRewrite: {
      [`^`+prodPath]: '',
   },
   onProxyReq: function onProxyReq(proxyReq, req, res) {
      // Log outbound request to remote target
      console.log('-->  ', req.method, prodPath, '->', API_PROD_ENDPOINT + proxyReq.path);
  },
  onError: function onError(err, req, res) {
      console.error(err);
      res.status(500);
      res.json({error: 'Error when connecting to remote server.'});
   },
   logLevel: 'debug',
   secure: true
}));


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// Start the Proxy
httpServer.listen(PORT, HOST, () => {
   console.log(`Starting HTTP Proxy at http://${HOST}:${PORT}/`);
});
httpsServer.listen(SSL_PORT, HOST, () => {
   console.log(`Starting HTTPS Proxy at https://${HOST}:${SSL_PORT}/`);
});




