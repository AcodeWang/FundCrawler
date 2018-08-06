
const koa = require('koa')
const cheerio = require('cheerio')
const superagent = require('superagent')

XLSX = require('xlsx')
var fs = require('fs');

const app = new koa()

const urls = ["501050","501029","100032","001052","001051"]


app.use(async (ctx, next)=>{
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1> Hello KOA2!<h1>'
})

let data = [];

urls.forEach( fundID => {

    url = "https://xueqiu.com/S/F" + fundID
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

       var items = [];
       $('#app .stock-current').each(function (index, element) {

         var temp = $(element).text()
         // console.log(fundID)
         // console.log(temp)
         data.push({
           id : fundID,
           price : temp
         })

         if(data.length == urls.length){
           console.log(data)
           objectToXLSX(data)
         }
       });

       console.log('--------')
    });
})

function objectToXLSX(json){
  var workbook = XLSX.readFile('./out.xlsx')

  var first_sheet_name = workbook.SheetNames[0]

  var worksheet = workbook.Sheets[first_sheet_name]

  var range = XLSX.utils.decode_range(worksheet['!ref']);
  var num_rows = range.e.r - range.s.r + 1
  var num_cols = range.e.r - range.s.r + 1

  console.log("cols : " + num_cols)
  console.log("rows : " + num_rows)

  var newSheetName = "newSheetName"

  // XLSX.utils.sheet_add_json(worksheet, json, {skipHeader: false, origin: -1});

  XLSX.writeFile(workbook, 'out.xlsx');
}

app.listen(3000)
console.log('start port 3000')
