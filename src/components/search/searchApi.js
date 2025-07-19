// Utility to fetch users for search result
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
export async function fetchUsersBySearchParams(params) {
  const response = await fetch(`${API_BASE}/users/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  // Debug log
  console.log("fetchUsersBySearchParams response:", data);
  if (Array.isArray(data.users)) {
    return data.users;
  }
  return [];
}
