export const fetcher = (url) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
    credentials: "include",
  }).then((res) => res.json())
