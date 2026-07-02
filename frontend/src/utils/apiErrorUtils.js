/**
 * apiErrorUtils.js
 *
 * Reusable utility for extracting human-readable error messages
 * from Axios error objects returned by the backend API.
 *
 * Priority order:
 *  1. error.response.data.non_field_errors[0]  — DRF credential errors
 *  2. error.response.data.detail               — DRF permission / auth errors
 *  3. error.response.data.message              — custom message field
 *  4. HTTP status code bucket (5xx → server error)
 *  5. error.request present but no response    → network / CORS / timeout
 *  6. Fallback                                 → "Something went wrong"
 */

/**
 * Extracts a user-friendly error message from an Axios error.
 *
 * @param {unknown} error - The error thrown by axios (or anything else).
 * @returns {string}       - A display-ready error message string.
 */
export function extractApiErrorMessage(error) {
  // ── 1. Server responded with an error status ──────────────────────────────
  if (error?.response) {
    const { status, data } = error.response;

    // 1a. Django REST Framework non_field_errors (e.g. invalid credentials)
    const nonFieldError = data?.non_field_errors?.[0];
    if (nonFieldError) return nonFieldError;

    // 1b. DRF "detail" field (e.g. 401 Unauthorized, 403 Forbidden)
    if (data?.detail) return data.detail;

    // 1c. Generic "message" field from custom backend responses
    if (data?.message) return data.message;

    // 1d. HTTP status-code buckets
    if (status >= 500 && status <= 599) return "Internal server error";
    if (status === 401) return "Invalid credentials. Please try again.";
    if (status === 403) return "You are not authorized to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 429) return "Too many requests. Please slow down.";
  }

  // ── 2. Request was sent but no response received ──────────────────────────
  // Covers: network down, backend unreachable, timeout, CORS failures.
  if (error?.request) {
    return "Network error. Please try again.";
  }

  // ── 3. Unexpected / unknown error ─────────────────────────────────────────
  return "Something went wrong";
}
