#!/bin/bash

# AuthenticaDetector - Automated Deployment Script
# This script deploys your app to Cloudflare Pages with one command

set -e  # Exit on error

echo "🚀 AuthenticaDetector Deployment Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo -e "${RED}Error: git is not installed${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}Error: npm is not installed${NC}" >&2; exit 1; }

echo -e "${YELLOW}Step 1: Installing Wrangler CLI...${NC}"
npm install -g wrangler

echo -e "${GREEN}✓ Wrangler installed${NC}"
echo ""

echo -e "${YELLOW}Step 2: Cloudflare Authentication${NC}"
echo "This will open a browser window to authenticate with Cloudflare"
wrangler login

echo -e "${GREEN}✓ Authenticated with Cloudflare${NC}"
echo ""

echo -e "${YELLOW}Step 3: Creating KV Namespaces...${NC}"
RATE_LIMIT_KV=$(wrangler kv:namespace create "authenticadetector-rate-limit" --preview false | grep "id =" | cut -d'"' -f2)
LEARNING_KV=$(wrangler kv:namespace create "authenticadetector-learning" --preview false | grep "id =" | cut -d'"' -f2)
STATS_KV=$(wrangler kv:namespace create "authenticadetector-stats" --preview false | grep "id =" | cut -d'"' -f2)

echo -e "${GREEN}✓ KV Namespaces created${NC}"
echo "  RATE_LIMIT_KV: $RATE_LIMIT_KV"
echo "  LEARNING_KV: $LEARNING_KV"
echo "  STATS_KV: $STATS_KV"
echo ""

echo -e "${YELLOW}Step 4: Setting up Git repository...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

# Create .gitignore if it doesn't exist
cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
*.log
.wrangler/
dist/
EOF

echo -e "${GREEN}✓ .gitignore created${NC}"
echo ""

echo -e "${YELLOW}Step 5: Supabase Credentials${NC}"
echo "Please provide your Supabase credentials:"
echo ""
read -p "Supabase Project URL (https://xxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY

echo ""
echo -e "${YELLOW}Updating index.html with Supabase credentials...${NC}"
sed -i.bak "s|const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';|const SUPABASE_URL = '$SUPABASE_URL';|" index.html
sed -i.bak "s|const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';|const SUPABASE_ANON_KEY = '$SUPABASE_ANON_KEY';|" index.html
rm index.html.bak

echo -e "${GREEN}✓ Credentials updated${NC}"
echo ""

echo -e "${YELLOW}Step 6: Committing code...${NC}"
git add .
git commit -m "Initial deployment - AuthenticaDetector v12" || echo "Nothing to commit"

echo -e "${GREEN}✓ Code committed${NC}"
echo ""

echo -e "${YELLOW}Step 7: Deploying to Cloudflare Pages...${NC}"
wrangler pages project create authenticadetector || echo "Project may already exist"
wrangler pages deploy . --project-name=authenticadetector

echo -e "${GREEN}✓ Deployed to Cloudflare Pages!${NC}"
echo ""

echo -e "${YELLOW}Step 8: Binding KV Namespaces to Functions...${NC}"
echo "Run these commands manually (Wrangler doesn't support this via CLI yet):"
echo ""
echo "Go to: https://dash.cloudflare.com"
echo "Navigate to: Pages → authenticadetector → Settings → Functions"
echo "Add KV namespace bindings:"
echo "  Variable: RATE_LIMIT_KV  → Namespace: $RATE_LIMIT_KV"
echo "  Variable: LEARNING_KV    → Namespace: $LEARNING_KV"
echo "  Variable: STATS_KV       → Namespace: $STATS_KV"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your app is live at:"
echo "https://authenticadetector.pages.dev"
echo ""
echo "Next steps:"
echo "1. Bind KV namespaces manually (see Step 8 above)"
echo "2. Run Supabase schema (see DEPLOYMENT.md Part 1.2)"
echo "3. Test your app!"
echo ""
echo "For custom domain setup, see DEPLOYMENT.md Part 4"
