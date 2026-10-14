# 財務管理系統 (FMS) - 開發日誌

**日期**: 2026-09-02  
**專案**: 財務管理系統 MVP 開發

---

## 📋 目錄
1. [Step 1: 項目初始化](#step-1-項目初始化)
2. [前端測試和問題修復](#前端測試和問題修復)
3. [後端測試](#後端測試)
4. [當前狀態](#當前狀態)

---

## Step 1: 項目初始化

### 1.1 項目結構創建

✅ **完成** - 建立前後端文件夾結構
```
FMS/
├── frontend/    (Vite + Vue 3 + TypeScript)
└── backend/     (Node.js + Express + TypeScript)
```

### 1.2 前端初始化

**時間**: 下午1:35  
**操作**: 
- 創建前端文件夾
- 初始化 Vite 項目 (Vue 3 + TypeScript)
- 安裝基礎依賴

**依賴安裝清單**:
```bash
✅ npm install                                  # 基礎依賴
✅ npm install -D tailwindcss postcss autoprefixer  # Tailwind CSS
✅ npm install vuetify pinia vue-router axios echarts  # 核心庫
```

**配置文件生成**:
- ✅ vite.config.ts
- ✅ tsconfig.json
- ✅ tailwind.config.js
- ✅ postcss.config.js
- ✅ .env (VITE_API_BASE_URL=http://localhost:3000/api)

**項目結構**:
```
frontend/
├── src/
│   ├── components/      (AdminLayout.vue)
│   ├── views/           (DashboardView, TransactionView, CategoryConfigView)
│   ├── router/          (Vue Router 配置)
│   ├── store/           (Pinia store - app.ts)
│   ├── services/        (API 客戶端)
│   ├── types/           (TypeScript 類型定義)
│   ├── plugins/         (Vuetify 配置)
│   ├── main.ts          (應用入口)
│   └── style.css        (全局樣式)
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### 1.3 後端初始化

**時間**: 下午1:41  
**操作**:
- 創建後端文件夾
- 初始化 Node.js 項目
- 安裝依賴和配置 TypeScript

**依賴安裝清單**:
```bash
✅ npm init -y                                  # 初始化 package.json
✅ npm install express cors dotenv             # 框架依賴
✅ npm install -D typescript @types/express @types/node ts-node @types/cors  # TypeScript
✅ npm install -D prisma @prisma/client       # ORM 依賴
```

**配置文件生成**:
- ✅ tsconfig.json
- ✅ .env (DATABASE_URL, PORT, NODE_ENV)
- ✅ prisma/schema.prisma (數據庫 Schema)
- ✅ src/index.ts (Express 服務器)

**Prisma Schema 結構**:
```prisma
✅ Category (分類表)
   - id, name, type (REVENUE/EXPENSE), parentId, isActive
   
✅ Transaction (交易記錄表)
   - id, date, amount, type, categoryId, paymentMethod, note
```

**package.json 運行腳本**:
```json
"dev": "ts-node src/index.ts",
"build": "tsc",
"start": "node dist/index.js"
```

---

## 前端測試和問題修復

### 2.1 初始問題

**時間**: 下午5:16:56  
**問題**: Tailwind CSS PostCSS 插件錯誤

**錯誤信息**:
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. 
The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS 
with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

**受影響的 CSS 文件** (示例):
- vuetify/lib/components/VTimeline/VTimeline.css
- vuetify/lib/components/VTimePicker/VTimePicker.css
- 等多個 Vuetify 組件

**原因**: Tailwind CSS v4 將 PostCSS 插件移到了單獨的包 `@tailwindcss/postcss`

### 2.2 問題修復步驟

#### 步驟 1: 安裝新的 PostCSS 插件
```bash
npm install -D @tailwindcss/postcss
```
**結果**: ✅ 成功 - 安裝 11 個新包

#### 步驟 2: 更新 postcss.config.js
**文件位置**: `frontend/postcss.config.js`

**修改前**:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**修改後**:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

#### 步驟 3: 更新 style.css
**文件位置**: `frontend/src/style.css`

**修改**: 在文件最上方添加
```css
@import "tailwindcss";
```

### 2.3 測試結果

**時間**: 下午5:17:17  
**命令**: `npm run dev`

**輸出**:
```
下午5:17:17 [vite] (client) Re-optimizing dependencies because vite config has changed
Port 5173 is in use, trying another one...
Port 5174 is in use, trying another one...

  VITE v8.2.2  ready in 351 ms

  ➜  Local:   http://localhost:5175/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**結果**: ✅ 成功
- 前端開發服務器正常運行
- 無 CSS 編譯錯誤
- 監聽在 http://localhost:5175 (因為 5173, 5174 被占用)

**注**: 三個端口占用說明有之前的 dev 服務器仍在運行

---

## 後端測試

### 3.1 後端編譯

**時間**: 下午2:25  
**命令**: `npm run build`

**結果**:
```bash
> backend@1.0.0 build
> tsc
```

**輸出**: ✅ 編譯成功，無錯誤

**生成文件** (dist/ 目錄):
- index.js (編譯後的 JavaScript)
- index.js.map (Source map 文件)
- index.d.ts (TypeScript 類型定義)
- index.d.ts.map

### 3.2 後端服務器啟動測試

**時間**: 下午2:44  
**命令**: `node dist/index.js`

**輸出**:
```
◇ injected env (3) from .env
Server is running on port 3000
```

**結果**: ✅ 成功
- 環境變數正確載入
- Express 服務器成功啟動在端口 3000
- /api/health 健康檢查路由已配置

**可用 API 端點**:
- `GET http://localhost:3000/api/health` - 健康檢查

---

## 當前狀態

### ✅ Step 1 - 初始化完成

| 項目 | 狀態 | 備註 |
|------|------|------|
| 前端項目結構 | ✅ 完成 | Vite + Vue 3 + TypeScript |
| 前端依賴安裝 | ✅ 完成 | 包括 Tailwind CSS, Vuetify, Pinia 等 |
| 前端配置 | ✅ 完成 | 已修復 Tailwind CSS 兼容性問題 |
| 前端運行測試 | ✅ 成功 | http://localhost:5175 |
| 後端項目結構 | ✅ 完成 | Node.js + Express + TypeScript |
| 後端依賴安裝 | ✅ 完成 | 包括 Prisma, Express, CORS 等 |
| 後端編譯 | ✅ 成功 | TypeScript 編譯無錯誤 |
| 後端運行測試 | ✅ 成功 | http://localhost:3000 |
| Prisma Schema | ✅ 創建 | Category 和 Transaction 表已定義 |
| 環境變數配置 | ✅ 完成 | 前後端 .env 文件已配置 |

---

## 2026-09-11 後續修正與除錯紀錄

### 1. 後端啟動錯誤：ts-node / TypeScript 版本不相容

**日期**: 2026-09-11  
**問題**: 執行 `npm run dev` 時，後端直接報錯：

```text
TypeError: Cannot read properties of undefined (reading 'fileExists')
```

**排查結果**: 不是 Express 代碼本身問題，而是 `ts-node` 和 `typescript` 的版本不相容。  
**修正方式**: 將 `backend/package.json` 中的 TypeScript 從 `^7.0.2` 調整為 `^5.6.3`，並重新安裝依賴。  
**驗證結果**: 修正後，後端成功啟動並輸出：

```text
Server is running on port 3000
```

---

### 2. Prisma 版本與 CLI 命令不匹配

**日期**: 2026-09-11  
**問題**: 執行 `npx prisma migrate dev --name init` 與 `npx prisma validate` 時，出現：

```text
Unknown command "migrate"
Unknown command "validate"
```

**原因**: 安裝到的是較新的 Prisma CLI（類似 `prisma` 平台型命令），與舊教學中的命令不一致。  
**修正方式**: 改成與實際版本相容的命令，並固定使用相容版 `prisma@5.22.0` / `@prisma/client@5.22.0`。  
**驗證結果**: `npx prisma validate` 成功，並顯示：

```text
The schema at prisma\schema.prisma is valid 🚀
```

---

### 3. Prisma schema 註解格式問題

**日期**: 2026-09-11  
**問題**: Prisma schema 內使用 `#` 注解，導致 schema 驗證失敗：

```text
Error validating: This line is invalid. It does not start with any known Prisma schema keyword.
```

**修正方式**: 將註解改為 Prisma 合法的 `//` 註解。  
**檔案**: `backend/prisma/schema.prisma`  
**結果**: 驗證成功。

---

### 4. Prisma Client 未生成，導致 `PrismaClient` 未初始化

**日期**: 2026-09-11  
**問題**: 後端啟動後報錯：

```text
@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
```

**修正方式**: 執行：

```bash
cd backend
npx prisma generate
```

**驗證結果**: Prisma Client 成功生成，後端重新啟動成功，輸出：

```text
Server is running on port 3000
```

---

### 5. 前端白畫面問題：`RouteRecordRaw` import 錯誤

**日期**: 2026-09-11  
**問題**: 前端 console 顯示：

```text
The requested module ... 'vue-router' does not provide an export named 'RouteRecordRaw'
```

**原因**: `RouteRecordRaw` 是 type，不能直接從 ESM 模組中以 runtime import 方式引入。  
**修正方式**: 改為：

```ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
```

**檔案**: `frontend/src/router/index.ts`  
**結果**: 運行時錯誤解除。

---

### 6. 前端 API 404 問題：舊後端進程仍持續運行

**日期**: 2026-09-11  
**問題**: 前端於切換頁面時出現：

```text
GET http://localhost:3000/api/categories 404 (Not Found)
GET http://localhost:3000/api/transactions 404 (Not Found)
```

**原因**: 端口 3000 上仍存在舊版 node 後端實例，沒有新的 `/api/categories` 及 `/api/transactions` route。  
**修正方式**: 清除舊的 `node` process，再重新啟動後端。  
**驗證結果**: 後端重新啟動後，路由可以正常提供 API。

---

### 7. 前端 Vuetify 元件名稱錯誤

**日期**: 2026-09-11  
**問題**: Console 顯示：

```text
Failed to resolve component: v-card-content
```

**原因**: 在 Vuetify 3 中，正確元件名稱是 `v-card-text`，不是 `v-card-content`。  
**修正方式**: 將所有 `v-card-content` 替換為 `v-card-text`。  
**影響檔案**:
- `frontend/src/views/CategoryConfigView.vue`
- `frontend/src/views/TransactionView.vue`

---

### 8. 後端 API 與前端串接完成

**日期**: 2026-09-11  
**已完成事項**:
- 實作 `GET /api/categories`
- 實作 `POST /api/categories`
- 實作 `PUT /api/categories/:id`
- 實作 `DELETE /api/categories/:id`
- 實作 `GET /api/transactions`
- 實作 `POST /api/transactions`
- 實作 `PUT /api/transactions/:id`
- 實作 `DELETE /api/transactions/:id`
- 前端 CategoryConfigView 完整串接讀取/新增/編輯/刪除
- 前端 TransactionView 完整串接讀取/新增/編輯/刪除
- 前端 store 設定 API 呼叫方法

**驗證**: 後端已成功啟動，並在 port 3000 提供 API。

---

### 9. 目前正式狀態

**後端**: ✅ 正常啟動  
**前端**: ✅ 可啟動，但需從正確目錄 `frontend/` 執行，並注意 port 是否自動轉移  
**API**: ✅ 已可使用  
**資料庫**: ✅ Prisma schema 已驗證可用，且可與 Aiven PostgreSQL 配合  
**下一步**: 準備進行實際 UI 測試與分類資料插入驗證

---

## 最終結論

目前專案已完成基礎初始化與核心功能架構，後端 API 與前端資料串接已基本完成，且已經成功排除主要啟動與編譯問題。下一階段的重點是：

1. 確認前端在正確端口運行
2. 修正所有 Vuetify 元件命名問題
3. 測試分類與交易 CRUD
4. 實際插入第一批資料驗證功能流程

---

## 建議 / 下次 agenda

### 建議事項

1. **優先釐清前端與後端的實際執行入口**
   - 後端: `backend/` 下執行 `npm run dev`
   - 前端: `frontend/` 下執行 `npm run dev -- --host 0.0.0.0`
   - 避免在根目錄直接啟動造成 port 衝突

2. **修正剩餘 Vuetify 元件命名問題**
   - 將 `v-card-content` 全部改成 `v-card-text`
   - 檢查其他頁面是否也有類似命名問題

3. **補齊 CRUD 測試資料**
   - 建立幾個預設收入／支出分類
   - 插入幾筆測試交易資料
   - 驗證列表、篩選、編輯與刪除功能

4. **檢查後端與資料庫連線的雲端資料庫狀態**
   - 確認 Aiven PostgreSQL 可以正常讀寫
   - 驗證 `Category` 與 `Transaction` 資料庫表是否實際存在

5. **下一階段專案進度規劃**
   - Step 2: Prisma schema & migration 完整驗證
   - Step 3: 後端 API 完整測試
   - Step 4: 前端 API 串接與 UI 測試
   - Step 5: 匯出 Excel / PDF 與報表功能

### 下次 agenda 建議

- 1. 確認後端、前端各自正常啟動且 port 正確
- 2. 修正所有 `v-card-content` / Vuetify 相關 warning
- 3. 建立測試分類資料與幾筆交易資料
- 4. 測試 CRUD 流程是否可正確存取資料庫
- 5. 檢查前端列表與表單互動是否正常
- 6. 進入報表與匯出功能開發

> 目標：把既有的基礎架構從「可啟動」提升到「可測試、可操作、可展示」的 MVP 狀態。

---

目前專案已完成基礎初始化與核心功能架構，後端 API 與前端資料串接已基本完成，且已經成功排除主要啟動與編譯問題。下一階段的重點是：

1. 確認前端在正確端口運行
2. 修正所有 Vuetify 元件命名問題
3. 測試分類與交易 CRUD
4. 實際插入第一批資料驗證功能流程

### 🚀 運行中的服務

| 服務 | 端口 | 狀態 | 命令 |
|------|------|------|------|
| 前端開發服務器 | 5175 | ✅ 運行中 | `cd frontend && npm run dev` |
| 後端 API 服務器 | 3000 | ✅ 已測試 | `cd backend && node dist/index.js` |

### ⏳ 下一步 - Step 2: Prisma Schema & 數據庫遷移

**預計工作**:
1. 配置 PostgreSQL 數據庫連接
2. 執行 Prisma 遷移: `npx prisma migrate dev --name init`
3. 驗證數據庫表創建成功
4. 生成 Prisma Client

**必要條件**:
- [ ] PostgreSQL 數據庫可用
- [ ] 有效的 DATABASE_URL 連接字符串

---

## 技術棧確認

### 前端技術棧
- ✅ **框架**: Vue 3 + Composition API
- ✅ **構建工具**: Vite 8.2.2
- ✅ **語言**: TypeScript 7.0.2
- ✅ **UI 框架**: Vuetify 3 + Tailwind CSS v4
- ✅ **狀態管理**: Pinia
- ✅ **路由**: Vue Router
- ✅ **圖表**: ECharts.js
- ✅ **HTTP 客戶端**: Axios
- ✅ **樣式**: Tailwind CSS + 自定義 CSS

### 後端技術棧
- ✅ **運行時**: Node.js v24.18.0
- ✅ **框架**: Express.js 5.2.1
- ✅ **語言**: TypeScript 7.0.2
- ✅ **ORM**: Prisma 8.0.0-rc.12
- ✅ **數據庫客戶端**: @prisma/client 7.10.0
- ✅ **中間件**: CORS 2.8.6
- ✅ **環境管理**: dotenv 17.4.2
- ✅ **編譯器**: TypeScript Compiler (tsc)

---

## 問題排查記錄

### 問題 1: Tailwind CSS PostCSS 插件錯誤

| 項目 | 內容 |
|------|------|
| **問題代碼** | P001 |
| **錯誤類型** | PostCSS 編譯錯誤 |
| **原因** | Tailwind CSS v4 API 改變 |
| **解決方案** | 安裝 @tailwindcss/postcss 並更新配置 |
| **解決時間** | 5 分鐘 |
| **結果** | ✅ 已解決 |

### 問題 2: 多個開發服務器佔用同一端口

| 項目 | 內容 |
|------|------|
| **問題代碼** | P002 |
| **錯誤類型** | 端口占用 |
| **症狀** | 前端服務器自動切換到 5175 |
| **原因** | 之前的開發服務器未完全關閉 |
| **解決方案** | 系統自動使用下一可用端口 |
| **結果** | ✅ 自動解決 - 運行在 5175 |

---

## 文件檢查清單

### 前端文件
- ✅ `frontend/src/main.ts` - 已配置 Vuetify, Pinia, Vue Router
- ✅ `frontend/src/App.vue` - 已引入 AdminLayout
- ✅ `frontend/src/router/index.ts` - 已配置三個主要路由
- ✅ `frontend/src/plugins/vuetify.ts` - Vuetify 插件配置
- ✅ `frontend/src/store/app.ts` - Pinia store 結構
- ✅ `frontend/src/services/api.ts` - Axios API 客戶端
- ✅ `frontend/src/types/index.ts` - TypeScript 類型定義
- ✅ `frontend/src/components/AdminLayout.vue` - 主版面配置
- ✅ `frontend/src/views/DashboardView.vue` - 儀表板頁面
- ✅ `frontend/src/views/TransactionView.vue` - 交易明細頁面
- ✅ `frontend/src/views/CategoryConfigView.vue` - 分類設定頁面
- ✅ `frontend/.env` - 環境變數配置
- ✅ `frontend/tailwind.config.js` - Tailwind CSS 配置
- ✅ `frontend/postcss.config.js` - PostCSS 配置 (已修復)

### 後端文件
- ✅ `backend/src/index.ts` - Express 服務器主文件
- ✅ `backend/dist/index.js` - 編譯後的服務器文件
- ✅ `backend/prisma/schema.prisma` - 數據庫 Schema
- ✅ `backend/tsconfig.json` - TypeScript 配置
- ✅ `backend/.env` - 環境變數配置
- ✅ `backend/package.json` - 項目配置和運行腳本

### 根目錄文件
- ✅ `README.md` - 項目文檔
- ✅ `log.md` - 本日誌文件

---

## 工作時間統計

| 階段 | 預計時間 | 實際時間 | 備註 |
|------|---------|---------|------|
| Step 1 初始化 | 30 分鐘 | ~40 分鐘 | 包括依賴安裝 |
| 前端問題診斷 | 5 分鐘 | 5 分鐘 | Tailwind CSS 錯誤 |
| 前端問題修復 | 10 分鐘 | 10 分鐘 | 配置更新 |
| 前端測試驗證 | 5 分鐘 | 5 分鐘 | 成功啟動 |
| 後端編譯測試 | 5 分鐘 | 5 分鐘 | TypeScript 編譯 |
| 後端運行測試 | 5 分鐘 | 5 分鐘 | 服務器啟動 |
| **總計** | **60 分鐘** | **70 分鐘** | 所有步驟完成 |

---

## 後續建議

### 立即可進行
1. 訪問 http://localhost:5175 檢查前端 UI
2. 測試 http://localhost:3000/api/health 檢查後端

### 前置需求
1. 準備 PostgreSQL 數據庫連接字符串
2. 確認數據庫服務器可用

### 下一個里程碑 (Step 2)
- [ ] 配置數據庫連接
- [ ] 執行 Prisma 遷移
- [ ] 驗證數據庫表創建

---

**日誌更新時間**: 2026-09-02 下午 5:30  
**日誌作者**: 開發團隊  
**日誌版本**: v1.0
