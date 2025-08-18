"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <header className="w-full flex justify-between items-center p-4 bg-blue-50 shadow-sm">
      <div className="font-bold text-xl">EcoReturn Brand Dashboard</div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </header>
  );
}