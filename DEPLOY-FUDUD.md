# Hab fudud — Azure HA LOO BAANA (Vercel + Render)

GitHub-kaaga waa diyaar. Raac **2 qaybood** oo keliya.

---

# QAYB 1: Vercel (Website — 5 daqiiqo)

1. Tag **https://vercel.com** → **Sign up** → dooro **GitHub**
2. **Add New…** → **Project**
3. Dooro repo: **`inventory-system`**
4. **Root Directory** → guji **Edit** → dooro **`frontend`**
5. **Environment Variables** → Add:
   - Name: `VITE_API_URL`
   - Value: `https://PLACEHOLDER.onrender.com/api`  
     *(wax ka beddel kadib Render — tallaabada 2)*
6. **Deploy** → sug 1–2 daqiiqo
7. **Nuqul URL-ka** (tusaale `https://inventory-system.vercel.app`)

✅ Website-ka waa online (login wuxuu sugayaa API — tallaabada 2).

---

# QAYB 2: Render (API + Database — Azure la’aan)

1. Tag **https://render.com** → **Get Started** → **Sign up with GitHub**
2. Dashboard → **New +** → **Blueprint**
3. Haddii la weydiiyo repo → dooro **`ramiilaabdalla14-oss/inventory-system`**
4. Render wuxuu akhriyaa `render.yaml` → wuxuu sameynayaa:
   - **inventory-db** (database)
   - **inventory-api** (API)
5. Guji **Apply** → sug 5–10 daqiiqo (build)

### Marka API dhamaado

1. Render → **inventory-api** → nuqul **URL** (tusaale `https://inventory-api-xxxx.onrender.com`)
2. **Environment** → ku dar:
   - `Cors__Origins__0` = URL-ka **Vercel** (tusaale `https://inventory-system.vercel.app`)
3. **Save** (service dib ayuu u bilaabmayaa)

### Vercel dib u cusbooneysii

1. Vercel → project → **Settings** → **Environment Variables**
2. Beddel `VITE_API_URL` → `https://inventory-api-xxxx.onrender.com/api`
3. **Deployments** → **Redeploy**

---

# Hubi

1. Fur link-ka **Vercel**
2. Login: `admin@inventory.com` / `Admin@123`

---

# Push code cusub GitHub (hal mar)

Haddii aadan weli push-garin isbeddelkan:

```powershell
cd c:\Users\hp\Inventory
git add .
git commit -m "Add Render deploy (skip Azure)"
git push
```

Kadib Render → **Manual Deploy** ama automatic deploy.

---

# Dhibaato

| Dhibaato | Xalka |
|---------|--------|
| Login ma shaqeynayo | Hubi `VITE_API_URL` wuxuu ku dhammaadaa `/api` |
| CORS error | `Cors__Origins__0` Render = URL Vercel sax |
| Render build fail | Logs → ii soo dir screenshot |
| Free tier slow | Render free wuu hurdaa — sug 30 ilb sec marka hore la furo |

---

**Azure:** ha isticmaalin haddii adag tahay. Render + Vercel waa ku filan.
