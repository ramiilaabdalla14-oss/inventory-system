# Deploy: Azure (API + Database) + Vercel (Frontend)

Account-yadaada diyaar bay u yihiin. Raac tallaabooyinkan **si taxane ah**.

---

## QAYBTA 1: GitHub (ku dar code-ka)

### 1.1 Commit & push

```powershell
cd c:\Users\hp\Inventory
git add .
git commit -m "Inventory system - ready for Azure and Vercel"
```

### 1.2 Samee repo cusub GitHub

1. Tag https://github.com/new
2. Repository name: `inventory-system` (ama magac kale)
3. **Private** ama Public — dooro
4. **Ha** dooran "Add README" (repo madhan)
5. **Create repository**

### 1.3 Push (beddel `USERNAME` magacaaga GitHub)

```powershell
git remote add origin https://github.com/USERNAME/inventory-system.git
git branch -M main
git push -u origin main
```

Haddii GitHub ku weydiiyo login → isticmaal **Personal Access Token** password ahaan.

---

## QAYBTA 2: Azure SQL Database

1. Tag [portal.azure.com](https://portal.azure.com)
2. **Create a resource** → raadi **SQL Database** → Create
3. Deji:
   - **Resource group**: `inventory-rg` (Create new)
   - **Database name**: `InventoryDB`
   - **Server**: Create new → magac tusaale `inventory-sql-2026` (waa inuu noqdaa mid gaar ah adduunka)
   - **Authentication**: **Use SQL authentication**
   - **Server admin login**: `sqladmin`
   - **Password**: eray sir adag (qor — waad u baahan tahay!)
   - **Location**: West Europe ama kuugu dhow
   - **Compute**: Basic (ugu jaban) ama Serverless
4. **Networking** tab:
   - **Allow Azure services** → ON
   - **Add current client IP** → ON (si aad ugu tijaabiso)
5. **Create** → sug 2–5 daqiiqo

### Connection string (nuqul kadib)

1. SQL Database → **Connection strings**
2. Dooro **ADO.NET**
3. Nuqul string-ka, beddel `{your_password}` password-kaaga:

```
Server=tcp:inventory-sql-2026.database.windows.net,1433;Initial Catalog=InventoryDB;Persist Security Info=False;User ID=sqladmin;Password=PASSWORDKAAGA;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

---

## QAYBTA 3: Azure App Service (API / Backend)

1. **Create a resource** → **Web App** → Create
2. Deji:
   - **Resource group**: `inventory-rg` (isla kan)
   - **Name**: `inventory-api-2026` (URL: `https://inventory-api-2026.azurewebsites.net`)
   - **Publish**: Code
   - **Runtime stack**: **.NET 10 (LTS)** — haddii aan jirin, dooro **.NET 9 (LTS)**
   - **OS**: Windows ama Linux (labaduba waa OK)
   - **Region**: isla goobta SQL
3. **Create**

### 3.1 Environment variables (Configuration)

App Service → **Settings** → **Environment variables** (ama Configuration → Application settings)

Ku dar **Application settings** (Add):

| Name | Value |
|------|--------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | connection string-ka SQL (kor) |
| `Jwt__Key` | ugu yaraan 32 xaraf sir ah (cusub, ha isticmaalin kan local) |
| `Jwt__Issuer` | `InventoryAPI` |
| `Jwt__Audience` | `InventoryUsers` |
| `Cors__Origins__0` | `https://PLACEHOLDER.vercel.app` (wax ka beddel kadib Vercel) |

**Save** → **Continue** haddii restart la weydiiyo.

### 3.2 Deploy API (hab fudud — GitHub)

1. App Service → **Deployment Center**
2. **Source**: GitHub → Authorize → dooro repo `inventory-system`
3. **Branch**: `main`
4. **Build Provider**: GitHub Actions (recommended)
5. **Folder** / path: haddii la weydiiyo, `backend` ama root — workflow-ga wuxuu publish-gareeyaa `backend/`
6. Save

**Ama** manual deploy PowerShell (hal mar):

```powershell
cd c:\Users\hp\Inventory\backend
dotnet publish -c Release -o ./publish
```

Kadib App Service → **Advanced Tools (Kudu)** → Zip Deploy `publish` folder.

### 3.3 Hubi API

Fur browser: `https://inventory-api-2026.azurewebsites.net/api/auth/login`  
POST JSON: `{"email":"admin@inventory.com","password":"Admin@123"}`  

Haddii JSON response (token ama error message) → API waa shaqaynaysa.

---

## QAYBTA 4: Vercel (Frontend)

1. Tag [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Add New…** → **Project**
3. **Import** Git Repository → GitHub → dooro `inventory-system`
4. **Configure Project**:
   - **Root Directory**: `frontend` (Edit → dooro folder `frontend`)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables** → Add:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://inventory-api-2026.azurewebsites.net/api` |

(beddel magaca App Service haddii kala duwan yahay)

6. **Deploy** → sug build

7. Nuqul URL-ka Vercel (tusaale `https://inventory-system.vercel.app`)

### 4.1 CORS dib u cusbooneysii Azure

Ku noqo Azure App Service → Environment variables:

- `Cors__Origins__0` = URL-ka Vercel **sax** (https, aan `/` dambe lahayn)
- Save + Restart App Service

---

## QAYBTA 5: Hubi app-ka

1. Fur URL-ka Vercel
2. Login: `admin@inventory.com` / `Admin@123`
3. Dashboard, Products, iwm. hubi

---

## GitHub Actions (automatic deploy API)

Repo-ga wuxuu leeyahay `.github/workflows/azure-api.yml`.

Marka App Service la sameeyo:

1. App Service → **Download publish profile**
2. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
3. Ku dar:
   - `AZURE_WEBAPP_NAME` = magaca App Service (tusaale `inventory-api-2026`)
   - `AZURE_WEBAPP_PUBLISH_PROFILE` = dhammaan XML-ka publish profile (copy/paste)
4. Push commit cusub → Actions wuxuu API deploy-gareeyaa

---

## Dhibaatooyinka caadiga ah

| Dhibaato | Xalka |
|---------|--------|
| CORS error browser | Hubi `Cors__Origins__0` = URL Vercel sax |
| 500 / database error | Hubi connection string + SQL firewall "Allow Azure services" |
| Login ma shaqeynayo | API URL Vercel: `VITE_API_URL` waa inuu ku dhammaadaa `/api` |
| .NET 10 ma jiro Azure | App Service dooro .NET 9; beddel `TargetFramework` `net9.0` backend-ka |

---

## Amniga (muhiim)

- Production: beddel password-ka `Admin@123`
- Ha gelin `appsettings.json` sir cusub GitHub
- JWT key cusub Azure Environment variables ku dar
