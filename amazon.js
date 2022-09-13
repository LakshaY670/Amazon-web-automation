//node amazon.js --dest=info.json --config=config.json --url="https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3Fref_%3Dnav_ya_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&" 
//npm init -y
//npm install minimist
//npm install puppeteer
//write your user id and password in config.json

let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");

let args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config, "utf-8");
let config = JSON.parse(configJSON);

async function run() {
    let browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    
    let page = await browser.pages();
    await page[0].goto(args.url);
    
    await page[0].waitForSelector("div.a-row.a-spacing-base > input.a-input-text.a-span12.auth-autofocus.auth-required-field");
    await page[0].type("div.a-row.a-spacing-base > input.a-input-text.a-span12.auth-autofocus.auth-required-field", config.userid, { delay: 10 });
    
    await page[0].waitForSelector("span.a-button-inner>input.a-button-input");
    await page[0].click("span.a-button-inner>input.a-button-input");

    await page[0].waitForSelector("input.a-input-text.a-span12.auth-autofocus.auth-required-field", config.password, { delay: 10 });
    await page[0].type("input.a-input-text.a-span12.auth-autofocus.auth-required-field", config.password, { delay: 10 });

    await page[0].waitForSelector("#signInSubmit");
    await page[0].click("#signInSubmit");
    
    await page[0].waitForSelector("#twotabsearchtextbox");
    await page[0].click("#twotabsearchtextbox");

    await page[0].waitForSelector("#twotabsearchtextbox");
    await page[0].type("#twotabsearchtextbox", config.search, { delay: 10 });

    await page[0].waitForSelector("#nav-search-submit-button");
    await page[0].click("#nav-search-submit-button");


    await page[0].waitForSelector(".a-size-medium.a-color-base.a-text-normal");
    let nameArray = await page[0].$$(".a-size-medium.a-color-base.a-text-normal", { delay: 100 });

    await page[0].waitForSelector(".a-price-whole");
    let priceArray = await page[0].$$(".a-price-whole", { delay: 100 });

    await page[0].waitForSelector("span.a-text-bold");
    let datesArray = await page[0].$$("span.a-text-bold", { delay: 100 });
    
    let arr = [];
    for (let i = 0; i < nameArray.length; i++) {
        let name = await page[0].evaluate(function (element) { return element.textContent }, nameArray[i]);
        let price = await page[0].evaluate(function (element) { return element.textContent }, priceArray[i]);
        let dates = await page[0].evaluate(function (element) { return element.textContent }, datesArray[i]);
        let obj = {
            name,
            price,
            dates
        }
        arr.push(obj);
        console.log(obj);
    }

    let json = JSON.stringify(arr);
    fs.writeFileSync(args.dest, json, "utf-8");

    browser.close();


}
run();




