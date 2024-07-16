export function checkAuthenticated() {
  const cookies = document.cookie;

  const isAuthenticated = cookies.split(';').some(cookie => {
    return cookie.trim().startsWith('isAuthenticated=');
  });

  return isAuthenticated;
}