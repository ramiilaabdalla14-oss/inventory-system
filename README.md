# Inventory Management System

Monorepo: ASP.NET Core API + React (Vite) frontend.

## Structure

```
Inventory/
├── backend/          # ASP.NET Core Web API (.NET 10)
├── frontend/         # React + Vite UI
├── Inventory.slnx    # .NET solution (open in Visual Studio / Rider)
└── README.md
```

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) 10+
- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- SQL Server (local instance; connection string in `backend/appsettings.json`)

## Quick start

### 1. Backend (API)

```powershell
cd backend
dotnet restore
dotnet run
```

- API: http://localhost:5026  
- Swagger: http://localhost:5026/swagger  

Default admin (seeded on first run):

- Email: `admin@inventory.com`  
- Password: `Admin@123`

### 2. Frontend (UI)

```powershell
cd frontend
npm install
copy .env.example .env   # if .env does not exist
npm run dev
```

- App: http://localhost:5173  
- API URL: set in `frontend/.env` as `VITE_API_URL=http://localhost:5026/api`

Run backend and frontend in **two terminals**.

## Postman

Import from `backend/postman/`:

- `Inventory-API.postman_collection.json`
- `Inventory-Local.postman_environment.json`

## Configuration

| Area | File |
|------|------|
| Database & JWT | `backend/appsettings.json` |
| Cloudinary (images) | `backend/appsettings.json` → `Cloudinary` |
| Frontend API base | `frontend/.env` |

## Deploy online

- **Azure + Vercel (recommended):** [DEPLOY-AZURE-VERCEL.md](./DEPLOY-AZURE-VERCEL.md)
- **Railway / Docker:** [DEPLOY-SO.md](./DEPLOY-SO.md)
