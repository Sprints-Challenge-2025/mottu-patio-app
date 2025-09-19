const API_URL = "https://localhost:5001/api";

interface FetchOptions extends RequestInit {
  token?: string | null;
}

async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const { token, ...rest } = options;

  // ✅ Garante que sempre seja HeadersInit válido
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  return response.json();
}

// -------- Métodos CRUD exemplo --------

export async function apiGet(token?: string | null) {
  return apiFetch("/motos", { method: "GET", token });
}

export async function apiPost(data: any, token?: string | null) {
  return apiFetch("/motos", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function apiPut(id: number, data: any, token?: string | null) {
  return apiFetch(`/motos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

export async function apiDelete(id: number, token?: string | null) {
  return apiFetch(`/motos/${id}`, { method: "DELETE", token });
}
