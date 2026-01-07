/**
 * Date bucket utilities for grouping events relative to today.
 * All calculations use local time to avoid timezone surprises.
 */

/**
 * Get the start of a day (midnight) in local time
 */
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of a day (23:59:59.999) in local time
 */
function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get the start of the week (Monday) for a given date
 */
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday is first day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the week (Sunday) for a given date
 */
function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get the start of the month for a given date
 */
function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the month for a given date
 */
function endOfMonth(date) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get the start of the year for a given date
 */
function startOfYear(date) {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the year for a given date
 */
function endOfYear(date) {
  const d = new Date(date);
  d.setMonth(11, 31);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Bucket definitions for future events (relative to today)
 */
export const FUTURE_BUCKETS = ["THIS_WEEK", "THIS_MONTH", "THIS_YEAR", "FUTURE"];

/**
 * Bucket definitions for past events (relative to today)
 */
export const PAST_BUCKETS = ["LAST_30_DAYS", "OLDER"];

/**
 * Human-readable labels for each bucket
 */
export const BUCKET_LABELS = {
  TODAY: "Today",
  THIS_WEEK: "This Week",
  THIS_MONTH: "This Month",
  THIS_YEAR: "This Year",
  FUTURE: "Future",
  LAST_30_DAYS: "Last 30 Days",
  OLDER: "Older",
};

/**
 * Determine which bucket an event belongs to based on its date
 * @param {Date|string} eventDate - The event's date
 * @param {Date} now - Reference date (usually today)
 * @returns {string} Bucket key
 */
export function getBucket(eventDate, now = new Date()) {
  const eventTime = new Date(eventDate).getTime();
  const todayStart = startOfDay(now).getTime();
  const todayEnd = endOfDay(now).getTime();

  // TODAY
  if (eventTime >= todayStart && eventTime <= todayEnd) {
    return "TODAY";
  }

  // FUTURE EVENTS
  if (eventTime > todayEnd) {
    const weekEnd = endOfWeek(now).getTime();
    if (eventTime <= weekEnd) {
      return "THIS_WEEK";
    }

    const monthEnd = endOfMonth(now).getTime();
    if (eventTime <= monthEnd) {
      return "THIS_MONTH";
    }

    const yearEnd = endOfYear(now).getTime();
    if (eventTime <= yearEnd) {
      return "THIS_YEAR";
    }

    return "FUTURE";
  }

  // PAST EVENTS
  if (eventTime < todayStart) {
    // Last 30 days
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    if (eventTime >= thirtyDaysAgo.getTime()) {
      return "LAST_30_DAYS";
    }

    return "OLDER";
  }

  return "TODAY";
}

/**
 * Group events into buckets
 * @param {Array} events - Array of event objects with a date property
 * @param {Date} now - Reference date (usually today)
 * @returns {Object} Object with bucket keys and arrays of events
 */
export function groupEventsByBucket(events, now = new Date()) {
  const buckets = {
    TODAY: [],
    THIS_WEEK: [],
    THIS_MONTH: [],
    THIS_YEAR: [],
    FUTURE: [],
    LAST_30_DAYS: [],
    OLDER: [],
  };

  for (const event of events) {
    const bucket = getBucket(event.date, now);
    buckets[bucket].push(event);
  }

  // Sort future buckets ascending (soonest first)
  for (const key of ["TODAY", ...FUTURE_BUCKETS]) {
    buckets[key].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Sort past buckets descending (most recent first)
  for (const key of PAST_BUCKETS) {
    buckets[key].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return buckets;
}
