import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

/**
 * Event card with size variants
 * @param {Object} props
 * @param {Object} props.event - Event object with id, title, date, location
 * @param {"small" | "normal" | "large"} props.size - Card size variant
 */
export function EventCard({ event, size = "normal" }) {
  const sizeClasses = {
    small: {
      card: "opacity-60",
      body: "p-3",
      title: "text-xs",
      meta: "text-xs",
    },
    normal: {
      card: "",
      body: "p-4",
      title: "text-base",
      meta: "text-sm",
    },
    large: {
      card: "ring-2 ring-primary shadow-lg",
      body: "p-6",
      title: "text-xl sm:text-2xl",
      meta: "text-base",
    },
  };

  const styles = sizeClasses[size] || sizeClasses.normal;

  return (
    <li
      className={`card bg-base-100 shadow-sm border hover:shadow-md transition-shadow ${styles.card}`}
    >
      <Link to={`/events/${event.id}`} className={`card-body ${styles.body}`}>
        <h3 className={`card-title ${styles.title} break-words`}>
          {event.title}
        </h3>
        <p className={`${styles.meta} opacity-70 truncate`}>
          {formatDate(event.date)}
          {event.location && ` - ${event.location}`}
        </p>
      </Link>
    </li>
  );
}
