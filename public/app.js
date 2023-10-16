// 使用 import 方法導入 json 檔案
import data_json from "./data.json" assert{type:"json"};
const movies = data_json.movies;


// 選取要進行 DOM 操作的 html 標記
const dataPanel = document.querySelector("#data-panel-movielist");
const dataPanelShow = document.querySelector("#data-panel-movielist-show");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")


// 原本 EXPRESS 專案的各項功能
// #1:首頁相片集渲染
// 設計 function
function renderMovielist(data) {
  let rawHTML = "";
  data.forEach(item => {
    rawHTML += `
            <a href="./show.html#${item.id}" class="text-secondary">
              <div class="card mb-3">
                <img src="./public/${item.image}" alt="${item.title}" class="card-img-top">
                <div class="card-body p-2">
                  <h6 class="card-title mb-1">${item.title}</h6>
                </div>
              </div>
            </a>
          `
  })

  dataPanel.innerHTML = rawHTML;
}

// 觸發 function
if (!dataPanel) { } else { renderMovielist(movies); }

//===================分隔線===================

// #2:首頁動態頁碼
// 定義變數
const cards_per_page = 12; // 定義一頁顯示幾張圖卡
let page; // 對應電影清單的頁碼
let movies_page; // 對應頁碼的圖卡

// 設計 function
// function 1:動態渲染網站頁數功能, amount = 圖卡數量; cards_per_page = 每頁顯示幾張圖卡
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
  // return pages; // 回傳頁碼器陣列

  // 擴充原express 專案 function
  let rawHTML = ''
  pages.forEach(item => {
    rawHTML += `
  <li class="page-item">
      <a class="page-link" href="#page=${item}" data-page="${item}">${item}</a>
    </li>
  `
  })
  paginator.innerHTML = rawHTML;
}


// function 2:處理陣列資料, data = 要處理的資料; page = 顯示的頁碼;
function getItemsByPage(data, page) {
  const startIndex = (page - 1) * cards_per_page;
  const endIndex = page * cards_per_page;
  return data.slice(startIndex, endIndex); // .slice方法結尾不會參與作用
}


// function 3:功能:監聽點選的頁碼顯示相對應的圖卡
if (!paginator) { } else {
  // 獲取點擊頁碼: 利用dataset獲取資料 => 對應動態路由功能
  paginator.addEventListener("click", function onPaginatorClicked(event){
    page = Number(event.target.dataset.page);
    console.log(`點擊的頁碼:${page}`);
    movies_page = getItemsByPage(movies, page); // 顯示對應頁碼圖卡
    renderMovielist(movies_page);
  })
}

// 觸發 function
if (!paginator) { } else {
  page = 1; // 預設顯示第一頁的電影清單
  renderPaginator(movies.length); // 動態取得對應資料的網站頁數
  movies_page = getItemsByPage(movies, page); // 顯示對應頁碼圖卡
  renderMovielist(movies_page);
}

//===================分隔線===================

// #3:首頁搜尋功能
// 定義變數
// 設計 function
// function: 監聽搜尋關鍵字篩選及重新渲染頁面
if (!searchForm) { } else {
  searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
    // 防止submit事件導致瀏覽器預設行為之重整頁面
    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();


    // 追加檢查功能: if搜尋表單的輸入值空白，則呼叫函式渲染搜尋前的變數
    if (!keyword.length) {
      renderPaginator(movies.length); // 動態取得對應資料的網站頁數
      renderMovielist(movies_page); // 渲染搜尋前的電影
      return alert("請輸入要搜尋的電影名稱或年份 EX: 2017")
    }


    // 應用 .filter 陣列方法處理資料, 篩選出符合條件的圖卡
    const movies_filter = movies.filter(movie=>
      movie.title.toLowerCase().includes(keyword.toLowerCase())||
      movie.release_date.toLowerCase().includes(keyword.toLowerCase()));


    // 追加檢查功能: if依輸入值無法找到結果，則設計跳出提示提醒使用者及停止函式
    if (movies_filter.length===0){
      return alert(`資料庫無法找到包含關鍵字 ${keyword} 的電影`);
    }


    // 呼叫函式渲染搜尋後的變數
    renderPaginator([].length); // 動態取得對應資料的網站頁數: 不要顯示頁碼
    renderMovielist(movies_filter); // 渲染搜尋前的電影
  })
}

// 觸發 function

//===================分隔線===================

// #4:分頁渲染
// 定義變數
let movie_id; // 瀏覽器視窗擷取的電影id
let movie_find; // 要在分頁顯示的電影


// 設計 function
function showMovielist(item){
  let rawHTML = "";
  rawHTML += `
    <h1 class="mb-1 movie-show-title">${item.title}</h1>
    <div class="container">
      <div class="col col-md-10 mx-auto">
        <div class="row card-introduction">    
          <div class="card-introduction-description">
            <p class="mb-3">Released date: ${item.release_date}</p>
            <p class="mb-5">${item.description}</p>
          </div>
          <div class="card-introduction-image">
            <img src="./public/${item.image}" alt="${item.title}" class="rounded mb-5 w-100 d-block mx-auto" style="max-width: 600px;">
          </div>
        </div>
      </div>
    </div>
  `
  dataPanelShow.innerHTML = rawHTML;
}

// 觸發 function
// 利用瀏覽器視窗路由擷取功能 => 對應動態路由功能
movie_id = Number(window.location.hash.substring(1));

// 應用 .find 陣列方法處理資料, 找出符合條件的圖卡
movie_find = movies.find(movie => movie.id === movie_id);

if (!dataPanelShow) { } else { showMovielist(movie_find) }








