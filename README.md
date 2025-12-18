# NTUST Moodle Auto Login (臺科大 Moodle 自動登入助手)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome](https://img.shields.io/badge/Chrome-Manifest_V3-green.svg)
![Target](https://img.shields.io/badge/Target-NTUST_Moodle-orange.svg)

專為 **國立臺灣科技大學 (NTUST)** 學生開發的 Chrome 瀏覽器擴充功能。
解決每次開啟 Moodle 都需要手動點擊登入、跳轉 SSO 系統並重複輸入帳號密碼的繁瑣流程。

## ✨ 主要功能 (Features)

* **🚀 全自動流程**：
    * 偵測 Moodle 首頁未登入狀態，自動點擊登入按鈕。
    * 跳轉至學校 SSO 系統後，自動填入學號與密碼並送出。
* **🧠 智慧偵測 (Smart Loading)**：
    * 使用 `MutationObserver` 監聽網頁，而非固定的倒數計時。
    * 解決學校 SSO 頁面因動態載入或二次刷新導致的「找不到按鈕」或「填寫失敗」問題。
* **☁️ 雲端同步 (Google Sync)**：
    * 利用 `chrome.storage.sync` 技術。
    * 在不同電腦登入同一個 Google 帳號時，可同步你的設定（需安裝相同擴充功能）。
* **🔒 安全隱私**：
    * 密碼僅加密儲存在你的 Google 帳號雲端空間。
    * **絕無**傳送資料至任何第三方伺服器。
* **⚙️ 彈性控制**：
    * 提供圖形化介面 (Popup) 管理憑證。
    * 內建「自動登入開關」，隨時可暫停自動填寫功能。
    * 支援一鍵刪除已儲存的憑證。

## 🛠️ 安裝教學 (Installation)

由於本專案尚未上架至 Chrome 線上應用程式商店，請使用**開發人員模式**安裝：

1.  **下載程式碼**：將本專案下載至電腦並解壓縮（或 `git clone`）。
2.  **開啟擴充功能管理頁面**：
    * 在 Chrome 網址列輸入 `chrome://extensions/` 並前往。
3.  **開啟開發模式**：
    * 點擊頁面右上角的 **「開發人員模式」 (Developer mode)** 開關使其變為藍色。
4.  **載入擴充功能**：
    * 點擊左上角的 **「載入未封裝項目」 (Load unpacked)**。
    * 選擇本專案的資料夾。
5.  **完成**：
    * 你應該會看到「Moodle 自動登入助手」出現在列表上。

## 📖 使用說明 (Usage)

1.  點擊瀏覽器右上角的拼圖圖示，將本插件釘選。
2.  點擊插件圖示，開啟設定視窗。
3.  輸入你的 **學號** 與 **密碼**，點擊「儲存 / 更新」。
4.  前往 [NTUST Moodle](https://moodle.ntust.edu.tw/)。
5.  插件將自動接管登入流程，請欣賞自動跳轉的過程！☕️

## 🔒 安全性聲明 (Security)

* 本插件使用 Chrome 官方的 `chrome.storage.sync` API 儲存資料。
* 你的密碼是跟隨你的 Google 帳號進行同步，開發者無法查看你的密碼。
* 建議定期更換學校密碼以保安全。

## 📂 專案結構 (Project Structure)

```text
moodle-auto-login/
├── manifest.json   # 插件設定檔 (權限與路徑設定)
├── popup.html      # 設定視窗介面 (HTML)
├── popup.js        # 設定視窗邏輯 (儲存/刪除/開關)
├── content.js      # 核心腳本 (智慧偵測與自動登入邏輯)
├── icons/          # (選用) 插件圖示
└── README.md       # 說明文件