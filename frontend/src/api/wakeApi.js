/** Wake API via same-origin /health proxy on Vercel (works when Render is blocked locally). */
export function wakeApi() {
  const envUrl = import.meta.env.VITE_API_URL;
  const useProxy = import.meta.env.PROD && (!envUrl || envUrl.includes('onrender.com'));
  const url = useProxy ? '/health' : `${(envUrl || 'http://localhost:5026/api').replace(/\/api\/?$/, '')}/health`;
  fetch(url, { mode: useProxy ? 'cors' : 'no-cors', cache: 'no-store' }).catch(() => {});
}
