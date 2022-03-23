export const timeAsHours = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  if (minutes === 0) {
    return `${hours} hr${hours !== 1 ? "s" : ""}`;
  }
  return `${hours} hr${hours !== 1 ? "s" : ""} ${minutes} mins`;
};

export function timeSince(timestamp: number) {
  const seconds = Math.max(new Date().getTime() * 0.001 - timestamp, 0);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  if (Math.floor(seconds) === 0) {
    return "now";
  }
  return Math.floor(seconds) + " seconds ago";
}

export const blobToBase64: (
  blob: Blob
) => Promise<string | ArrayBuffer | null> = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
