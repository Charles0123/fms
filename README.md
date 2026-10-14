# 財務管理系統 (Financial Management System - MVP)

一個輕量級的全端財務管理系統，用於記錄每日營收與支出。

## 項目結構

```
FMS/
├── frontend/          # Vue 3 + TypeScript + Vite 前端應用
│   ├── src/
│   │   ├── components/     # UI 元件
│   │   ├── views/          # 頁面視圖
│   │   ├── router/         # Vue Router 配置
│   │   ├── store/          # Pinia 狀態管理
│   │   ├── services/       # API 服務
│   │   ├── types/          # TypeScript 類型定義
│   │   ├── plugins/        # 插件配置
│   │   └── main.ts         # 應用入口
│   ├── package.json
│   └── vite.config.ts
│
└── backend/           # Node.js + Express + Prisma 後端應用
    ├── src/
    │   └── index.ts        # 服務器入口
    ├── prisma/
    │   └── schema.prisma   # 數據庫 Schema
    ├── .env                # 環境變數配置
    ├── package.json
    └── tsconfig.json
```

## 技術棧

### 前端
- **框架**: Vue 3 + Composition API + `<script setup>`
- **構建工具**: Vite
- **語言**: TypeScript
- **UI 框架**: Vuetify 3 + Tailwind CSS
- **狀態管理**: Pinia
- **路由**: Vue Router
- **圖表**: ECharts.js
- **HTTP 客戶端**: Axios

### 後端
- **運行時**: Node.js
- **框架**: Express.js
- **語言**: TypeScript
- **ORM**: Prisma
- **數據庫**: PostgreSQL
- **環境變數**: dotenv
- **跨域**: CORS

## 快速開始

### 前端開發

```bash
cd frontend
npm install
npm run dev
```

前端應用將在 `http://localhost:5173` 運行。

### 後端開發

這個專案目前使用 PostgreSQL 資料庫，並已正式接上 Aiven 雲端 PostgreSQL。建議的啟動流程如下：

#### 1) 設定資料庫連線

編輯 `backend/.env`：



#### 2) 安裝依賴

```bash
cd backend
npm install
```

#### 3) 初始化 / 同步資料庫結構

如果這是第一次啟動，或你修改了 Prismaschema，先同步資料庫結構：

```bash
npx prisma db init
```

若資料庫已存在，且 schema 已同步過，通常可直接跳過這一步：

```bash
npx prisma db update
```

> 注意：這個專案目前所使用的 Prisma CLI 版本，命令格式已與舊版教學不同；實際上應以 `prisma db` / `prisma migration` 為主。

#### 4) 啟動後端伺服器

```bash
npm run dev
```

後端服務會在 `http://localhost:3000` 運行。

#### 啟動順序總結

- 第一次使用：`npm install` → `npx prisma db init` → `npm run dev`
- 之後正常開發：`npm install` → `npm run dev`

### Aiven PostgreSQL 連線資訊

目前使用的資料庫資訊如下：



完整連線字串：




## 核心功能

### 已完成的初始化工作（Step 1）

✅ 前端項目結構初始化
- Vite + Vue 3 + TypeScript 配置
- Tailwind CSS + Vuetify 集成
- Pinia 狀態管理設置
- Vue Router 路由配置
- 基本頁面框架（儀表板、收支明細、分類設定）

✅ 後端項目結構初始化
- Node.js + Express 框架
- TypeScript 配置
- Prisma ORM 設置
- 基本服務器配置

### 待實現的功能

⏳ **Step 2**: Prisma Schema & 數據庫遷移
- 分類表 (Category)
- 交易紀錄表 (Transaction)

⏳ **Step 3**: 後端 API 實現
- 分類管理 API
- 交易紀錄 API
- 報表與統計 API
- Excel/PDF 匯出

⏳ **Step 4**: 前端 API 串接
- Axios 配置
- Pinia store 實現
- 頁面路由完成

⏳ **Step 5**: 前端詳細功能
- 表單操作與驗證
- ECharts 圖表渲染
- Excel/PDF 下載

## 環境變數

### 後端 (.env)


### 前端 (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 下一步

目前已完成 **Step 1** 的初始化工作。下一步將進行 **Step 2: Prisma Schema & 數據庫遷移**。

## License

MIT
