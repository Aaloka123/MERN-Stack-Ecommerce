import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";

type StoredUser = {
  id?: string;
  // for older local users
  fullName?: string;
  // for backend users
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

const getCurrentUser = (): StoredUser | null => {
  try {
    const raw = sessionStorage.getItem("currentUser");
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
};

const getInitials = (name?: string) => {
  if (!name) return "A";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last || first).toUpperCase();
};

const Profile: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [loaded, setLoaded] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
  }>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    old?: string;
    next?: string;
    confirm?: string;
  }>({});

  const loadFromStorage = () => {
    const user = getCurrentUser();
    if (user) {
      // prefer backend `name`, fall back to older `fullName`
      setFullName(user.name || user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setRole(user.role || "user");
    }
  };

  useEffect(() => {
    loadFromStorage();
    setLoaded(true);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: {
      fullName?: string;
      email?: string;
      phone?: string;
    } = {};
    if (!fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email";
    }
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      nextErrors.phone = "Phone must be a 10 digit number";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const current = getCurrentUser() || {};

    // 1) update profile (name, email, phone) in backend
    try {
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: current.email || email,
          name: fullName,
          newEmail: email,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
        return;
      }

      const updated: StoredUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role,
      };
      sessionStorage.setItem("currentUser", JSON.stringify(updated));
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
      return;
    }

    setIsEditing(false);
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

    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to change password");
        return;
      }
      toast.success("Password changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("ROLE");
    window.location.href = "/login";
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Delete your account permanently?")) return;

    const current = getCurrentUser();

    try {
      const rawUsers = localStorage.getItem("users");
      if (current && rawUsers) {
        const users = JSON.parse(rawUsers) as Array<any>;
        const remaining = users.filter(
          (u) =>
            !(u.email && current.email && u.email === current.email) &&
            !(u.fullName && current.fullName && u.fullName === current.fullName)
        );
        localStorage.setItem("users", JSON.stringify(remaining));
      }
    } catch {
      // ignore failures
    }

    // Delete from backend if we have an id
    if (current?.id) {
      fetch(`http://localhost:5000/api/admin/users/${current.id}`, {
        method: "DELETE",
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            toast.error(data.message || "Failed to delete account");
            return;
          }
          toast.success("Account deleted");
        })
        .catch(() => {
          toast.error("Failed to delete account");
        });
    }

    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("ROLE");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#fdedd6] flex flex-col">
      <Header />

      <main className="flex-1 px-6 lg:px-20 py-10 flex justify-center">
        <div className="w-full max-w-2xl rounded-2xl bg-[#f7ddbc] shadow-md px-8 py-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7b1b2b]">
            My profile
          </h1>
          <p className="mt-1 text-sm text-gray-700">
            View the details linked to your Aaloka account.
          </p>

          {loaded && (fullName || email) ? (
            isEditing ? (
              <form
                onSubmit={handleSave}
                className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start"
              >
                {/* Avatar and basic info */}
                <div className="flex flex-col items-center sm:items-start gap-4 sm:w-1/3">
                  <div className="h-20 w-20 rounded-full bg-[#fdedd6] flex items-center justify-center text-lg font-semibold text-[#7b1b2b] shadow-sm">
                    {getInitials(fullName)}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {fullName || "Aaloka customer"}
                    </p>
                  </div>
                </div>

                {/* Editable details (name, email, phone) */}
                <div className="flex-1 space-y-4 text-sm text-gray-900">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                      Full name
                    </p>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                      Email address
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                      Phone number
                    </p>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                        )
                      }
                      className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                      placeholder="10 digit mobile"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                    >
                      <Icon icon="mdi:content-save-outline" width={16} height={16} />
                      SAVE CHANGES
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loadFromStorage();
                        setErrors({});
                        setIsEditing(false);
                      }}
                      className="rounded-full border border-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
                {/* Avatar and role (view mode) */}
                <div className="flex flex-col items-center sm:items-start gap-4 sm:w-1/3">
                  <div className="h-20 w-20 rounded-full bg-[#fdedd6] flex items-center justify-center text-lg font-semibold text-[#7b1b2b] shadow-sm">
                    {getInitials(fullName)}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {fullName || "Aaloka customer"}
                    </p>
                  </div>
                </div>

                {/* Readonly details with actions */}
                <div className="flex-1 space-y-4 text-sm text-gray-900">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                      Full name
                    </p>
                    <p className="mt-1 rounded-lg bg-[#fdedd6] px-3 py-2">
                      {fullName || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                      Email address
                    </p>
                    <p className="mt-1 rounded-lg bg-[#fdedd6] px-3 py-2 break-words">
                      {email || "Not set"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                      Phone number
                    </p>
                    <p className="mt-1 rounded-lg bg-[#fdedd6] px-3 py-2 break-words">
                      {phone || "Not set"}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                    >
                      <Icon icon="mdi:pencil-outline" width={16} height={16} />
                      EDIT PROFILE
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="mt-8 rounded-2xl bg-[#fdedd6] px-4 py-6 text-sm text-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p>
                You are not logged in. Log in or create an account to view your
                profile and order history.
              </p>
              <div className="flex gap-3">
                <a
                  href="/login"
                  className="rounded-full bg-[#7b1b2b] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                >
                  LOG IN
                </a>
                <a
                  href="/signup"
                  className="rounded-full border border-[#7b1b2b] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
                >
                  SIGN UP
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Separate change password section */}
      {loaded && (fullName || email) && (
        <section className="px-6 lg:px-20 pb-6">
          <div className="w-full max-w-2xl mx-auto rounded-2xl bg-[#f7ddbc] shadow-md px-8 py-8 mt-4 space-y-4">
            <h2 className="text-lg font-extrabold text-[#7b1b2b]">
              Change password
            </h2>
            <p className="text-sm text-gray-700">
              Update the password for your Aaloka account.
            </p>

            <form
              onSubmit={handleChangePassword}
              className="space-y-4 text-sm text-gray-900"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                  Current password
                </p>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 pr-10 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
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

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                  New password
                </p>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 pr-10 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
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

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                  Confirm new password
                </p>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 pr-10 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
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

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                >
                  <Icon icon="mdi:lock-reset" width={16} height={16} />
                  CHANGE PASSWORD
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
      {loaded && (fullName || email) && (
        <section className="px-6 lg:px-20 pb-10">
          <div className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
            >
              <Icon icon="mdi:logout-variant" width={16} height={16} />
              LOG OUT
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 rounded-full border border-red-500 px-5 py-2 text-xs font-semibold tracking-[0.16em] text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              <Icon icon="mdi:trash-can-outline" width={16} height={16} />
              DELETE ACCOUNT
            </button>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Profile;