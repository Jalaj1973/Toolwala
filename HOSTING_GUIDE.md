# 🌐 Toolwala — Complete Hosting, Domain & Deployment Guide

This guide details the complete roadmap for taking **Toolwala** live on a custom domain using **paid hosting (excluding Vercel)**, along with step-by-step instructions for continuous, zero-downtime updates.

---

## 1. Domain Strategy: What Domain is Best?

### Top Domain Recommendations
Because Toolwala features both **universal file utilities** (PDF, image, audio, video) and **specialized Indian exam guidelines** (NEET, UPSC, JEE, SSC, GATE), your domain choice depends on your primary target audience:

| Domain | Best For | Verdict |
| :--- | :--- | :--- |
| **`toolwala.com`** | Global scale, universal recognition, authoritative brand. | **Top Global Pick** — Best if available or within budget. |
| **`toolwala.in`** | Indian students, exam aspirants, high trust in India. | **Top India Pick** — Highly recommended given the NEET/UPSC exam presets. Extremely affordable (~₹400–₹600/year). |
| **`toolwala.app`** | Modern web app feel, implies software/tool utility. Built-in HTTPS requirement. | **Great Alternative** — Clean, modern, memorable. |
| **`toolwala.tools`** | Direct relevance to search engines and user expectations. | **Strong Tech Alternative**. |
| **`thetoolwala.com`** | Fallback if `toolwala.com` is parked/expensive. | **Solid Brand Fallback**. |

### Recommended Registrars
Avoid registrars with aggressive renewal markups or forced add-ons:
* **Cloudflare Registrar**: Sells domains at wholesale cost (zero markup, free WHOIS privacy).
* **Porkbun**: Transparent pricing, free SSL & privacy.
* **Namecheap**: Reliable, simple DNS management.

---

## 2. Paid Hosting Architectures (Excluding Vercel)

Since Toolwala is a **client-side Single Page Application (SPA)** with zero server-side file compute, you have three excellent paid hosting routes:

```
                  ┌──────────────────────────────────────────────┐
                  │          Visitor / Browser (4,000+ users)    │
                  └──────────────────────┬───────────────────────┘
                                         │
                         HTTPS Request (DNS: Cloudflare)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
     ┌───────────────────────┐                       ┌───────────────────────┐
     │ Option A: Cloud VPS   │                       │ Option B: AWS S3 +    │
     │ DigitalOcean / Hetzner│                       │ CloudFront Edge CDN   │
     │ ($4 - $6/month)       │                       │ ($1 - $3/month)       │
     │ Nginx serving /dist   │                       │ Global edge caching   │
     └───────────────────────┘                       └───────────────────────┘
```

### Option A: Cloud VPS (DigitalOcean / Hetzner / Linode) — *Recommended for Complete Control*
* **Cost:** ~$4 to $6/month (DigitalOcean Basic Droplet or Hetzner CX22).
* **Specs:** 1 vCPU, 1–2 GB RAM, 20–40 GB NVMe SSD.
* **Why it's great:** You own the entire server, dedicated IP address, custom Nginx web server, and can host databases, cron jobs, or other apps alongside it.

### Option B: AWS S3 + CloudFront CDN — *Recommended for Enterprise Scale*
* **Cost:** ~$0.50 to $3/month (Pay-per-bandwidth only).
* **Why it's great:** Static files stored in an S3 bucket and cached across 400+ AWS edge locations worldwide. Can handle 100,000 requests/minute without managing a Linux server.

### Option C: Traditional cPanel / Hostinger Cloud Hosting
* **Cost:** ~$3 to $8/month.
* **Why it's great:** Simple GUI file manager, web-based email accounts (`support@toolwala.in`), 1-click SSL.

---

## 3. Step-by-Step: Taking Toolwala Live on a Cloud VPS (DigitalOcean / Hetzner)

Here is the exact production deployment workflow for a Linux server running **Ubuntu 24.04** with **Nginx**:

