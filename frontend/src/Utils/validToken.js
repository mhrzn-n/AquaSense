const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 > Date.now();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return false; //  MUST be boolean
  }
};

export default isTokenValid;
