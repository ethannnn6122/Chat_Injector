// Start Server
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;
const router = express.Router();
 
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/demoApp.html'));
});

app.use('/', router);
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

app.use(express.static(__dirname + '/public'));

// Chat Injection Site
console.log("Hello Ethan, Welcome to Chat Injector!");

// Step One- Fetch data from API, Recieving the URL and Chat button code
    // Dependencies- Axios, CRM API

// Step Two- Screenshot home page of URL
    // Dependencies- Puppeteer
    puppeteer.launch({
        defaultViewport: {
            width: 1280,
            height: 2000,
        },
    }).then(async (browser) => {
        const page = await browser.newPage();
        await page.goto("https://e-470.com");
        await page.screenshot({ path: "./public/screenshot.png" });
        await browser.close();
    });

// Step Three- Store chat button code in var and inject into webpage

// Step Four- Render the complete injected code