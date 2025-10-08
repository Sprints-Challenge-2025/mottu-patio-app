// Descubra seu IP local com "ipconfig" (Windows) ou "ifconfig" (Linux/Mac)
const API_URL = "http://localhost:8080"; // URL do backend Java

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


export { apiFetch };

export async function getMotos(token: string) {
  return apiFetch("/motos", { token });
}

export async function getMotoById(id: string, token: string) {
  return apiFetch(`/motos/${id}`, { token });
}

export async function createMoto(data: any, token: string) {
  return apiFetch("/motos", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function updateMoto(id: string, data: any, token: string) {
  return apiFetch(`/motos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteMoto(id: string, token: string) {
  return apiFetch(`/motos/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function getFotos(token: string) {
  return apiFetch("/fotos", { token });
}

export async function getFotoById(id: string, token: string) {
  return apiFetch(`/fotos/${id}`, { token });
}

export async function createFoto(data: any, token: string) {
  return apiFetch("/fotos", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteFoto(id: string, token: string) {
  return apiFetch(`/fotos/${id}`, {
    method: "DELETE",
    token,
  });
}

