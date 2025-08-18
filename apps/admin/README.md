# EcoReturn Admin App

## Overview

Admin dashboard for user, brand, location, campaign, fraud monitoring, and system settings.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Env setup:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.ecoreturn.com
   NEXTAUTH_URL=http://localhost:3002
   NEXTAUTH_SECRET=changeme
   ```

3. Run the app:

   ```bash
   npm run dev --workspace=admin
   ```

## Features

- Admin login (JWT-protected, ADMIN role)
- Manage users, brands, locations, campaigns
- Fraud/risk dashboard
- System settings
- Protected routes, SSR
- Shared UI/types/sdk

## Testing

```bash
npm run test --workspace=admin
```