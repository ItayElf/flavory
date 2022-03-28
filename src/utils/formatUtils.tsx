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

export const formatQuantity = (quantity: number) => {
  const gcd = (a: number, b: number) => (b ? gcd(b, a % b) : a);

  const unit = Math.floor(quantity);
  quantity = Math.round((quantity - unit) * 1000) / 1000;
  if (quantity === 0) {
    return unit + "";
  }
  const topString = quantity.toString().replace(/\d+[.]/, "");
  const bottom = Math.pow(10, topString.length);
  const top = parseInt(topString);
  const x = gcd(top, bottom);
  return `${unit === 0 ? "" : unit + " "}${getFraction(top / x, bottom / x)}`;
};

//TODO: support more fractions
const getFraction = (top: number, bottom: number) => {
  const remainder = {
    "1/2": "½",
    "1/3": "⅓",
    "333/1000": "⅓",
    "2/3": "⅔",
    "1/4": "¼",
    "3/4": "¾",
    "1/5": "⅕",
    "2/5": "⅖",
    "3/5": "⅗",
    "4/5": "⅘",
    "1/6": "⅙",
    "333/500": "⅙",
    "5/6": "⅚",
    "1/7": "⅐",
    "1/8": "⅛",
    "3/8": "⅜",
    "5/8": "⅝",
    "7/8": "⅞",
    "1/9": "⅑",
    "1/10": "⅒",
  };
  return remainder[`${top}/${bottom}`] ?? `${top}/${bottom}`;
};
