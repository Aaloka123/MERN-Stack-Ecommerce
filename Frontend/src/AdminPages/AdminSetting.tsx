import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import AdminNavbar from "../AdminComponent/AdminNavbar";
import { getAuthHeaders, getJsonAuthHeaders } from "../utils/authFetch";

const API = "http://localhost:5000/api/admin";

const AdminSetting: React.FC = () => {
  const [storeName, setStoreName] = useState("Aaloka Store");
  const [supportEmail, setSupportEmail] = useState("support@aaloka.com");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [orderNotification, setOrderNotification] = useState(true);
  const [storeClosed, setStoreClosed] = useState(false);
  const [storeStatusLoading, setStoreStatusLoading] = useState(true);
  const [storeStatusSaving, setStoreStatusSaving] = useState(false);

  const [errors, setErrors] = useState<{ storeName?: string; email?: string }>(
    {}
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    old?: string;
    next?: string;
    confirm?: string;
  }>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        const res = await fetch(`${API}/store-status`);
        const data = await res.json();
        if (res.ok && typeof data.storeClosed === "boolean") {
          setStoreClosed(data.storeClosed);
        }
      } catch {
        // keep default false
      } finally {
        setStoreStatusLoading(false);
      }
    };
    fetchStoreStatus();
  }, []);

  const handleToggleStoreClosed = async () => {
    const next = !storeClosed;
    setStoreStatusSaving(true);
    try {
      const res = await fetch(`${API}/store-status`, {
        method: "PUT",
        headers: getJsonAuthHeaders() as Record<string, string>,
        body: JSON.stringify({ storeClosed: next }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoreClosed(data.storeClosed);
        toast.success(next ? "Store is now closed" : "Store is now open");
      } else {
        toast.error("Failed to update store status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update store status");
    } finally {
      setStoreStatusSaving(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { storeName?: string; email?: string } = {};

    if (!storeName.trim()) nextErrors.storeName = "Store name is required";
    if (!supportEmail.trim()) {
      nextErrors.email = "Support email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
      nextErrors.email = "Enter a valid email";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Static demo: in a real app you would persist this to backend
    console.log("Admin settings saved", {
      storeName,
      supportEmail,
      lowStockThreshold,
      orderNotification,
      storeClosed,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: { old?: string; next?: string; confirm?: string } = {};
    if (!oldPassword.trim()) next.old = "Current password is required";
    if (!newPassword.trim()) {
      next.next = "New password is required";
    } else if (newPassword.length < 6) {
      next.next = "New password must be at least 6 characters";
    }
    if (!confirmPassword.trim()) {
      next.confirm = "Please confirm your new password";
    } else if (confirmPassword !== newPassword) {
      next.confirm = "Passwords do not match";
    }

    setPasswordErrors(next);
    if (Object.keys(next).length > 0) return;

    // Get current admin email from session
    let email = "";
    try {
      const raw = sessionStorage.getItem("currentUser");
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string; role?: string };
        if (parsed.email) email = parsed.email;
      }
    } catch {
      // ignore
    }

    if (!email) {
      toast.error("Admin email not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: getJsonAuthHeaders() as Record<string, string>,
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to change password");
        return;
      }

      toast.success("Admin password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f0ea]">
      <AdminNavbar />

      <main className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex items-center gap-3">
  
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b1b]">
              Admin settings
            </h1>

          </div>
        </header>

        <section className="w-full rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-4 sm:px-6 lg:px-8 py-7 space-y-7">



          {/* Security */}
          <div className="space-y-4 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:shield-lock-outline"
                className="text-[#7b1b2b]"
                width={18}
                height={18}
              />
              <h2 className="text-sm font-semibold text-[#2b1b1b]">
                Security
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Change your admin password to keep access secure.
            </p>

            <form
              onSubmit={handleChangePassword}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium">
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7b1b2b]/80 hover:text-[#7b1b2b]"
                  >
                    <Icon
                      icon={
                        showOldPassword
                          ? "mdi:eye-off-outline"
                          : "mdi:eye-outline"
                      }
                      width={18}
                      height={18}
                    />
                  </button>
                </div>
                {passwordErrors.old && (
                  <p className="mt-1 text-xs text-red-600">
                    {passwordErrors.old}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium">New password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7b1b2b]/80 hover:text-[#7b1b2b]"
                  >
                    <Icon
                      icon={
                        showNewPassword
                          ? "mdi:eye-off-outline"
                          : "mdi:eye-outline"
                      }
                      width={18}
                      height={18}
                    />
                  </button>
                </div>
                {passwordErrors.next && (
                  <p className="mt-1 text-xs text-red-600">
                    {passwordErrors.next}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#e2c9a5] bg-[#fdf7f0] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
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
                {passwordErrors.confirm && (
                  <p className="mt-1 text-xs text-red-600">
                    {passwordErrors.confirm}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 flex justify-center pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-[#7b1b2b] px-5 py-2 text-sm font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                >
                  UPDATE PASSWORD
                </button>
              </div>
            </form>
          </div>

          {/* Store status (last section) */}
          <div className="mt-8 pt-4 border-t border-[#efe3d5] space-y-2 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <Icon
                icon={storeClosed ? "mdi:store-off-outline" : "mdi:store-outline"}
                className="text-[#7b1b2b]"
                width={18}
                height={18}
              />
              <h2 className="text-sm font-semibold text-[#2b1b1b]">
                Store status
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              When closed, products stay visible but users cannot add to cart or proceed to checkout.
            </p>
            {storeStatusLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <button
                type="button"
                onClick={handleToggleStoreClosed}
                disabled={storeStatusSaving}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold tracking-[0.16em] text-white disabled:opacity-60
                ${
                  storeClosed
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Icon
                  icon={storeClosed ? "mdi:alert-circle-outline" : "mdi:check-circle-outline"}
                  width={16}
                  height={16}
                />
                {storeStatusSaving ? "Saving..." : storeClosed ? "STORE CLOSED" : "STORE OPEN"}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminSetting;