const key = (userId: string) => `nirmaan-onboarded:${userId}`;

export function readOnboardedLocally(userId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key(userId)) === "1";
  } catch {
    return false;
  }
}

export function markOnboardedLocally(userId: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(userId), "1");
  } catch {
    /* private mode / quota — server flag is still the source of truth */
  }
}
