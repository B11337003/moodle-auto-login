// content.js

chrome.storage.sync.get(['moodleUser', 'moodlePass', 'isAutoLogin'], async (result) => {
    // 1. 檢查基本條件
    if (result.isAutoLogin === false) return;
    if (!result.moodleUser || !result.moodlePass) return;

    const currentUrl = window.location.href;

    // ---------------------------------------------------------
    // 情況 1：在學校 SSO 登入頁面
    // ---------------------------------------------------------
    // 這裡我們不再用 if 檢查，而是用 waitForElm 等待元素出現
    if (currentUrl.includes("sso") || currentUrl.includes("account/login") || document.getElementById('Username')) {
        console.log("Moodle Helper: 進入 SSO 區域，正在等待欄位載入...");
        
        try {
            // 等待 #Username 元素真正出現
            const usernameInput = await waitForElm('#Username');
            const passwordInput = await waitForElm('#Password');
            const loginBtn = await waitForElm('#loginButton');

            console.log("Moodle Helper: 欄位已載入，開始填寫");
            
            // 為了防止網頁剛載入完瞬間又重整 (造成"not connected"錯誤)
            // 這裡保留一個極短的緩衝，確認它穩定了
            setTimeout(() => {
                fillAndSubmit(usernameInput, passwordInput, loginBtn, result.moodleUser, result.moodlePass);
            }, 300); // 300ms 緩衝通常已足夠，比寫死 2秒 聰明得多

        } catch (error) {
            console.log("Moodle Helper: 等待欄位逾時或失敗", error);
        }
    }

    // ---------------------------------------------------------
    // 情況 2：在 Moodle 首頁
    // ---------------------------------------------------------
    else if (currentUrl.includes("moodle") && !document.body.innerText.includes(result.moodleUser)) {
        // 同樣可以用 waitForElm 等待登入連結出現
        waitForElm('a[href*="login"]').then(link => {
             link.click();
        });
    }
});


// 核心功能：填寫並送出
function fillAndSubmit(uInput, pInput, btn, user, pass) {
    // 再次檢查元素是否還活著 (防呆)
    if (!document.body.contains(uInput)) {
        console.log("Moodle Helper: 元素失效，重新抓取...");
        uInput = document.getElementById('Username');
        pInput = document.getElementById('Password');
        btn = document.getElementById('loginButton');
    }

    if (uInput && pInput && btn) {
        uInput.value = user;
        uInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        pInput.value = pass;
        pInput.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => {
            btn.click();
        }, 200);
    }
}


// 工具函式：智慧等待元素出現 (不用死背，這是標準寫法)
function waitForElm(selector) {
    return new Promise(resolve => {
        // A. 如果元素已經在畫面上，直接回傳
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        // B. 如果還沒出現，就開啟 MutationObserver 監聽
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect(); // 找到了就停止監聽，節省效能
            }
        });

        // 開始監視 document.body 的變化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}