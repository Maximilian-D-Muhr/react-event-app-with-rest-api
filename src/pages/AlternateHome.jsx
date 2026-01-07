import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../api/events";
import { EventCard } from "../components/EventCard";
import {
  groupEventsByBucket,
  FUTURE_BUCKETS,
  PAST_BUCKETS,
  BUCKET_LABELS,
} from "../utils/dateBuckets";

/**
 * Section divider with centered label
 */
function BucketDivider({ label, isToday = false, isPastHeader = false }) {
  if (isToday) {
    return (
      <div className="relative flex items-center py-6">
        <div className="flex-grow border-t-2 border-primary"></div>
        <span className="flex-shrink mx-4 px-4 py-1 bg-primary text-primary-content font-bold text-lg rounded-full">
          {label}
        </span>
        <div className="flex-grow border-t-2 border-primary"></div>
      </div>
    );
  }

  if (isPastHeader) {
    return (
      <div className="relative flex items-center py-4 mt-2">
        <div className="flex-grow border-t border-base-300"></div>
        <span className="flex-shrink mx-4 px-3 py-1 bg-base-300 text-base-content font-semibold text-sm rounded-full">
          {label}
        </span>
        <div className="flex-grow border-t border-base-300"></div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center py-4">
      <div className="flex-grow border-t border-base-300"></div>
      <span className="flex-shrink mx-4 px-3 py-1 bg-base-200 text-base-content/80 font-medium text-sm rounded-full">
        {label}
      </span>
      <div className="flex-grow border-t border-base-300"></div>
    </div>
  );
}

/**
 * Grid of event cards for a bucket
 * @param {Object} props
 * @param {Array} props.events - Array of event objects
 * @param {"small" | "normal" | "large"} props.size - Card size variant
 */
function BucketGrid({ events, size = "normal" }) {
  if (events.length === 0) return null;

  // Use fewer columns for large cards (TODAY events)
  const gridClass =
    size === "large"
      ? "grid gap-6 sm:grid-cols-1 lg:grid-cols-2"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <ul className={gridClass}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} size={size} />
      ))}
    </ul>
  );
}

/**
 * Alternate home page with timeline-based event grouping
 */
export function AlternateHome() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setStatus("loading");
      setError("");

      try {
        const data = await getEvents();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        if (!cancelled) {
          setEvents(list);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load events");
          setStatus("error");
        }
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  // Group events into buckets
  const buckets = groupEventsByBucket(events);

  // Limit constants
  const MAX_FUTURE_EVENTS = 20;
  const MAX_PAST_EVENTS = 20;

  // Apply limits to future events (closest to today first, then further out)
  // Order: THIS_WEEK -> THIS_MONTH -> THIS_YEAR -> FUTURE
  let futureRemaining = MAX_FUTURE_EVENTS;
  const limitedFutureBuckets = {};
  for (const key of FUTURE_BUCKETS) {
    const available = buckets[key].length;
    const take = Math.min(available, futureRemaining);
    limitedFutureBuckets[key] = buckets[key].slice(0, take);
    futureRemaining -= take;
  }

  // Apply limits to past events (closest to today first, then further back)
  // Order: LAST_WEEK -> LAST_MONTH -> LAST_YEAR -> PAST
  let pastRemaining = MAX_PAST_EVENTS;
  const limitedPastBuckets = {};
  for (const key of PAST_BUCKETS) {
    const available = buckets[key].length;
    const take = Math.min(available, pastRemaining);
    limitedPastBuckets[key] = buckets[key].slice(0, take);
    pastRemaining -= take;
  }

  // Check if there are any future events (including today)
  const hasFutureEvents =
    buckets.TODAY.length > 0 ||
    FUTURE_BUCKETS.some((key) => limitedFutureBuckets[key].length > 0);

  // Check if there are any past events
  const hasPastEvents = PAST_BUCKETS.some(
    (key) => limitedPastBuckets[key].length > 0
  );

  // Count total events shown vs total available
  const totalFutureShown = FUTURE_BUCKETS.reduce(
    (sum, key) => sum + limitedFutureBuckets[key].length,
    0
  );
  const totalFutureAvailable = FUTURE_BUCKETS.reduce(
    (sum, key) => sum + buckets[key].length,
    0
  );
  const totalPastShown = PAST_BUCKETS.reduce(
    (sum, key) => sum + limitedPastBuckets[key].length,
    0
  );
  const totalPastAvailable = PAST_BUCKETS.reduce(
    (sum, key) => sum + buckets[key].length,
    0
  );

  return (
    <section className="space-y-2">
      {status === "loading" && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {status === "error" && (
        <div className="alert alert-error">
          <span className="break-words">{error}</span>
        </div>
      )}

      {status === "success" && events.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <p className="text-lg opacity-70">No events found.</p>
          <Link to="/create" className="btn btn-primary">
            Create first event
          </Link>
        </div>
      )}

      {status === "success" && events.length > 0 && (
        <>
          {/* Future events truncation notice */}
          {totalFutureShown < totalFutureAvailable && (
            <p className="text-center text-xs opacity-50 py-2">
              Showing {totalFutureShown} of {totalFutureAvailable} upcoming
              events
            </p>
          )}

          {/* FUTURE SECTION - rendered in reverse order (farthest first) */}
          {[...FUTURE_BUCKETS].reverse().map((bucketKey) => {
            if (limitedFutureBuckets[bucketKey].length === 0) return null;
            // Far future (beyond this year) uses small size
            const size = bucketKey === "FUTURE" ? "small" : "normal";
            return (
              <div key={bucketKey}>
                <BucketDivider label={BUCKET_LABELS[bucketKey]} />
                <BucketGrid events={limitedFutureBuckets[bucketKey]} size={size} />
              </div>
            );
          })}

          {/* TODAY - always show the divider as anchor point */}
          <BucketDivider label="TODAY" isToday />
          {buckets.TODAY.length > 0 && (
            <BucketGrid events={buckets.TODAY} size="large" />
          )}
          {buckets.TODAY.length === 0 && hasFutureEvents && (
            <p className="text-center text-sm opacity-60 py-2">
              No events today
            </p>
          )}

          {/* PAST EVENTS SECTION */}
          {hasPastEvents && (
            <>
              <BucketDivider label="Past Events" isPastHeader />

              {PAST_BUCKETS.map((bucketKey) => {
                if (limitedPastBuckets[bucketKey].length === 0) return null;
                // Older events (beyond 30 days) use small size
                const size = bucketKey === "OLDER" ? "small" : "normal";
                return (
                  <div key={bucketKey}>
                    <BucketDivider label={BUCKET_LABELS[bucketKey]} />
                    <BucketGrid events={limitedPastBuckets[bucketKey]} size={size} />
                  </div>
                );
              })}

              {/* Past events truncation notice */}
              {totalPastShown < totalPastAvailable && (
                <p className="text-center text-xs opacity-50 py-2">
                  Showing {totalPastShown} of {totalPastAvailable} past events
                </p>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
