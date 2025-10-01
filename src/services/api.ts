const API_URL = "http://localhost:5000/api"; // Ajustado para HTTP e porta 5000 // Ajustar para a URL do seu backend .NET

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
    const errorData = await response.json();
    throw new Error(errorData.message || `Erro na API: ${response.status}`);
  }

  return response.json();
}

// -------- Métodos de Autenticação --------
export async function registerUser(username: string, password: string) {
  return apiFetch("/Auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginUser(username: string, password: string) {
  return apiFetch("/Auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// -------- Métodos CRUD para Motos --------

export async function apiGetMotos(token?: string | null) {
  return apiFetch("/Motos", { method: "GET", token });
}

export async function apiPostMoto(data: any, token?: string | null) {
  return apiFetch("/Motos", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function apiPutMoto(id: number, data: any, token?: string | null) {
  return apiFetch(`/Motos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

export async function apiDeleteMoto(id: number, token?: string | null) {
  return apiFetch(`/Motos/${id}`, { method: "DELETE", token });
}

