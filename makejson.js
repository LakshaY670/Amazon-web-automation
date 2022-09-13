//node makejson.js --source=download.html
//npm install jsdom
let minimist=require("minimist");
let fs=require("fs");
let jsdom=require("jsdom");

let args= minimist(process.argv);
fs.readFile(args.source,"utf-8",function(err,html){
    
    let dom=new jsdom.JSDOM(html);
    let document =dom.window.document;
})