/** Curated Unsplash stills — Indian / tropical residential construction. */

const u = (id: string, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80${extra}`;

export const SITE_PHOTOS = {
  hero: u("photo-1503387762-592deb58ef4e"),
  frame: u("photo-1541888946425-d81bb19240f5"),
  pour: u("photo-1504307651254-35680f356988"),
  brick: u("photo-1590725175785-de025cc60835"),
  yard: u("photo-1581094794329-c8112a89af12"),
  interior: u("photo-1600585154340-be6161a56a0c"),
  plans: u("photo-1503387762-592deb58ef4e", "&sat=-10"),
  dusk: u("photo-1486406146926-c627a92ad1ab"),
} as const;

export const COVER_PHOTOS = [
  SITE_PHOTOS.hero,
  SITE_PHOTOS.frame,
  SITE_PHOTOS.pour,
  SITE_PHOTOS.brick,
  SITE_PHOTOS.interior,
  SITE_PHOTOS.dusk,
];

const PORTRAITS = [
  u("photo-1507003211169-0a1dd7228f2d"),
  u("photo-1573496359142-b8d87734a5a2"),
  u("photo-1500648767791-00dcc994a43e"),
  u("photo-1544005313-94ddf0286df2"),
  u("photo-1472099645785-5658abf4ff4e"),
  u("photo-1580489944761-15a19d654956"),
  u("photo-1560250097-0b93528c311a"),
  u("photo-1438761681033-6461ffad8d80"),
];

function hash(s: string) {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n;
}

export function coverFor(key: string | number) {
  return COVER_PHOTOS[hash(String(key)) % COVER_PHOTOS.length]!;
}

export function portraitFor(key: string) {
  return PORTRAITS[hash(key) % PORTRAITS.length]!;
}

export const DEMO_SITE_NAME = "Koramangala 3BHK";
