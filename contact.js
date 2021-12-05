let minimist = require("minimist")
let axios = require("axios")
let excel = require("excel4node")
let jsdom = require("jsdom")

// node Contact.js --url=https://web.telegram.org/ --excel=contact.csv
let args = minimist(process.argv);

let htmlcode = axios.get(args.url);
htmlcode.then(function(response){
    let html = response.data;
    console.log(html);
    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;

    let contactdivs = document.querySelectorAll("div.profile-name");
    contactInfo = {
        name : "",
        number : ""
    }
    console.log(contactdivs.length);
    // for (let i=0;i<contactdivs.length;i++){
    //     contactInfo.name = contactdivs.querySelector("div.profile-name > span.peer-title");
    //     console.log(contactInfo.name.textContent);
    // }
})

