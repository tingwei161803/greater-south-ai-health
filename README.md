# 大南方 AI 智慧健康展 · 資訊整理站

> 把「2026 大南方 AI 智慧健康展」的 91 家參展業者與醫療軟體／醫療 AI 解決方案，整理成一個可搜尋、可篩選、雙語、可離線瀏覽的靜態網站。

本站整理自 2026「大南方 AI 智慧健康展」官方網站的公開資料，聚焦兩件事：**逐一呈現各參展廠商的資訊**，以及**獨立的醫療軟體 / 醫療 AI 精選頁**。展覽由財團法人資訊工業策進會人工智慧研究院與大南方新矽谷推動辦公室共同辦理，2026/6/12–13 於大臺南會展中心東展區舉行，匯聚逾百家產官學研單位、120+ 項 AI 智慧健康應用。

---

## 🔗 線上版 / Live

| | |
|---|---|
| 🌐 網站 | <https://tingwei161803.github.io/greater-south-ai-health/> |

> 直接點進去就能用，無需安裝。各頁面皆有獨立網址；參展業者頁可用 `exhibitors.html#<slug>`（如 `#home-2`）深連結到特定廠商，或用 `exhibitors.html#zone=clinic` 直接套用展區篩選。

---

## ✨ 功能特色

- 🏢 **參展業者目錄** — 全 91 家廠商，依 8 大展區篩選、關鍵字搜尋，點卡片看「展出亮點」與官網連結
- 🩺 **醫療軟體 / 醫療 AI 專區** — 精選 45 項醫療相關解決方案，分成 影像檢測、臨床決策、遠距監測、智慧照護、健康數據 五大類別
- 🌏 **雙語全頁切換** — 中文 / English 一鍵切換，整頁（含廠商亮點）無殘留；搜尋同時比對中英文
- 🌗 **深色 / 淺色模式** — 手動切換，並記憶於 localStorage
- 🔍 **即時搜尋 + 分類篩選** — 輸入關鍵字立即過濾，依展區 / 醫療類別快速篩選
- 📅 **大會議程與大會資訊** — 兩日 Demo Day 議程、合作夥伴、交通方式與報名連結
- 📖 **互動學習模組** — 醫療 AI 術語速查（詞彙表）、隨堂測驗、字卡翻卡
- 🔗 **深連結** — 每家廠商與每個頁面都有專屬網址，可直接分享
- 📱 **響應式設計** — 手機、平板、桌機皆適配（375px 起無水平溢出）
- ⚡ **純靜態零依賴** — 無後端、無 build、載入快、可離線瀏覽

---

## 📂 內容結構 / 資料來源

本站內容整理自 **2026 大南方 AI 智慧健康展官方網站**（<https://greatersouth.ai-expo.org.tw/>）的公開參展資料（`exhibitors.json`），並參考下列新聞報導補充展會背景：

- TechNews 科技新報：<https://technews.tw/2026/06/12/south-ai-smart-health/>
- CIO Taiwan：<https://www.cio.com.tw/115208/>
- 中央社 CNA：<https://www.cna.com.tw/news/afe/202606120351.aspx>
- 經濟日報：<https://money.udn.com/money/story/5612/9563011>
- Business Insider Taiwan：<https://www.businessinsider.tw/article/3348>

```
greater-south-ai-health/
├── index.html          # 首頁（hero + 統計 + 展區導覽 + 醫療 AI 精選帶 + 更多）
├── exhibitors.html     # 參展業者目錄（91 家，可篩選 / 搜尋）
├── medical-ai.html     # 醫療軟體 / 醫療 AI 精選（45 項，5 大類別）
├── agenda.html         # 大會活動（議程時間軸）
├── info.html           # 大會資訊（合作夥伴 / 交通 / 報名）
├── glossary.html       # 術語速查（詞彙表）
├── quiz.html           # 隨堂測驗
├── flashcards.html     # 字卡 / 翻卡
├── assets/
│   ├── styles.css      # Material Design 3 基底（健康科技青綠色系）
│   ├── shell.js        # 共用 chrome：appbar / 跨頁導覽 / footer / dialog / 語言＋主題
│   ├── app.js          # 版型引擎：依每頁 layout 渲染
│   └── logos/          # 各廠商 Logo
├── data/
│   └── data.js         # 唯一資料檔（window.SITE_META + window.SITE_PAGES，雙語 {en,zh}）
└── .nojekyll
```

> ⚠️ **非官方**：本網站為個人整理之非官方資源，內容整理自上述官方來源，
> 如有錯誤或出入，請以官方網站為準。Logo 與廠商資訊著作權歸各公司所有。

---

## 🛠 本機使用

```bash
# 1. clone 專案
git clone https://github.com/tingwei161803/greater-south-ai-health.git
cd greater-south-ai-health

# 2. 啟動本機伺服器（建議，跨頁連結 / 深連結才正常）
uv run python -m http.server 4173
# 然後瀏覽 http://localhost:4173
```

> 本專案為純靜態網站，不需安裝任何依賴。若要跑本機伺服器，一律使用 `uv`。

---

## 📊 流量分析

本站使用 Google Analytics 4（GA4 property：**2026 大南方 AI 智慧健康展**）蒐集匿名瀏覽流量數據，以了解使用情形。若您在意隱私，可透過瀏覽器擴充套件或設定阻擋分析追蹤。

---

## 📝 聲明 / License

- 本站為非官方整理，內容著作權歸原始來源（大南方 AI 智慧健康展官方與各參展公司）所有。
- 程式碼以 MIT 授權釋出。
- 如為權利人且希望調整或移除內容，請開 issue 聯絡。
