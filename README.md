# BondBuy 前端系統

## 專案概述

BondBuy 前端是一個基於 React + TypeScript 的現代化代購平台用戶界面，提供直觀的購物體驗和完整的電商功能，支援買家和代購商兩種角色的不同需求。

## 技術棧

- **框架**: React 19.1.0
- **語言**: TypeScript 5.8.3
- **路由**: React Router DOM 6.26.0
- **HTTP 客戶端**: Axios 1.7.0
- **樣式**: Tailwind CSS 3.4.12
- **建構工具**: Vite 7.0.4
- **程式碼品質**: ESLint + TypeScript ESLint

## 系統架構

### 目錄結構

```
src/
├── components/          # 共用元件
│   ├── CartIcon.tsx    # 購物車圖示元件
│   ├── Header.tsx      # 頁面標題欄
│   ├── Layout.tsx      # 頁面佈局元件
│   ├── ProductForm.tsx # 商品表單元件
│   ├── ProtectedRoute.tsx # 路由保護元件
│   └── UserDropdown.tsx   # 用戶下拉選單
├── context/            # React Context
│   ├── AuthContext.tsx # 認證狀態管理
│   └── CartContext.tsx # 購物車狀態管理
├── pages/              # 頁面元件
│   ├── Cart.tsx        # 購物車頁面
│   ├── Dashboard.tsx   # 主控面板
│   ├── EmailVerification.tsx # 郵箱驗證
│   ├── Home.tsx        # 首頁
│   ├── Login.tsx       # 登入頁面
│   ├── ProductDetail.tsx # 商品詳情頁面
│   ├── ProductManagement.tsx # 商品管理 (代購商)
│   ├── Profile.tsx     # 用戶資料頁面
│   ├── Register.tsx    # 註冊頁面
│   └── UserTypeSelection.tsx # 用戶類型選擇
├── services/           # API 服務層
│   ├── api.ts          # API 基礎配置
│   ├── authService.ts  # 認證服務
│   ├── cartService.ts  # 購物車服務
│   ├── countryService.ts # 國家服務
│   ├── productService.ts # 商品服務
│   └── userService.ts  # 用戶服務
├── types.ts            # TypeScript 類型定義
├── App.tsx             # 主應用元件
└── main.tsx            # 應用入口點
```

### 核心功能模組

#### 1. 認證系統
- **AuthContext**: 全域認證狀態管理
- **ProtectedRoute**: 路由權限保護
- **JWT Token**: 自動處理 Token 刷新和過期

#### 2. 購物車系統
- **CartContext**: 全域購物車狀態管理
- **CartIcon**: 即時購物車預覽
- **庫存檢查**: 即時庫存驗證和限制

#### 3. 商品管理
- **商品瀏覽**: 支援分類、搜尋、排序
- **商品詳情**: 詳細商品資訊展示
- **商品管理**: 代購商專用的商品 CRUD 功能

#### 4. 用戶系統
- **多角色支援**: 買家和代購商不同界面
- **個人資料管理**: 用戶資料編輯功能
- **郵箱驗證**: 完整的郵箱驗證流程

## 頁面功能

### 公開頁面
- **首頁 (`/`)**: 平台介紹和功能展示
- **登入 (`/login`)**: 用戶登入界面
- **註冊 (`/register`)**: 用戶註冊界面，支援角色選擇
- **郵箱驗證 (`/verify-email`)**: 郵箱驗證確認頁面

### 認證頁面
- **主控面板 (`/dashboard`)**: 根據用戶角色顯示不同內容
- **商品詳情 (`/products/:id`)**: 商品詳細資訊和購買功能
- **購物車 (`/cart`)**: 購物車管理和結帳準備
- **個人資料 (`/profile`)**: 用戶資料檢視和編輯

### 代購商專用頁面
- **商品管理 (`/products/manage`)**: 商品的新增、編輯、刪除功能

## API 整合

### HTTP 客戶端配置
- **基礎 URL**: `http://localhost:8080` (開發環境)
- **認證方式**: JWT Bearer Token
- **請求攔截器**: 自動添加認證標頭
- **回應攔截器**: 統一錯誤處理和 Token 刷新

### 服務層架構
每個服務層都封裝了對應的 API 操作：
- `authService`: 登入、註冊、郵箱驗證
- `userService`: 用戶資料管理
- `productService`: 商品資料操作
- `cartService`: 購物車操作
- `countryService`: 國家資料獲取

