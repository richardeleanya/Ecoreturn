import axios from "axios";
import type {
  User,
  Product,
  Return,
  ReturnPhoto,
  Wallet,
  Transaction,
  Campaign,
  PartnerLocation,
} from "shared";

const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    : (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:3000";

export const api = axios.create({
  baseURL: baseURL + "/api/v1",
  withCredentials: true,
});

export const auth = {
  async register(payload: { email: string; password: string }) {
    return api.post("/auth/register", payload).then((r) => r.data);
  },
  async login(payload: { email: string; password: string }) {
    return api.post("/auth/login", payload).then((r) => r.data);
  },
  async refresh() {
    return api.post("/auth/refresh").then((r) => r.data);
  },
  async logout() {
    return api.post("/auth/logout").then((r) => r.data);
  },
  async profile(): Promise<{ user: User }> {
    return api.get("/auth/profile").then((r) => r.data);
  },
};

export const products = {
  async list(): Promise<Product[]> {
    return api.get("/products").then((r) => r.data);
  },
  async byBarcode(barcode: string): Promise<Product | null> {
    return api.get("/products/by-barcode", { params: { barcode } }).then((r) => r.data);
  },
};

export const scan = {
  async validate(barcode: string) {
    return api.post("/scan/validate", { barcode }).then((r) => r.data);
  },
};

export const uploads = {
  async uploadPhoto(file: File | Blob): Promise<ReturnPhoto> {
    const form = new FormData();
    form.append("photo", file);
    return api
      .post("/uploads/photos", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

export const returns = {
  async create(payload: {
    barcode: string;
    photoId: string;
    gpsLat: number;
    gpsLng: number;
    deviceId: string;
  }): Promise<Return> {
    return api.post("/returns/create", payload).then((r) => r.data);
  },
  async history(): Promise<Return[]> {
    return api.get("/returns/history").then((r) => r.data);
  },
  async status(id: string): Promise<Return> {
    return api.get(`/returns/${id}/status`).then((r) => r.data);
  },
};

export const wallet = {
  async balance(): Promise<{ balancePence: number }> {
    return api.get("/rewards/balance").then((r) => r.data);
  },
  async history(): Promise<Transaction[]> {
    return api.get("/rewards/history").then((r) => r.data);
  },
  async withdraw(amountPence: number) {
    return api.post("/rewards/withdraw", { amountPence }).then((r) => r.data);
  },
  async challenges() {
    return api.get("/rewards/challenges").then((r) => r.data);
  },
};

export const locations = {
  async nearby(lat: number, lng: number, radiusKm: number): Promise<PartnerLocation[]> {
    return api
      .get("/locations/nearby", { params: { lat, lng, radiusKm } })
      .then((r) => r.data);
  },
  async search(q: string): Promise<PartnerLocation[]> {
    return api.get("/locations/search", { params: { q } }).then((r) => r.data);
  },
  async get(id: string): Promise<PartnerLocation> {
    return api.get(`/locations/${id}`).then((r) => r.data);
  },
};

export const campaigns = {
  async create(payload: { brandId: string; name: string; startAt: string; endAt: string; rewardPerItem: number }) {
    return api.post("/campaigns", payload).then((r) => r.data);
  },
  async list(brandId: string) {
    return api.get("/campaigns", { params: { brandId } }).then((r) => r.data);
  },
  async get(id: string) {
    return api.get(`/campaigns/${id}`).then((r) => r.data);
  },
};

export const users = {
  async list(): Promise<User[]> {
    return api.get("/users").then((r) => r.data);
  },
};