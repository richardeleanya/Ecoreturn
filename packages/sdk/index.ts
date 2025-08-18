import axios, { AxiosRequestConfig, AxiosError } from "axios";
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

let _token: string | undefined = undefined;

export const authStore = {
  setToken(token?: string) {
    _token = token || undefined;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    }
  },
  getToken(): string | undefined {
    if (_token) return _token;
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      _token = t || undefined;
      return _token;
    }
    return undefined;
  },
};

const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    : (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:3000";

export const api = axios.create({
  baseURL: baseURL + "/api/v1",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err?: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else {
      if (token && prom.config.headers)
        prom.config.headers["Authorization"] = "Bearer " + token;
      prom.resolve(prom.config);
    }
  });
  failedQueue = [];
}

api.interceptors.request.use(
  (config) => {
    const token = authStore.getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      isRefreshing = true;
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        authStore.setToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: "Bearer " + data.accessToken,
        };
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authStore.setToken(undefined);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  async register(payload: { email: string; password: string }) {
    return api.post("/auth/register", payload).then((r) => r.data);
  },
  async login(payload: { email: string; password: string }) {
    const res = await api.post("/auth/login", payload);
    if (res.data.accessToken) authStore.setToken(res.data.accessToken);
    return res.data;
  },
  async refresh() {
    const res = await api.post("/auth/refresh");
    if (res.data.accessToken) authStore.setToken(res.data.accessToken);
    return res.data;
  },
  async logout() {
    authStore.setToken(undefined);
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

export const analytics = {
  async brand(brandId?: string, days?: number) {
    return api.get("/analytics/brand", { params: { brandId, days } }).then((r) => r.data);
  },
  async admin(days?: number) {
    return api.get("/analytics/admin", { params: { days } }).then((r) => r.data);
  },
};

export const admin = {
  brands: {
    async list() {
      return api.get("/admin/brands").then((r) => r.data);
    },
    async create(data: any) {
      return api.post("/admin/brands", data).then((r) => r.data);
    },
    async update(id: string, data: any) {
      return api.put(`/admin/brands/${id}`, data).then((r) => r.data);
    },
    async remove(id: string) {
      return api.delete(`/admin/brands/${id}`).then((r) => r.data);
    },
  },
  locations: {
    async list() {
      return api.get("/admin/locations").then((r) => r.data);
    },
    async create(data: any) {
      return api.post("/admin/locations", data).then((r) => r.data);
    },
    async update(id: string, data: any) {
      return api.put(`/admin/locations/${id}`, data).then((r) => r.data);
    },
    async remove(id: string) {
      return api.delete(`/admin/locations/${id}`).then((r) => r.data);
    },
  },
  products: {
    async list() {
      return api.get("/admin/products").then((r) => r.data);
    },
    async create(data: any) {
      return api.post("/admin/products", data).then((r) => r.data);
    },
    async update(id: string, data: any) {
      return api.put(`/admin/products/${id}`, data).then((r) => r.data);
    },
    async remove(id: string) {
      return api.delete(`/admin/products/${id}`).then((r) => r.data);
    },
  },
};