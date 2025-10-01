// Descubra seu IP local com "ipconfig" (Windows) ou "ifconfig" (Linux/Mac)
const API_URL = "http://172.16.70.70:5000/api"; // troque pelo seu IP real

interface FetchOptions extends RequestInit {
  token?: string | null;
}

async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { token, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }

  return response.json();
}

// 🔹 Helpers específicos da API
export async function registerUser(data: any) {
  return apiFetch("/Auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: any) {
  return apiFetch("/Auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export { apiFetch };