### Step 1: Build the Production Bundle Locally or in CI
Run the Vite build command in the project directory:
```bash
npm run build
```
This generates the optimized, production-ready static assets in the [`dist/`](file:///Users/jalajbalodi/Desktop/pdf/dist) directory.

### Step 2: Set Up the Server
SSH into your server:
```bash
ssh root@your-server-ip
```

Install Nginx and Certbot (for free automated SSL):
```bash
apt update && apt install -y nginx certbot python3-certbot-nginx
```

### Step 3: Configure Nginx for Single Page Application (SPA) Routing
Because Toolwala uses React Router (e.g. `/tools`, `/exams`, `/login`), Nginx must redirect all sub-routes to `index.html` so client-side routing works when users refresh or bookmark URLs.

Create the Nginx configuration file:
```bash
nano /etc/nginx/sites-available/toolwala
```

Paste the following configuration:
```nginx
server {
    server_name toolwala.in www.toolwala.in;

    root /var/www/toolwala/dist;
    index index.html;

    # Gzip Compression for fast loading
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_vary on;
    gzip_min_length 256;

    # Static Assets with 1-Year Cache (Vite hashes file names)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA Fallback (Crucial for React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site and reload Nginx:
```bash
ln -s /etc/nginx/sites-available/toolwala /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 4: Configure DNS Records
Go to your domain registrar (or Cloudflare DNS) and add these DNS records:
* **A Record**: `@` (or `toolwala.in`) points to your server's IP (e.g., `192.0.2.1`).
* **CNAME Record**: `www` points to `toolwala.in`.

### Step 5: Enable Free SSL Certificate (HTTPS)
Run Certbot to automatically configure SSL:
```bash
certbot --nginx -d toolwala.in -d www.toolwala.in
```
Certbot will auto-configure HTTPS and set up automatic 90-day certificate renewals.

---

## 4. Step-by-Step: Taking Toolwala Live on cPanel / Hostinger (Shared / Apache)

If using Hostinger or cPanel:
1. Run `npm run build` on your machine.
2. In cPanel, go to **File Manager** -> open `public_html`.
3. Upload all contents inside your local [`dist/`](file:///Users/jalajbalodi/Desktop/pdf/dist) folder directly into `public_html`.
4. **Important**: Create a file named `.htaccess` in `public_html` with this SPA rewrite rule:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
5. Enable SSL via the cPanel SSL/TLS Manager (Free Let's Encrypt).

---

## 5. How to Update the Website Once Live

When you add new tools, update designs, or modify code, you never need downtime. Because Vite adds unique cryptographic hashes to filenames (e.g., `index-S3jnlVh0.js`), updates are **atomic and instant**.

### Method 1: Automated CI/CD via GitHub Actions (Recommended)
You push code to GitHub (`git push origin main`), and GitHub automatically builds and deploys to your server within 30 seconds.

Create `.github/workflows/deploy.yml` in your repository:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Project
        run: npm run build

      - name: Deploy to Server via Rsync / SSH
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: "-rlgoDzvc -i --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_USER: "root"
          TARGET: "/var/www/toolwala/dist"
```

Whenever you run:
```bash
git add .
git commit -m "feat: Add new exam preset"
git push origin main
```
GitHub Actions builds and copies the updated files to your server automatically.

---

### Method 2: Updating Manually on the Server (Git Pull)
If you do not want GitHub Actions, clone the repository directly on your server:

```bash
# 1. On your local machine:
git push origin main

# 2. On your VPS server:
cd /var/www/toolwala-source
git pull origin main
npm install
npm run build
rsync -av --delete dist/ /var/www/toolwala/dist/
```

---

## 6. Checklist Before Going Live

- [ ] Add your production Supabase URL & Anon Key to the production `.env` (if using user login/bookmarks).
- [ ] Verify DNS propagation with `nslookup toolwala.in`.
- [ ] Confirm direct URLs like `https://toolwala.in/exams` reload without a 404 (handled by Nginx `try_files`).
- [ ] Test file tools in HTTPS mode to ensure Web Workers & WebAssembly load securely.