## 狀態管理

### Context API
使用 React Context 進行全域狀態管理：

#### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}
```

#### CartContext
```typescript
interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  removeItem: (cartId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}
```

## 樣式系統

### Tailwind CSS 配置
- **響應式設計**: 支援手機、平板、桌面版本
- **主題色彩**: 使用一致的品牌色彩系統
- **元件樣式**: 統一的按鈕、表單、卡片樣式

### 設計原則
- **行動優先**: Mobile-first 響應式設計
- **無障礙性**: 遵循 WCAG 無障礙指南
- **用戶體驗**: 直觀的操作流程和即時反饋

## 快速開始

### 前置需求
- Node.js 18+ 
- npm 或 yarn
- 後端系統正常運行 (http://localhost:8080)

### 安裝步驟

1. **複製專案**
```bash
git clone <repository-url>
cd frontend
```

2. **安裝依賴**
```bash
npm install
# 或
yarn install
```

3. **環境配置**
創建 `.env.local` 文件：
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=BondBuy
```

4. **啟動開發伺服器**
```bash
npm run dev
# 或
yarn dev
```

5. **開啟瀏覽器**
   - 開發伺服器：http://localhost:5173
   - 熱重載功能會自動檢測檔案變更

## 開發指南

### 新增頁面
1. 在 `src/pages/` 中創建新的 React 元件
2. 在 `App.tsx` 中新增路由配置
3. 如需認證保護，使用 `ProtectedRoute` 包裹
4. 更新導航選單 (如需要)

### 新增 API 服務
1. 在對應的服務檔案中新增方法
2. 定義相關的 TypeScript 介面
3. 在元件中使用服務方法
4. 處理載入狀態和錯誤情況

### 狀態管理最佳實務
- 全域狀態使用 Context API
- 本地狀態使用 useState
- 複雜邏輯使用 useReducer
- 副作用使用 useEffect

## 建構與部署

### 開發建構
```bash
# 類型檢查
npm run build
# 或分步執行
npx tsc -b  # TypeScript 編譯
npm run build  # Vite 建構
```

### 程式碼品質
```bash
# ESLint 檢查
npm run lint

# 預覽建構結果
npm run preview
```

### 生產部署
1. **建構生產版本**
```bash
npm run build
```

2. **靜態檔案部署**
   - 建構結果在 `dist/` 目錄
   - 支援任何靜態檔案託管服務 (Nginx, Apache, Cloudflare Pages 等)

3. **環境變數設定**
   - 設定正確的 API 基礎 URL
   - 配置相關的第三方服務金鑰

### Docker 部署
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 測試

### 測試框架 (預留)
```bash
# 單元測試
npm run test

# 測試覆蓋率
npm run test:coverage

# E2E 測試
npm run test:e2e
```

## 效能優化

### 程式碼分割
- 使用 React.lazy() 進行路由層級的程式碼分割
- 動態導入非關鍵功能模組

### 圖片最佳化
- 支援 WebP 格式
- 實作懶載入 (Lazy Loading)
- 響應式圖片大小

### 快取策略
- API 回應快取 (適當的情況下)
- 瀏覽器快取配置
- Service Worker 離線支援 (未來功能)

## 瀏覽器支援

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 常見問題

### API 連接問題
- 確認後端服務正在運行
- 檢查 CORS 設定
- 驗證 API 基礎 URL 配置

### 認證問題
- 檢查 JWT Token 是否有效
- 確認登入狀態是否正確
- 清除瀏覽器快取和 localStorage

### 建構問題
- 清除 node_modules 並重新安裝
- 檢查 Node.js 版本相容性
- 確認環境變數設定正確

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 遵循程式碼規範 (ESLint + Prettier)
4. 撰寫適當的註解和文件
5. 提交變更 (`git commit -m 'Add some amazing feature'`)
6. 推送到分支 (`git push origin feature/amazing-feature`)
7. 開啟 Pull Request

## 授權

本專案採用 MIT 授權條款 - 詳見 LICENSE 檔案

## 聯絡資訊

如有任何問題，請透過以下方式聯絡：
- 開發團隊：[your-email@example.com]
- 專案 Issues：[repository-issues-url]