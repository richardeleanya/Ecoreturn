# EcoReturn Brand Dashboard

## Overview

Brand-facing dashboard for managing product returns, campaigns, and analytics.

## Getting Started

1. Install dependencies (from monorepo root):

   ```bash
   npm install
   ```

2. Copy and edit the environment variables:

   ```bash
   cp .env.example .env
   ```

   Add the following (as needed):

   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.ecoreturn.com
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=changeme
   ```

3. Run the app:

   ```bash
   npm run dev --workspace=brand-dashboard
   ```

## Features

- Brand login (JWT, next-auth)
- SSR-protected dashboard (/dashboard, /campaigns, /products, /reports, /settings)
- Dashboard widgets: returns volume, spend, ROI
- Campaign management: list/create
- Product barcode/SKU registration
- Basic charts (placeholder)
- Uses shared UI/types/sdk

## Testing

```bash
npm run test --workspace=brand-dashboard
```