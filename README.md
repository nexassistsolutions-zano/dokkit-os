# DokKit Business OS 🇿🇦

Your personal business management system — CRM, Invoices, Document Library, and Tasks.

---

## 🚀 Deploy in 3 Steps

### Step 1 — Install Node.js
Download and install from: https://nodejs.org (choose the LTS version)

### Step 2 — Install dependencies & build
Open your terminal (Command Prompt on Windows, Terminal on Mac), navigate to this folder, then run:

```bash
npm install
npm run build
```

This creates a `build/` folder with your ready-to-deploy app.

### Step 3 — Deploy to Netlify (Free)

**Option A — Drag & Drop (easiest):**
1. Go to https://netlify.com and sign up for free
2. On your dashboard, drag the `build/` folder into the deploy area
3. Done! You'll get a live URL like `https://dokkit-os.netlify.app`

**Option B — GitHub auto-deploy:**
1. Push this folder to a GitHub repo
2. Go to https://netlify.com → "New site from Git"
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `build`
6. Every push to GitHub auto-redeploys your site

---

## 🌐 Custom Domain (dokkit.co.za)

1. Register your domain at https://domains.co.za (~R99/year)
2. In Netlify → Site Settings → Domain Management → Add custom domain
3. Follow Netlify's DNS instructions (takes ~10 minutes to go live)

---

## 💻 Run Locally (for testing)

```bash
npm install
npm start
```

Opens at http://localhost:3000

---

## 📦 What's Inside

- **Dashboard** — Revenue stats, outstanding invoices, urgent tasks
- **Customers & Leads** — Full CRM with status tracking
- **Invoices** — Create, manage, and track invoices in ZAR
- **Document Library** — Track your DokKit templates
- **Tasks** — Kanban board with priority levels

All data saves to your browser's localStorage — no database needed.

---

Made for Mzansi 🧡
