# Hayagriva Web Portal & Licensing Server (`app.apnet.net`)

Production-ready Client Portal, Super Admin Control Center, and Desktop IDE Licensing Server built with Next.js 15 (App Router), Tailwind CSS, shadcn/ui, TanStack Table, Drizzle ORM, and Neon Serverless PostgreSQL.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` (or configure in Render / Vercel dashboard):
```env
# Neon Serverless PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"

# Cryptographic Token Signing Secrets
OFFLINE_TOKEN_SECRET="hayagriva_offline_token_hmac_secret_key_2026"
SESSION_SECRET="hayagriva_session_jwt_secret_2026_super_secure"

# Port (Default: 3300 for local dev)
PORT=3300
```

### 3. Run Development Server
```bash
npm run dev -- -p 3300
```
Open [http://localhost:3300](http://localhost:3300) in your browser.

---

## 🔑 Demo Login Credentials

| Account | Email | Password | Role | Landing URL |
|---|---|---|---|---|
| **Super Admin** | `superadmin@hayagriva.app` | `hayagriva_secure_password` | `SUPER_ADMIN` | `/admin/dashboard` |
| **Adv. Rajeshwar Rao** | `r.rao@insolvencylaw.in` | `hayagriva_secure_password` | `ADVOCATE` | `/dashboard` |
| **Pooja Singhania (IP)** | `pooja@singhanialex.com` | `hayagriva_secure_password` | `ADVOCATE` | `/dashboard` |

*(Tip: The `/login` page includes 1-click quick-fill demo pills).*

---

## 🏛️ Core Features

- **Desktop IDE Licensing Server (`POST /api/v1/activate`):** Cryptographically signs HMAC-SHA256 Offline Activation Tokens and generates SHA-256 Cloud MCP Bearer Tokens (`mcp_live_...`).
- **Device Slot Limit Enforcement:** Enforces hardware limits (Starter: 1, Pro: 3, Enterprise: 10) with idempotent re-activations and 1-click slot deactivations (`POST /api/v1/deactivate`).
- **Client Portal (`/dashboard/*`):** 6 high-density views for practitioners (Overview, Licenses & Devices, Profile with Immutable Email Guard, Invoices & GST, API Logs, Support Desk).
- **Super Admin Panel (`/admin/*`):** Global user drawers, password resets, plan overrides, binary download telemetry, and platform-wide audit logs.
- **Dual Theme:** Dark Slate (default) + 1-Click Light SaaS Mode with Theme Switcher.

---

## 📦 Deployment to Render

1. Create a **New Web Service** pointing to this repository.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run start` (or `npx next start -p $PORT`)
4. Add Environment Variables: `DATABASE_URL`, `OFFLINE_TOKEN_SECRET`, `SESSION_SECRET`, `NODE_ENV=production`.

---

## 📚 Complete Documentation

Full architectural specifications, database schemas, cryptographic protocols, and desktop IDE integration guides are available in the **[`licensing-and-portal-docs/`](./licensing-and-portal-docs/README.md)** directory.
