const API_URL = "http://localhost:8080";

interface FetchOptions extends RequestInit {
  token?: string | null;
}

async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  // Handle empty response
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return (await response.text()) as unknown as T;
}

export { apiFetch };

type UserData = { username: string; password: string };
type MotoData = Record<string, any>;
type FotoData = Record<string, any>;

export async function registerUser(data: UserData) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMotos(token: string) {
  return apiFetch("/motos", { token });
}

export async function getMotoById(id: string, token: string) {
  return apiFetch(`/motos/${id}`, { token });
}

export async function createMoto(data: MotoData, token: string) {
  return apiFetch("/motos", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function updateMoto(id: string, data: MotoData, token: string) {
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

export async function createFoto(data: FotoData, token: string) {
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
