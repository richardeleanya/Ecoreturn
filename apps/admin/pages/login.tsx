import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (e) {
      setError("Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white rounded-lg shadow p-6 w-96 space-y-4">
        <h2 className="text-xl font-bold mb-2">Admin Login</h2>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="w-full bg-gray-700 text-white rounded py-2">Log In</button>
      </form>
    </div>
  );
}