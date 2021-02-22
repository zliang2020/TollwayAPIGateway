# Tollway API Gateway Installation
To install tollway Twilio IVR API gateway, using below listed steps.
* COLLECT INFO  
* INSTALL NODES JS
* CONFIGURE/BUILD API GATEWAY
* TEST
* SETUP SERVICE


# COLLECT INFO
To starting build the API gateway, collecting following information as they are required during the installation.
* Load Balancer Server
* GW Hostname
* GW Certificates in X-509 format
* Twilio Tokens
* SAP API End Points
* SAP API username/password
* SAP API test data


# INSTALL NODES JS
*	Choose and create a home folder for API gateway

*	Install npm/nodes.js 
```html   
https://www.npmjs.com/get-npm
```

* Open terminal as administrator

* Install yarn 
```bat
npm install --global yarn
```

* Change to API gateway home folder
```bat	
cd {{API_GATEWAY_HOME}} 
```

* Create new nodes application 
```bat	
yarn init
```
Accept defaults when prompted for question …
should see success Saved package.json if successful


# CONFIGURE/BUILD API GATEWAY

* Install dependencies
```bat	
yarn add express http-proxy-middleware morgan rotating-file-stream
```
* Add start command to package.json file

       Edit "package.json" to add scripts node:
```js	
       {
        ....
            ,
            "scripts": {
            "start": "node index.js"
            }
        }

```
       File should look similar to:
```js	
       {
            "name": "proxy",
            "version": "1.0.0",
            "description": "proxy server",
            "main": "index.js",
            "license": "MIT",
            "dependencies": {
                "express": "^4.17.1",
                "http-proxy-middleware": "^1.0.6",
                "morgan": "^1.10.0",
            “rotating-file-stream”: “^2.1.5”
            },
            "scripts": {
                "start": "node index.js"
            }
       }
```

* Install SSL certificate
```bat	
mkdir sslcert  
cd sslcert
```
* Copy and rename server.crt/server.key to the folder if the certificate is available

* No certs, generate self-signed certificate
```bat	
install openssl https://slproweb.com/download/Win64OpenSSL-1_1_1i.msi  
"C:\Program Files\OpenSSL-Win64\bin\openssl" req -new -x509 -days 3650 -nodes -out server.crt -keyout server.key
```

* Prepare logs folder
```bat	
cd {{API_GATEWAY_HOME}}  
mkdir logs
```

* Download and copy index.js 

* Edit index.js configuration section
```js	
// Configuration to be changed -----      
const PORT = 80;   // HTTP PORT
const SSL_PORT = 443;  // HTTPS PORT
const HOST = "localhost";  // external hostname
const SANDBOX_TOKEN = "xxxxx"; // Twilio token for QA
const PROD_TOKEN = "xxxxxx"; // Twilio token for Prod
const TOKEN = SANDBOX_TOKEN; 
// Configuration to be changed ---------------  
```

* Test it out
```js
npm start 
```
When started, will see something similar to
```bat
morgan morgan(options): use morgan("default", options) instead index.js:33:12
morgan default format: use combined format index.js:33:12
[HPM] Proxy created: /  -> http://drdx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter
[HPM] Proxy rewrite rule created: "^/dev-sapivr" ~> ""
[HPM] Subscribed to http-proxy events: [ 'error', 'proxyReq', 'close' ]
[HPM] Proxy created: /  -> http://drqx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter
[HPM] Proxy rewrite rule created: "^/qua-sapivr" ~> ""
[HPM] Subscribed to http-proxy events: [ 'error', 'proxyReq', 'close' ]
[HPM] Proxy created: /  -> http://drtx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter
[HPM] Proxy rewrite rule created: "^/trn-sapivr" ~> ""
[HPM] Subscribed to http-proxy events: [ 'error', 'proxyReq', 'close' ]
[HPM] Proxy created: /  -> http://carx1cilv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter
[HPM] Proxy rewrite rule created: "^/pre-sapivr" ~> ""
[HPM] Subscribed to http-proxy events: [ 'error', 'proxyReq', 'close' ]
[HPM] Proxy created: /  -> http://capx1cslv01.rcvp.tollway.state.il.us:50900/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_TWILIO&receiverParty=&receiverService=&interface=SI_ContactCenterIVRIn&interfaceNamespace=urn:ats:0700:IVR:ContactCenter
[HPM] Proxy rewrite rule created: "^/sapivr" ~> ""
[HPM] Subscribed to http-proxy events: [ 'error', 'proxyReq', 'close' ]
Starting HTTP Proxy at http://localhost:80/
Starting HTTPS Proxy at https://localhost:443/
```

# TEST

* Download curl
```html
https://curl.se/windows/dl-7.74.0_2/curl-7.74.0_2-win64-mingw.zip 
```

* Update test/getAccountInfo.xml file for test data

* Copy and execute curl commands from test/curls.txt

* Test SAP SOAP endpoints using curl command
```bat
curl --location --request POST --insecure -v ^
-u <user_name>:<password> ^
-H "Accept: application/xml" -H "Content-Type: application/xml" ^
-H "x-twilio-token: <token>" ^
-d @./getAccountInfo.xml ^
<SAP_SOAP_API_ENDPOINT>
```
Replace the <user_name>, <password>, <token> and <SAP_SOAP_API_ENDPOINT>

* Test API GW locally using curl command
```bat
curl --location --request POST --insecure -v ^
-u <user_name>:<password> ^
-H "Accept: application/xml" -H "Content-Type: application/xml" ^
-H "x-twilio-token: <token>" ^
-d @./getAccountInfo.xml ^
https://<host_name>/<env>-sapivr
```
Replace the <user_name>, <password>, <token>, <host_name> and <env>

* Test API GW locally using curl command
```bat
ccurl --location --request POST --insecure -v ^
-d "Token=<token>&User=<user_name>&Password=<password>&Server=<Load_balancer_Host>/<env>-sapivr"  ^
https://cyan-crocodile-3728.twil.io/testSAP
```
Replace the <user_name>, <password>, <token>, <load_balancer_host> and <env>


# SETUP SERVICE
* Stop NPM
```bat
cd {{API_GATEWAY_HOME}}  
npm stop
```
* Install qckwinsrv
```bat
npm install -g qckwinsvc
```
* Start as service
```bat
qckwinsvc
```

