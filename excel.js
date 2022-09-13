//node excel.js --source=info.json --dest=deatails.csv
//npm install minimist
//npm install excel4node
//npm init -y
let minimist = require("minimist");
let fs = require("fs");
let excel = require("excel4node");
const { setUncaughtExceptionCaptureCallback, setegid } = require("process");
let args = minimist(process.argv);
let deatilsJSON = fs.readFileSync(args.source, "utf-8");
let deatils = JSON.parse(deatilsJSON);

let wb = new excel.Workbook();

let st=wb.createStyle({
    font: {
        bold: true,
        underline: true,
        size: 12,
        color: "white"
     },
    fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#889EAF"
    }
});
let srt=wb.createStyle({
    font: {
        bold: true,
        underline: false,
        size: 12,
        color: "black"
     },
    fill: {
        type: "pattern",
        patternType: "solid",
        fgColor: "#F3F0D7"
    }
});


for(let i=0; i<deatils.length ; i++){
    let sheet =wb.addWorksheet(deatils[i].name);
    sheet.cell(1,1).string("Product searched").style(st);
    sheet.cell(1,2).string("Price").style(st);
    sheet.cell(1,3).string("Expected delivery").style(st);
    sheet.cell(2,1).string(deatils[i].name).style(srt);
    sheet.cell(2,2).string(deatils[i].price).style(srt);
    sheet.cell(2,3).string(deatils[i].dates).style(srt);
    
}
wb.write(args.dest);
