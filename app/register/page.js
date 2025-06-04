"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error || "Something went wrong",
        });
        return;
      }

      setSuccess(data.message);
      setForm({ name: "", email: "", password: "" });

      await Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err) {
      setError("Network error");
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Network error",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="bg-[url('/login-bg.png')] bg-center bg-cover flex-1">
        <div className="flex-1 place-items-center flex justify-center h-screen flex-col px-6 py-8">
          <Image
            src={"/login-img.png"}
            width={350}
            height={308}
            alt="login-img"
          />
          <h1 className="text-[32px] text-[#002058] font-semibold text-center my-6">
            Welcome to The User Management App
          </h1>
          <p className="text-[14px] text-center text-[#002058]">
            Manage your users efficiently. Login to access your dashboard, view
            user activity, and control user access securely.
          </p>
        </div>
      </div>
      <div className="flex-1 place-items-center flex justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-[28px] mb-8 text-[#002058] font-semibold text-center">
            Register
          </h2>
          <form
            onSubmit={handleSubmit}
            className=" p-6 w-full max-w-md space-y-4"
          >
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <label className="mb-2 w-full text-[#685F78] font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <label className="mb-2 w-full text-[#685F78] font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <label className="mb-2 w-full text-[#685F78] font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />

            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md w-full cursor-pointer"
            >
              Register
            </button>
          </form>
          <div className=" mt-3 text-center ">
            <p className="mb-0">
              Already have an account ?
              <a className="text-red-600" href="/login">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
