# Custom Domain Setup: authenticadetector.com

**Issue:** Domain returns 522 error (Cloudflare connection timeout)
**Cause:** Domain not configured in Cloudflare Pages project
**Estimated Time:** 5-10 minutes

---

## Prerequisites

- ✅ Domain purchased: authenticadetector.com (you mentioned you paid for it)
- ✅ Cloudflare account access
- ✅ Pages project exists: authenticadetector-v7

---

## Step-by-Step Setup

### 1. Access Cloudflare Pages Dashboard

```
URL: https://dash.cloudflare.com/pages
```

1. Log in to Cloudflare
2. Navigate to **Workers & Pages** (left sidebar)
3. Click on project: **authenticadetector-v7**

### 2. Add Custom Domain

1. Click **"Custom domains"** tab at the top
2. Click **"Set up a custom domain"** button
3. Enter domain: `authenticadetector.com`
4. Click **"Continue"**

### 3. Configure DNS (Two Options)

**Option A: Cloudflare-Managed DNS (Recommended)**
- If your domain DNS is managed by Cloudflare:
  - Cloudflare will automatically create CNAME record
  - No manual DNS changes needed
  - Click **"Activate domain"**

**Option B: External DNS**
- If DNS is managed elsewhere (GoDaddy, Namecheap, etc.):
  - Add CNAME record at your DNS provider:
    ```
    Type: CNAME
    Name: @  (or leave blank for root domain)
    Value: authenticadetector-v7.pages.dev
    TTL: Auto or 3600
    ```
  - Add CNAME for www subdomain:
    ```
    Type: CNAME
    Name: www
    Value: authenticadetector-v7.pages.dev
    TTL: Auto or 3600
    ```
  - Return to Cloudflare, click **"Check DNS"**

### 4. SSL Certificate Provisioning

- Cloudflare automatically provisions SSL certificate
- Wait **2-5 minutes** for certificate to activate
- Status will show: ✅ **Active**

### 5. Verify Domain Works

Test URLs:
```bash
# Should load the app:
https://authenticadetector.com

# Should also work:
https://www.authenticadetector.com

# Old URL still works:
https://authenticadetector-v7.pages.dev
```

---

## Troubleshooting

**522 Error Persists After Setup?**
- Wait 5 more minutes (DNS propagation)
- Clear browser cache: Ctrl+Shift+Delete
- Try incognito/private browsing mode
- Check DNS propagation: https://dnschecker.org

**"Domain already in use" Error?**
- Domain may be attached to different Cloudflare account
- Contact Cloudflare support to transfer domain

**SSL Certificate Pending?**
- Wait up to 24 hours for certificate validation
- Ensure DNS records are correct
- Check CAA records don't block Let's Encrypt

---

## Post-Setup Actions

### Update All Links to Use Custom Domain

**Files to update:**
- `index.html` - Update any hardcoded authenticadetector-v7.pages.dev URLs
- `manifest.json` - Update `start_url` and `scope`
- Social meta tags (`og:url`, `twitter:url`)
- Sitemap (if exists)

### Enable WWW Redirect (Optional)

In Cloudflare Pages settings:
1. Go to **Custom domains**
2. Click **⚙️** next to www.authenticadetector.com
3. Enable **"Redirect www to apex"** (or vice versa)

---

## SEO Benefits (Why This Matters)

✅ **Branding:** authenticadetector.com is professional, memorable
✅ **Trust:** Custom domain increases user confidence
✅ **SEO:** Google ranks custom domains higher than *.pages.dev subdomains
✅ **Analytics:** Easier to track with custom domain
✅ **Shareability:** Clean URLs for social media

---

## Current Status

- **Domain:** authenticadetector.com (purchased ✅)
- **Hosting:** Cloudflare Pages (authenticadetector-v7)
- **DNS:** ❌ Not configured yet
- **SSL:** ⏳ Will auto-provision after DNS setup
- **Estimated Fix Time:** 10 minutes

---

## Next Steps After Domain Works

1. Update `index.html` meta tags with new domain
2. Submit sitemap to Google Search Console
3. Set up Google Analytics with custom domain
4. Update social media links to use authenticadetector.com
5. Add domain to README.md

