import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import google from "../assets/google.svg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Placeholder for real auth call
      console.log("Logging in with", formData);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdedd6] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-[#f7ddbc] shadow-md px-8 py-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7b1b2b] text-center">
            Log in
          </h1>
          <p className="mt-2 text-center text-sm text-gray-700">
            New to Aaloka?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#7b1b2b] underline underline-offset-2"
            >
              Create an account
            </Link>
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 text-sm text-gray-800"
          >
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7b1b2b]/80 hover:text-[#7b1b2b]"
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                    width={18}
                    height={18}
                  />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-xs text-gray-700 hover:text-[#7b1b2b] underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#7b1b2b] py-3 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
            >
              LOG IN
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
              <img src={google} alt="Google login" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;