# Sida loo online geliyo Inventory System

Mashruucan wuxuu ka kooban yahay **backend (API)** + **frontend (React)** + **SQL Server database**.

## Haddii aad haysato GitHub + Azure + Vercel

**Raac [DEPLOY-AZURE-VERCEL.md](./DEPLOY-AZURE-VERCEL.md)** — hagaha buuxa ee account-yadaada.

---

## Habka 1: Vercel (frontend) + Railway (backend + database)

### Tallaabada 1: GitHub

1. Samee account [GitHub](https://github.com) haddii aadan haysan.
2. Fur PowerShell mashruuca gudahiisa:

```powershell
cd c:\Users\hp\Inventory
git init
git add .
git commit -m "Initial commit - Inventory system"
```

3. GitHub → **New repository** → magac `inventory-system` → Create (empty).
4. Ku xidh repo-gaaga (beddel `USERNAME`):

```powershell
git remote add origin https://github.com/USERNAME/inventory-system.git
git branch -M main
git push -u origin main
```

### Tallaabada 2: Railway (API + SQL Server)

1. Tag [railway.app](https://railway.app) → Sign up with GitHub.
2. **New Project** → **Deploy from GitHub repo** → dooro `inventory-system`.
3. Railway wuxuu akhrin karaa `docker-compose.yml`. Dooro **Deploy** ama samee 3 services manually:
   - **db**: SQL Server image
   - **api**: backend folder / Dockerfile
   - **web**: frontend (optional haddii aad Vercel isticmaasho)
4. **Variables** (Settings → Variables) ku dar:

| Variable | Qiime |
|----------|-------|
| `MSSQL_SA_PASSWORD` | eray sir ah (ugu yaraan 12 xaraf, tusaale `MyStr0ng!Pass2026`) |
| `JWT_KEY` | ugu yaraan 32 xaraf sir ah |
| `FRONTEND_URL` | URL-ka Vercel (tallaabada 3 kadib) |
| `VITE_API_URL` | `https://YOUR-API.railway.app/api` |

5. Ka dib deploy, nuqul **public URL** ee API (tusaale `https://inventory-api-production.up.railway.app`).

### Tallaabada 3: Vercel (frontend)

1. Tag [vercel.com](https://vercel.com) → Sign up with GitHub.
2. **Add New Project** → dooro isla repo-ga → **Root Directory**: `frontend`.
3. **Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://YOUR-API.railway.app/api` |

4. **Deploy**. Nuqul URL-ka (tusaale `https://inventory-system.vercel.app`).
5. Ku noqo Railway → beddel `FRONTEND_URL` → URL-ka Vercel → **Redeploy** API.

### Tallaabada 4: Hubi

- Fur frontend URL → login: `admin@inventory.com` / `Admin@123`
- Haddii CORS error: hubi `FRONTEND_URL` Railway inuu sax yahay (https, aan `/` dambe lahayn)

---

## Habka 2: Docker (hal server / VPS)

Haddii aad Docker rakibto kombuyuutarka ama VPS (DigitalOcean, Hetzner, iwm.):

```powershell
cd c:\Users\hp\Inventory
copy .env.example .env
# Wax ka beddel .env — gaar ahaan MSSQL_SA_PASSWORD iyo JWT_KEY
docker compose up -d --build
```

- Frontend: http://localhost  
- API: http://localhost:8080  
- Swagger (dev only): ma shaqeynayo Production mode

---

## Habka 3: Azure (waxaa ugu habboon .NET + SQL Server)

1. [Azure Portal](https://portal.azure.com) → **App Service** (API) + **Azure SQL Database**.
2. Connection string ku dar App Service → **Configuration** → `ConnectionStrings__DefaultConnection`.
3. `Cors__Origins__0` = URL-ka frontend.
4. Frontend: **Static Web Apps** ama Vercel.

---

## Muhiim

- **Ha gelin** `appsettings.json` sir ah GitHub (JWT key, SQL password).
- Production: beddel password-ka admin (`Admin@123`) marka online noqoto.
- Cloudinary: haddii sawirro la isticmaalo, ku dar keys Railway/Azure.

## Caawimo

Haddii deploy-ku fashilmo, ii sheeg:
- Goobta aad dooratay (Vercel, Railway, Azure)
- Farriinta qaladka (screenshot ama text)
