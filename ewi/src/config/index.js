const API_ROOT = process.env.NODE_ENV === "development"
  ? require('./urls.js').DEV_API_ROOT
  : "/api";

export { API_ROOT }