document.getElementById('saveBtn').addEventListener('click', () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (!user || !pass) {
    document.getElementById('status').innerText = "請輸入完整資訊";
    document.getElementById('status').style.color = "red";
    return;
  }

  // 使用 sync storage，這會跟隨你的 Google 帳號
  chrome.storage.sync.set({ moodleUser: user, moodlePass: pass }, () => {
    document.getElementById('status').innerText = "已安全儲存！下次進入 Moodle 將自動登入。";
    document.getElementById('status').style.color = "green";
    
    // 清空輸入框以防背後窺視
    document.getElementById('password').value = '';
  });
});