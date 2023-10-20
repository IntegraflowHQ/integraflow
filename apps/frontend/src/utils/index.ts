export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function generateUniqueId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substr(2, 5); // 5 character random string

  return `${timestamp}-${random}`;
}
