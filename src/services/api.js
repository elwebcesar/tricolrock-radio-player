/**
 * Petición autenticada genérica
 * @param {string} url
 * @returns {Promise<any>}
 */
export async function fetchWithAuth(url,API_KEY) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${API_KEY}`);
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
