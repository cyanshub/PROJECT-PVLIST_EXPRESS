// 設定連接埠
const port = 3000;

// 載入express框架
const express = require("express");
const app = express();

// 載入樣板引擎
const exphbs = require("express-handlebars");

// 在express框架中使用各種方法進行設定
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(express.static("public"));


// 載入外部檔案: data.json
const data_json = require("./public/data.json");
const fields = data_json.fields;


// 實作頁碼功能
// 定義一頁顯示幾張圖卡
const cards_per_page = 12;
console.log(`定義一頁顯示幾張圖卡:${cards_per_page}`);


// 處理陣列資料, data = 要處理的資料; page = 顯示的頁碼;
function getItemsByPage (data, page){
  const startIndex = (page - 1) * cards_per_page;
  const endIndex = page * cards_per_page;
  return data.slice(startIndex, endIndex); // .slice方法結尾不會參與作用
}


// 動態渲染網站頁數功能, amount = 圖卡數量; cards_per_page = 每頁顯示幾張圖卡
function renderPaginator(amount) {
  // 用圖卡數量決定網站頁數
  const numberOfPages = Math.ceil(amount / cards_per_page);
  console.log(`網站頁數:${numberOfPages}`);

  // 產生指定長度的空陣列
  let pages = Array(numberOfPages);
  for (let i = 0; i < numberOfPages; i++) {
    pages[i] = i + 1;
  }
  console.log(`動態產生網站頁數陣列:${pages}`);
  return pages; // 回傳頁碼器陣列
}


// 呼叫函式: 產生所需要的變數
// 動態取得對應資料的網站頁數
const pages = renderPaginator(fields.length);

// 在有page將資料進行分段的概念後，預設顯示第一段的陣列資料 
let page = 1;
let fields_page = getItemsByPage(fields, page); // 顯示對應頁碼圖卡




// 使用.get方法設定首頁讀取路徑與渲染頁面
// 首頁
app.get("/", (req,res)=>{
  console.log("載入案場資料的第一筆:",fields[0]);

  // 預設顯示第1頁 
  res.render("index", { fields: fields_page, pages: pages})
})


// 監聽點選的頁碼顯示相對應的圖卡: 應用動態路由功能
app.get("/page=:page", (req,res)=>{
  
  // 應用頁碼功能顯示對應頁碼圖卡
  page = Number(req.params.page);
  fields_page = getItemsByPage(fields, page);
  res.render("index", { fields: fields_page, pages: pages })
})


// 分頁
app.get("/fields/:field_id", (req, res)=>{
  const field_id = Number(req.params.field_id);
  console.log("點選的電影 id:", field_id);

  // 利用 .find 陣列方法處理電影資料, 找出對應點選id的電影
  const field_find = fields.find(field => field.id === field_id);

  res.render("show", {field:field_find})
})


// 搜尋
app.get("/search", (req,res)=>{
  const keyword = req.query.keyword;
  console.log("擷取輸入的關鍵字:",keyword);

  // 利用 .filter 陣列方法處理電影資料, 找出對應點選id的電影
  let fields_filter = fields.filter(field => 
    field.title.toLowerCase().includes(keyword.toLowerCase())||
    field.location.toLowerCase().includes(keyword.toLowerCase()));

  let pages_filter = [];


  // 追加檢查: if 搜尋表單的輸入值為空白,渲染搜尋前的變數
  if (!keyword.length) {
    fields_filter = fields_page;
    pages_filter = pages;
  }

  // 追加檢查: if 搜尋表單沒有結果
  if (fields_filter.length === 0) {
    console.log(`無法找到含關鍵字${keyword}的項目`);
  }
  
  res.render("index", {fields:fields_filter,keyword:keyword,pages:pages_filter});
})


// 啟動並監聽伺服器
app.listen(port,()=>{
  console.log(`Express is running on http:localhost:${port}`);
})









