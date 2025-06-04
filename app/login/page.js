"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "Something went wrong!",
        });
        return;
      }

      localStorage.setItem("token", data.token);
      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login successful",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong.");
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };
  return (
    <>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>
          </div>
        </div>
        <div className="flex-1 place-items-center flex justify-center bg-white">
          <div className="w-full max-w-md p-8">
            <h2 className="text-[28px] mb-8 text-[#002058] font-semibold text-center">
              Login to your account
            </h2>
            <form onSubmit={handleSubmit}>
              <label className="mb-2 w-full text-[#685F78] font-medium">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-1 border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none"
              />
              <label className="mb-2 w-full text-[#685F78] font-medium">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-1 border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md w-full cursor-pointer"
              >
                Login
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
            <div className=" mt-3 text-center ">
              <p className="mb-0">
                New User ?{" "}
                <a className="text-red-600" href="/register">
                  Create an Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
