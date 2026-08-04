const ACCESS_COOKIE = "auth_access_token";
const REFRESH_COOKIE = "auth_refresh_token";
const USER_COOKIE = "auth_user";

export function useAuthTokens() {
  const accessToken = useCookie<string | null>(ACCESS_COOKIE, {
    maxAge: 60 * 30, // 30 min
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    default: () => null,
  });

  const refreshToken = useCookie<string | null>(REFRESH_COOKIE, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    default: () => null,
  });

  const userCookie = useCookie<string | null>(USER_COOKIE, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    default: () => null,
  });

  function setTokens(tokens: { accessToken: string; refreshToken: string }) {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;
  }

  function clearTokens() {
    accessToken.value = null;
    refreshToken.value = null;
    userCookie.value = null;
  }

  return { accessToken, refreshToken, userCookie, setTokens, clearTokens };
}
