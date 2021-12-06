let minimist = require("minimist");
let pupp = require("puppeteer");
let fs = require("fs");
let args = minimist(process.argv);
let json = fs.readFileSync(args.config,"utf-8");
let configJson = JSON.parse(json);
let excel = require("excel4node");
// node contacts.js --url"=https://web.telegram.org/z/" --config=config.json --excel=Contacts.csv
async function run(){
    let browser = await pupp.launch({
        headless: false,
        args: [
            '--start-maximized'
        ],
        defaultViewport: null
    });

    let contacts = [];

    let pages = await browser.pages();
    let page = pages[0];

    await page.goto(args.url);
    
    await page.waitFor(20000);

    // await page.click('div');

    await page.waitForSelector('div[class="animated-menu-icon"]');
    await page.click('div[class="animated-menu-icon"]');

    await page.waitFor(10000);

    try {
        await page.waitForSelector('i[class="icon-user"]', {timeout: 5000});
        await page.click('i[class="icon-user"]');
      } catch (e) {
        if (e instanceof TimeoutError) {
            await page.waitForSelector('div[class="btn-menu-item tgico-user rp"]');
            await page.click('div[class="btn-menu-item tgico-user rp"]');
        }
      }
    let i = 1;
    
    while (true){
        let a = '#LeftColumn-main > div.Transition.zoom-fade > div.active > div > div:nth-child('+i+') > div > div.ChatInfo > div.info > div.title';
        // console.log(a);
        try{
            await page.waitForSelector(a);
            await page.click(a);
        }
        catch(error){
            break;
        }
        

        await page.waitForSelector('div[class="Transition slide-fade"]');
        await page.click('div[class="Transition slide-fade"]');

        await page.waitForSelector('#MiddleColumn > div.messages-layout > div.MiddleHeader > div.Transition.slide-fade > div > div > div > div.info > div.title > h3');
        await page.click('#MiddleColumn > div.messages-layout > div.MiddleHeader > div.Transition.slide-fade > div > div > div > div.info > div.title > h3');

        let element1 = await page.$('#MiddleColumn > div.messages-layout > div.MiddleHeader > div.Transition.slide-fade > div > div > div > div.info > div.title > h3');
        let nam = await page.evaluate(el => el.textContent, element1);

        await page.waitForSelector('#RightColumn > div.Transition.zoom-fade > div > div > div.profile-info > div.ChatExtra > div.ListItem.no-selection.has-ripple.narrow.multiline > div > div.multiline-item > span.title');
        await page.click('#RightColumn > div.Transition.zoom-fade > div > div > div.profile-info > div.ChatExtra > div.ListItem.no-selection.has-ripple.narrow.multiline > div > div.multiline-item > span.title');

        let element2 = await page.$('div.multiline-item > span.title');
        let num = await page.evaluate(el => el.textContent, element2);

        let info  = {
            name : nam,
            number : num,
        };

        // console.log(name)
        // console.log(number);
        contacts.push(info);
        i++;
        
    }
    createExcelFile(contacts);

}
function createExcelFile(info){
    let wb = new excel.Workbook();
    let sheet = wb.addWorksheet("contacts")
    sheet.cell(1,1).string("Name");
    sheet.cell(1,2).string("Number");
    for (let i=0;i<info.length;i++){
        sheet.cell(2+i,1).string(info[i].name);
        sheet.cell(2+i,2).string(info[i].number);
    }
    wb.write(args.excel);
}
run();

