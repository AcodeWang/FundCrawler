
const koa = require('koa')
const cheerio = require('cheerio')
const superagent = require('superagent')

XLSX = require('xlsx')
var fs = require('fs');

const app = new koa()

app.use(async (ctx, next)=>{
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1> Hello KOA2!<h1>'
})

var workbook = XLSX.readFile('./fund.xlsx')

var today = new Date()
console.log(today)
var formatedDate =  (today.getDate()-1) + "/" + (today.getMonth() + 1) + "/" + today.getFullYear()
console.log(formatedDate)

const urls = ["501050","501029","100032","001052","001051"]
let fundObjs = [];

urls.forEach( fundID => {

    // url = "https://xueqiu.com/S/F" + fundID
    url = "http://fund.eastmoney.com/" + fundID + ".html"
    superagent.get(url).end(function (err, res) {
        // 抛错拦截
         if(err){
             throw Error(err);
         }
        // 等待 code
    });

    superagent.get(url).end(function (err, res) {
        // 抛错拦截
       if(err){
           throw Error(err);
       }
       /**
       * res.text 包含未解析前的响应内容
       * 我们通过cheerio的load方法解析整个文档，就是html页面所有内容，可以通过console.log($.html());在控制台查看
       */

       var $ = cheerio.load(res.text);

       // console.log($)

       // $('#app .stock-current').each(function (index, element) {
       $('#body .dataItem02').each(function (index, element) {
         var temp = $(element).find('.dataNums').text().split('-')[0]
         console.log(fundID)
         console.log(temp)

         fundObjs.push({
           id : fundID,
           date: formatedDate,
           price : temp
         })

         var fundObj = {
           date: formatedDate,
           price : temp
         }

         // console.log(fundObj);
         objectToXLSX(fundID, fundObj);
       });

       XLSX.writeFile(workbook, 'out.xlsx');
       console.log('--------')
    });
})

function objectToXLSX(fundID, fund){

  var worksheet = workbook.Sheets[fundID]

  XLSX.utils.sheet_add_json(worksheet, [fund], {header:["date","price"],origin:-1, skipHeader : true})

  var todayPrice = worksheet['B1']
  todayPrice.v = fund.price

  console.log(fund);
  console.log("ok");
}

// objectToXLSX("100032", {"date":formatedDate, "price": "1,11"})
// XLSX.writeFile(workbook, 'out.xlsx');

app.listen(3000)
console.log('start port 3000')
