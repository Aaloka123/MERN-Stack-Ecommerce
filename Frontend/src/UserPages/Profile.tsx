import React, { useEffect, useState } from "react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";

type StoredUser = {
  fullName?: string;
  email?: string;
  role?: string;
};

const getCurrentUser = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem("currentUser");
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
  const [role, setRole] = useState("user");
  const [loaded, setLoaded] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  const loadFromStorage = () => {
    const user = getCurrentUser();
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
    }
  };

  useEffect(() => {
    loadFromStorage();
    setLoaded(true);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: {
      fullName?: string;
      email?: string;
      password?: string;
    } = {};
    if (!fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email";
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        nextErrors.password = "Password must be at least 6 characters";
      } else if (newPassword !== confirmPassword) {
        nextErrors.password = "Passwords do not match";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const current = getCurrentUser() || {};
    const updated: StoredUser & { password?: string } = {
      ...current,
      fullName,
      email,
      role: role || current.role,
      ...(newPassword ? { password: newPassword } : {}),
    };
    localStorage.setItem("currentUser", JSON.stringify(updated));

    // Also update in 'users' list if present
    try {
      const rawUsers = localStorage.getItem("users");
      if (rawUsers) {
        const users = JSON.parse(rawUsers) as Array<any>;
        const idx = users.findIndex(
          (u) =>
            (u.email && u.email === current.email) ||
            (u.fullName && u.fullName === current.fullName)
        );
        if (idx !== -1) {
          users[idx] = {
            ...users[idx],
            fullName,
            email,
            ...(newPassword ? { password: newPassword } : {}),
          };
          localStorage.setItem("users", JSON.stringify(users));
        }
      }
    } catch {
      // ignore if users is missing or invalid
    }

    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("ROLE");
    window.location.href = "/login";
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Delete your account permanently?")) return;

    try {
      const current = getCurrentUser();
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

    localStorage.removeItem("currentUser");
    localStorage.removeItem("ROLE");
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

          {loaded && fullName ? (
            isEditing ? (
              <form
                onSubmit={handleSave}
                className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start"
              >
                {/* Avatar and role */}
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

                {/* Editable details */}
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
                      New password
                    </p>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b1b2b]/80">
                      Confirm new password
                    </p>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-[#fdedd6] px-3 py-2 border border-[#e2c9a5] focus:outline-none focus:ring-2 focus:ring-[#7b1b2b]"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="rounded-full bg-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                      >
                        SAVE CHANGES
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          loadFromStorage();
                          setNewPassword("");
                          setConfirmPassword("");
                          setErrors({});
                          setIsEditing(false);
                        }}
                        className="rounded-full border border-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-full border border-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
                      >
                        LOG OUT
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="rounded-full border border-red-500 px-5 py-2 text-xs font-semibold tracking-[0.16em] text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        DELETE ACCOUNT
                      </button>
                    </div>
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

                  <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-full bg-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors"
                    >
                      EDIT PROFILE
                    </button>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-full border border-[#7b1b2b] px-5 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
                      >
                        LOG OUT
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="rounded-full border border-red-500 px-5 py-2 text-xs font-semibold tracking-[0.16em] text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        DELETE ACCOUNT
                      </button>
                    </div>
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

      <Footer />
    </div>
  );
};

export default Profile;