/** Ping API health to wake Render (free tier sleeps after ~15 min idle). */
export function getApiBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5026/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function wakeApi() {
  const url = `${getApiBaseUrl()}/health`;
  fetch(url, { mode: 'no-cors', cache: 'no-store' }).catch(() => {});
}
