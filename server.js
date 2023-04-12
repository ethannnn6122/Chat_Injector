// TODO
// *****************************************************************************************************
// only get new auth token if expired
// configure the CRM API for more routers (/routers/etc)
// check for change in webURL before downloading pictures and taking screenshot

// Start Server
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { chromium } from 'playwright';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// GLOBALS
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const router = express.Router();

app.use('/', router);

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

app.use(express.static(__dirname + '/public'));

// Chat Injection Site
console.log("Hello Ethan, Welcome to Chat Injector!");

// Fetch data from API, Recieving the URL and Chat button code
    // Dependencies- Axios, CRM API, dotenv

    // Get oauth token
    let oauthConfig = {
        method: 'post',
        url: 'https://bsgold1-int-smc-bucher-suter.auth.eu-west-1.amazoncognito.com//oauth2/token',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET
        })
    };
    axios(oauthConfig)
    .then( function (res) {
        let accessToken = res.data.access_token;
        process.env.ACCESS_TOKEN = accessToken;
        // console.log(process.env.ACCESS_TOKEN);
		getCrmData();
    })
    .catch( function (err) {
        console.log(err);
    });

// Call CRM API
	const getCrmData = () => {
		let config = {
			method: 'get',
			url: process.env.CRM_API,
			headers: { 
				'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, 
				'Content-Type': 'application/json'
			},
			data: ''
		  };
		  axios(config)
		  .then(function (response) {
			let object = response.data.elements;
			let largeLogoVal;
			let webURL;
			let footer;
			let smallLogo;
			// console.log(object);
			largeLogoVal = Object.values(object.TS07);
			process.env.LARGE_GRAPHIC_URL = largeLogoVal[2];
			// console.log("large logo: " , process.env.LARGE_GRAPHIC_URL);
			downloadLrgLogo(process.env.LARGE_GRAPHIC_URL, 'public');
			webURL = Object.values(object.TS02);
			process.env.WEB_URL = webURL[2];
			getScreenshot(process.env.WEB_URL);
			// console.log("web URL: ",webURL);
			footer = Object.values(object.TS05);
			process.env.FOOTER_CODE = footer[2];
			injectCode(process.env.FOOTER_CODE);
			// console.log("footer val: ", process.env.FOOTER_CODE);
			smallLogo = Object.values(object.TS06);
			process.env.SMALL_GRAPHIC_URL = smallLogo[2];
			// console.log("small logo val: ", process.env.SMALL_GRAPHIC_URL);
			downloadSmlLogo(process.env.SMALL_GRAPHIC_URL, 'public');
		  })
		  .catch(function (error) {
			console.log(error);
		  });
	}

// Download two graphics from CRM API
	const downloadLrgLogo = async (fileUrl, downloadFolder) => {
		// The path of the downloaded file on our machine
		const localFilePath = path.resolve(__dirname, downloadFolder, 'lrgLogo.png');
		try {
		const response = await axios({
			method: 'GET',
			url: fileUrl,
			responseType: 'stream',
		});
	
		const write = response.data.pipe(fs.createWriteStream(localFilePath));
		write.on('finish', () => {
			console.log('Successfully downloaded large logo!');
		});
		} catch (err) { 
		throw new Error(err);
		}
	};

	const downloadSmlLogo = async (fileUrl, downloadFolder) => {
		// The path of the downloaded file on our machine
		const localFilePath = path.resolve(__dirname, downloadFolder, 'smlLogo.png');
		try {
		const response = await axios({
			method: 'GET',
			url: fileUrl,
			responseType: 'stream',
		});
	
		const write = response.data.pipe(fs.createWriteStream(localFilePath));
		write.on('finish', () => {
			console.log('Successfully downloaded small logo!');
		});
		} catch (err) { 
			throw new Error(err);
		}
	}; 

// Screenshot home page of URL
    // Dependencies- Playwright
    const getScreenshot = async (webURL) => {
        let browser = await chromium.launch();
       
        let page = await browser.newPage();
        await page.setViewportSize({ width: 425, height: 2000 });
        await page.goto(webURL);
        await page.screenshot({ path: `./public/screenshot.png` });
        await browser.close();
		console.log("Successfully downloaded screenshot!");
    };

// Store chat button code in var and inject into webpage
	const injectCode = async (codeToInject) => {
		console.log(codeToInject);
		app.get("/", (req, res) => {
			res.sendFile(path.join(__dirname, '/footerStatic.html'));
			// res.send("<html>" +
			// 	"<head>" +
			// 		"<title>B+S Demo</title>" +
			// 	"</head>" +
			// 	"<body style='padding: 0; margin: 0'>" +
			// 		"<h1 style='margin: 1em 0em 1em 9em;'>A Mile High Coding Website</h1>"+
			// 		"<img src='screenshot.png' width='100%'/>" +
			// 	"</body>"+
			// 	"</html>");
		});
	};