// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('autoLoginToggle');
    const userDisplay = document.getElementById('currentAccount');
    const manageSection = document.getElementById('manageSection');
    const statusDiv = document.getElementById('status');
    const userInput = document.getElementById('username');
    const passInput = document.getElementById('password');

    // 1. 初始化：讀取目前狀態
    chrome.storage.sync.get(['moodleUser', 'isAutoLogin'], (result) => {
        // 設定開關狀態 (預設為 true，若從未設定過則視為開啟)
        toggle.checked = (result.isAutoLogin !== false);

        // 如果有存過帳號，顯示管理區塊
        if (result.moodleUser) {
            manageSection.classList.remove('hidden');
            userDisplay.innerText = `目前帳號：${result.moodleUser}`;
        }
    });

    // 2. 監聽開關變動
    toggle.addEventListener('change', () => {
        const isEnabled = toggle.checked;
        chrome.storage.sync.set({ isAutoLogin: isEnabled }, () => {
            showStatus(isEnabled ? "自動登入已開啟" : "自動登入已關閉", "black");
        });
    });

    // 3. 儲存按鈕
    document.getElementById('saveBtn').addEventListener('click', () => {
        const user = userInput.value;
        const pass = passInput.value;

        if (!user || !pass) {
            showStatus("請輸入完整資訊", "red");
            return;
        }

        // 預設儲存時也會把開關打開
        chrome.storage.sync.set({ 
            moodleUser: user, 
            moodlePass: pass,
            isAutoLogin: true 
        }, () => {
            showStatus("儲存成功！", "green");
            // 更新介面
            manageSection.classList.remove('hidden');
            userDisplay.innerText = `目前帳號：${user}`;
            toggle.checked = true;
            // 清空輸入框保護隱私
            passInput.value = ''; 
        });
    });

    // 4. 刪除按鈕
    document.getElementById('deleteBtn').addEventListener('click', () => {
        if(confirm("確定要刪除已儲存的帳號密碼嗎？")) {
            chrome.storage.sync.remove(['moodleUser', 'moodlePass'], () => {
                showStatus("憑證已刪除", "red");
                manageSection.classList.add('hidden');
                userDisplay.innerText = "";
                userInput.value = "";
                passInput.value = "";
            });
        }
    });

    function showStatus(msg, color) {
        statusDiv.innerText = msg;
        statusDiv.style.color = color;
        setTimeout(() => { statusDiv.innerText = ''; }, 2000);
    }
});