import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import google from "../assets/google.svg";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10 digit number";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdedd6] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-[#f7ddbc] shadow-md px-8 py-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7b1b2b] text-center">
            Create account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-700">
            Already with Aaloka?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#7b1b2b] underline underline-offset-2"
            >
              Log in
            </Link>
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 text-sm text-gray-800"
          >
            <div>
              <label className="block mb-1 font-medium">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                placeholder="Your name"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone number</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
                }
                className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                placeholder="10 digit mobile"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7b1b2b]/80 hover:text-[#7b1b2b]"
                >
                  <Icon
                    icon={
                      showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                    }
                    width={18}
                    height={18}
                  />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  placeholder="Re‑enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7b1b2b]/80 hover:text-[#7b1b2b]"
                >
                  <Icon
                    icon={
                      showConfirmPassword
                        ? "mdi:eye-off-outline"
                        : "mdi:eye-outline"
                    }
                    width={18}
                    height={18}
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#7b1b2b] py-3 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
            >
              SIGN UP
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs text-gray-600">
            <span className="h-px flex-1 bg-[#e2c9a5]" />
            <span>OR CONTINUE WITH</span>
            <span className="h-px flex-1 bg-[#e2c9a5]" />
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fdedd6] shadow-sm hover:shadow-md transition-shadow"
            >
              <img src={google} alt="Google signup" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;