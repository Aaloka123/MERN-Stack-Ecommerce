export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = sessionStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const getJsonAuthHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  } as Record<string, string>;
};

