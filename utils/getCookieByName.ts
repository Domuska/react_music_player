export const getCookieByName = (cookieName: string) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];
