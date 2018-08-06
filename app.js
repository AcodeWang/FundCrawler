
const koa = require('koa')
const cheerio = require('cheerio')
const superagent = require('superagent')

const app = new koa()

const url = "https://xueqiu.com/S/F100029"


app.use(async (ctx, next)=>{
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1> Hello KOA2!<h1>'
})

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

     console.log(temp)
   });

   console.log('end')
});


app.listen(3000)
console.log('start port 3000')
