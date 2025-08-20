export interface User {
  id: string;
  email: string;
  role: "CONSUMER" | "BRAND" | "PARTNER" | "ADMIN";
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  postcode?: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  sku?: string;
  packageType: string;
  brandId: string;
  imageUrl?: string;
}

export interface Return {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rewardPence: number;
  productId: string;
  scannedAt: string;
  approvedAt?: string;
  gpsLat: number;
  gpsLng: number;
  deviceId: string;
  photoId?: string;
  fraudReview: boolean;
  fraudScore: number;
  createdAt: string;
}

export interface ReturnPhoto {
  id: string;
  url: string;
  hash: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balancePence: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: "CREDIT" | "DEBIT";
  amountPence: number;
  refType: "RETURN" | "WITHDRAWAL" | "ADJUSTMENT";
  refId: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  startAt: string;
  endAt: string;
  rewardPerItem: string;
  status: "ACTIVE" | "PAUSED" | "ENDED";
  createdAt: string;
}

export interface PartnerLocation {
  id: string;
  brandId?: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  lat: number;
  lng: number;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}