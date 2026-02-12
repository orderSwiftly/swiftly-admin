"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PulseLoader from "@/components/pulse-loader";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;

      if (!api_url) {
        console.warn(
          "API URL not configured. Using mock login for development.",
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));

        localStorage.setItem("token", "mock-token-for-development");
        toast.success("Login successful! (Development Mode)");
        router.push("/dashboard");
        return;
      }

      const res = await fetch(`${api_url}/api/v1/auth/super-admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Server error: Invalid response format. API endpoint may not be configured.",
        );
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message ?? "Login failed");

      localStorage.setItem("token", data.data.superAdmin.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        toast.error(err.message ?? "Error logging in");
      } else {
        toast.error("Error logging in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <span className="bg-green-600 text-white text-sm font-medium px-8 py-2 rounded-full">
            Login
          </span>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Image
              src="/brand-logo.png"
              alt="Swiftly Logo"
              width={100}
              height={100}
              priority
            />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-sm text-right">
              <Link
                href="/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center bg-[#669917] hover:bg-[#557a13] text-white py-2.5 rounded-lg transition font-medium h-[44px] cursor-pointer"
              disabled={loading}
            >
              {loading ? <PulseLoader /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
