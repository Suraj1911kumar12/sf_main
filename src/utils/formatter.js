export function formatDate(dateString, format = "iso") {
  const date = new Date(dateString);

  if (isNaN(date)) {
    return "Invalid Date";
  }

  switch (format) {
    case "12-hour": {
      // 12-hour format with AM/PM and date (MM/DD/YYYY) in UTC
      return `${date.toLocaleDateString("en-US", {
        timeZone: "UTC",
      })} ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })}`;
    }

    case "24-hour": {
      // 24-hour format with date (MM/DD/YYYY) in UTC
      return `${date.toLocaleDateString("en-US", {
        timeZone: "UTC",
      })} ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      })}`;
    }

    case "iso": {
      // ISO format with date and time (YYYY-MM-DDTHH:mm:ss.sssZ) in UTC
      return date.toISOString();
    }

    case "custom": {
      // Custom date format (DD/MM/YYYY) and time (12-hour with AM/PM) in UTC
      return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}/${date.getUTCFullYear()} ${
        date.getUTCHours() % 12 || 12
      }:${String(date.getUTCMinutes()).padStart(2, "0")}:${String(
        date.getUTCSeconds()
      ).padStart(2, "0")} ${date.getUTCHours() >= 12 ? "PM" : "AM"}`;
    }

    case "iso-no-seconds": {
      // Custom ISO format without seconds (YYYY-MM-DDTHH:mm) in UTC
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    case "date-only": {
      // Date only format (MM/DD/YYYY) in UTC
      return date.toLocaleDateString("en-US", { timeZone: "UTC" });
    }

    case "date-eu": {
      // Date in European format (DD/MM/YYYY) in UTC
      return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}/${date.getUTCFullYear()}`;
    }

    case "date-iso": {
      // Date in ISO format (YYYY-MM-DD) in UTC
      return date.toISOString().split("T")[0];
    }
    case "week-show": {
      const currentDate = new Date();
      const oneWeekAgo = new Date();

      oneWeekAgo.setDate(currentDate.getDate() - 7);

      const isWithinLastWeek = date >= oneWeekAgo && date <= currentDate;

      if (!isWithinLastWeek) {
        const dayOfWeek = date.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        });
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        return `${dayOfWeek} ${hours}:${minutes}`;
      } else {
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = date.toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        });
        return `${day} ${month}`;
      }
    }
    case "proper": {
      const currentDate = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 7);

      const isToday = date.toDateString() === currentDate.toDateString();
      const isYesterday =
        date.toDateString() ===
        new Date(currentDate.setDate(currentDate.getDate() - 1)).toDateString();
      const isWithinLastWeek = date >= oneWeekAgo && !isToday && !isYesterday;

      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");

      if (isToday) {
        return `Today, ${hours}:${minutes}`;
      }

      if (isYesterday) {
        return `Yesterday, ${hours}:${minutes}`;
      }

      if (isWithinLastWeek) {
        const dayOfWeek = date.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        });
        return `${dayOfWeek}, ${hours}:${minutes}`;
      }

      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      });
      const year = date.getUTCFullYear();
      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }

    default: {
      return "Invalid format type";
    }
  }
}

export function capitalizer(str) {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getDateLabel = (messageDate) => {
  const currentDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(currentDate.getDate() - 1);

  const msgDate = new Date(messageDate);

  if (msgDate.toDateString() === currentDate.toDateString()) {
    return "Today";
  } else if (msgDate.toDateString() === yesterdayDate.toDateString()) {
    return "Yesterday";
  } else {
    return msgDate.toLocaleDateString();
  }
};
