/**
 * Returns a local "YYYY-MM-DD" key for a Date object.
 * Uses local time so a message at 23:55 UTC+6 appears under the correct local date.
 */
function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Derives a grouping key from an ISO-8601 timestamp string.
 * Returns "unknown" when the value is absent or unparseable.
 */
export function getDateKey(isoTimestamp) {
  if (!isoTimestamp) return "unknown";
  const d = new Date(isoTimestamp);
  return isNaN(d.getTime()) ? "unknown" : toLocalDateKey(d);
}

/**
 * Converts a "YYYY-MM-DD" key into a human-readable label.
 * "Today", "Yesterday", or "25 May 2026".
 */
export function getDateLabel(dateKey) {
  if (dateKey === "unknown") return "Unknown Date";

  const now = new Date();
  const todayKey = toLocalDateKey(now);

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterdayKey = toLocalDateKey(yesterdayDate);

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Groups a flat, chronologically-ordered messages array into date buckets.
 * Returns: Array<{ dateKey: string, label: string, messages: Message[] }>
 *
 * Handles: empty array, single message, same-day messages, multi-month/year spans.
 * Each message must have a `rawTimestamp` field (ISO-8601 string).
 */
export function groupMessagesByDate(messages) {
  if (!messages || messages.length === 0) return [];

  const groups = [];
  let currentKey = null;

  for (const msg of messages) {
    const key = getDateKey(msg.rawTimestamp);
    if (key !== currentKey) {
      currentKey = key;
      groups.push({ dateKey: key, label: getDateLabel(key), messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }

  return groups;
}
