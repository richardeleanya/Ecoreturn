# EcoReturn Partner Portal

## Overview

Portal for collection/processing partners to manage returns, review/approve items, and monitor payouts.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Env setup:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.ecoreturn.com
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=changeme
   ```

3. Run the app:

   ```bash
   npm run dev --workspace=partner-portal
   ```

## Features

- Partner login (JWT, next-auth)
- Dashboard: throughput, capacity metrics
- Processing: scan/search returns, approve/reject
- Payouts, Support section
- Protected routes
- Shared UI/types/sdk

## Testing

```bash
npm run test --workspace=partner-portal
```