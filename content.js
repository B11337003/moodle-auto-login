// content.js

// 從 Google 同步空間讀取帳號密碼
chrome.storage.sync.get(['moodleUser', 'moodlePass'], (result) => {
    // 如果沒存密碼，就什麼都不做
    if (!result.moodleUser || !result.moodlePass) return;

    const currentUrl = window.location.href;
    console.log("Moodle Helper: 目前網址 ->", currentUrl);

    // ---------------------------------------------------------
    // 情況 1：在學校 SSO 登入頁面 (根據你提供的 HTML)
    // ---------------------------------------------------------
    const usernameField = document.getElementById('Username');
    const passwordField = document.getElementById('Password');
    const loginBtn = document.getElementById('loginButton');

    // 如果這三個元素同時存在，代表我們正在 SSO 登入頁面
    if (usernameField && passwordField && loginBtn) {
        console.log("Moodle Helper: 偵測到 SSO 登入欄位，開始填寫...");
        fillAndSubmitSSO(usernameField, passwordField, loginBtn, result.moodleUser, result.moodlePass);
    } 
    
    // ---------------------------------------------------------
    // 情況 2：在 Moodle 首頁 (尚未按登入)
    // ---------------------------------------------------------
    // 判斷邏輯：網址有 moodle 且 網頁內容還沒有顯示學號(代表未登入)
    else if (currentUrl.includes("moodle") && !document.body.innerText.includes(result.moodleUser)) {
        // 嘗試抓取 Moodle 常見的登入連結 (通常 href 裡面會有 'login')
        const moodleLoginLink = document.querySelector('a[href*="login"]');
        
        if (moodleLoginLink) {
            console.log("Moodle Helper: 偵測到 Moodle 首頁尚未登入，準備跳轉...");
            // 延遲一點點再點，避免網頁還沒載入完
            setTimeout(() => {
                moodleLoginLink.click();
            }, 500);
        }
    }
});

// 專門處理 SSO 填寫與送出的函式
function fillAndSubmitSSO(uField, pField, btn, user, pass) {
    // 1. 填入帳號
    uField.value = user;
    uField.dispatchEvent(new Event('input', { bubbles: true })); // 模擬打字事件

    // 2. 填入密碼
    pField.value = pass;
    pField.dispatchEvent(new Event('input', { bubbles: true })); // 模擬打字事件

    // 3. 稍微等待後點擊登入 (給網頁一點時間檢查欄位)
    setTimeout(() => {
        console.log("Moodle Helper: 嘗試點擊登入按鈕...");
        btn.click();
    }, 500); // 0.5 秒延遲
}