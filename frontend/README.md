# AI Sales Engagement Chatbot with SAP Integration - Frontend

A sophisticated React-based dashboard for managing AI-driven sales engagement, featuring real-time conversation tracking, lead management, and integration with SAP systems.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [DaisyUI 5](https://daisyui.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **API Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/), [React Toastify](https://fkhadra.github.io/react-toastify/)
- **State Management**: React Context API (Auth) & TanStack Query (Server State)

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://your-api-endpoint.com
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL for the backend API services. |

## 📂 Folder Structure

```text
src/
├── api/          # Static API configurations and fetch utilities
├── assets/       # Static assets like images and fonts
├── components/   # Reusable UI components (Shared, Dashboard, etc.)
├── hooks/        # Custom React hooks (e.g., useAxiosSecure)
├── layout/       # Layout components (Root, Auth)
├── pages/        # Main application pages/views
│   ├── Authintication/ # Login, Forget Password, etc.
│   └── Provider/       # Context Providers (AuthContext)
├── route/        # Routing configuration (Routes.jsx)
├── App.jsx       # Global styles/setup
└── main.jsx      # Entry point
```

## 🔌 API Integration Flow

- **Axios Instance**: A centralized `axiosSecure` instance is created in `src/hooks/useAxios.jsx`.
- **Interceptors**: 
  - Automatically attaches `Bearer <token>` to every request if available in `localStorage`.
  - Includes `ngrok-skip-browser-warning: true` header to facilitate development with ngrok.
- **Data Fetching**: Components use **TanStack Query** hooks for efficient caching, background updates, and loading/error states.

## 🔐 Authentication Flow

1. **Login**: User submits credentials in `pages/Authintication/Login.jsx`.
2. **Token Storage**: On success, `accessToken` and user data are saved to `localStorage`.
3. **Context Update**: `AuthContext` updates the global `user` state.
4. **Session Persistence**: `AuthProvider` checks `localStorage` on mount to restore the session.
5. **Profile Fetch**: A `/auth/me/` request is automatically made to fetch the latest profile details using the stored token.

## 📄 Module Documentation

- **Dashboard**: Real-time overview of sales performance, trending products, and lead statistics.
- **Conversations**: Interface to view and manage AI-to-Customer interactions.
- **Leads**: Centralized lead management system with status tracking.
- **Products**: Complete product inventory management including barcode tracking, pricing, stock levels, and categorization.
- **Product Upload**: Specialized management interface for featured items, including Best Categories, Best Subcategories, Best Brands, and New Arrival tracking.
- **Settings**: Configuration page for system-wide parameters (e.g., IQD/USD Conversion Rate).
- **Admin Manage**: Tools for managing administrative users and permissions.

## 🏗️ Build & Deployment

### Build
To create a production build, run:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Deployment (Vercel)
The project is configured for Vercel deployment via `vercel.json`:
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **SPA Rewrites**: All routes redirect to `index.html` to support client-side routing.

## ❓ Troubleshooting

- **API Connection Errors**: Ensure `VITE_API_URL` is correctly set and the backend is accessible.
- **Auth Loops**: If the token is invalid, clear `localStorage` and log in again.
- **Missing Images**: Verify if `VITE_API_URL` correctly matches the backend's static file server configuration.

## 📝 Recent Updates

- **Product Upload Management**: Added a multi-tab interface for managing Best Categories, Subcategories, Brands, and New Arrivals.
- **Static Asset Management**: Established a standardized system for downloadable templates. Static assets like `.xlsx` files are stored in `public/templates` to bypass Vite's import analysis and ensure direct, reliable downloads.
- **Products Inventory Management**: Implemented a comprehensive product catalog page with search, category filtering, and inventory status tracking.
- **IQD Rate Management**: Added a new Settings page to dynamically update the Dollar to IQD conversion rate via `/api/v1/leads/rate/`.
- **Auth Provider Refactor**: Optimized profile fetching with React Query caching and persistent localStorage syncing.
- **UI Consistency**: Standardized dashboard cards and sidebar navigation.
