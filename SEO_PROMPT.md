# Next.js SEO Optimization Prompt

Use this prompt in any Next.js App Router project to add complete, production-ready SEO coverage.

---

## Prompt

```
Optimize this Next.js App Router project for SEO. Follow these rules exactly and in this order:

---

### Step 1 — Create `constants/metadata.ts`

Extract all shared metadata values into a constants file so they are reused, not duplicated:

```ts
import type { Metadata } from "next";

export const siteConfig = {
  name: "<AppName>",
  url: "https://<your-domain>",
  description: "<full site description — 1-2 sentences>",
  creator: "<Author or Team Name>",
  twitterHandle: "@<handle>",
};

export const sharedKeywords: string[] = [
  "<AppName>",
  "<topic 1>",
  "<topic 2>",
  // add 8-12 relevant terms
];

export const sharedAuthors: { name: string; url?: string }[] = [
  { name: siteConfig.creator, url: siteConfig.url },
];

export const sharedRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const sharedIcons: Metadata["icons"] = {
  icon: "/images/site-logo.svg",    // regular favicon
  shortcut: "/favicon.ico",          // address bar icon
  apple: "/apple-touch-icon.png",    // iOS home screen (180x180)
};

// Ideal OG image: 1200x630px — replace url once the banner is ready
export const sharedOGImage = {
  url: "/images/og-banner.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — <tagline>`,
};
```

---

### Step 2 — Update `app/layout.tsx` (root layout)

Import from the constants file and write the full metadata object:

```ts
import type { Metadata } from "next";
import {
  sharedAuthors,
  sharedIcons,
  sharedKeywords,
  sharedOGImage,
  sharedRobots,
  siteConfig,
} from "@/constants/metadata";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,   // child pages only need: title: "Page Name"
  },
  description: siteConfig.description,

  generator: "Next.js",
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  keywords: sharedKeywords,
  authors: sharedAuthors,
  creator: siteConfig.creator,
  publisher: siteConfig.name,

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: sharedRobots,
  icons: sharedIcons,

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [sharedOGImage],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [sharedOGImage.url],
    creator: siteConfig.twitterHandle,
  },
};
```

The `title.template` means every child page automatically gets `"<title> | <AppName>"`.
The root-level `openGraph`, `robots`, `icons`, `keywords` are inherited by all pages unless overridden.

---

### Step 3 — Static pages

For every page whose content does NOT depend on route params (home, /community, /tags, /collection, /ask-question, etc.), add at the top of the file:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "<Page Name>",   // becomes "<Page Name> | <AppName>" via root template
  description: "<one sentence describing this specific page — max 160 chars>",
};
```

Do NOT repeat `openGraph`, `robots`, or `icons` in static pages — the root layout already covers them.

---

### Step 4 — Dynamic pages (route params)

For every page with dynamic params (e.g. `/questions/[id]`, `/tags/[id]`, `/profile/[id]`):

**4a. Wrap the data-fetching action with React's `cache()`** to prevent a double DB call between `generateMetadata` and the page component:

```ts
// in lib/actions/something.action.ts  (has "use server" at top)
import { cache } from "react";   // from "react", not next

// function declaration style:
export const getSomething = cache(async function getSomething(
  params: SomeParams
): Promise<ActionResponse<SomeType>> {
  // ... existing body unchanged
});

// arrow function style:
export const getSomethingElse = cache(async (
  params: SomeParams
): Promise<ActionResponse<SomeType>> => {
  // ... existing body unchanged
});
```

**4b. Add `generateMetadata` above the page component:**

```ts
import type { Metadata } from "next";
import { sharedOGImage } from "@/constants/metadata";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { success, data } = await getSomething({ id });

  if (!success || !data) return {};

  return {
    title: data.title,                          // template adds " | <AppName>"
    description: data.content?.slice(0, 160),   // 160 chars max
    openGraph: {
      title: data.title,
      description: data.content?.slice(0, 160),
      images: [sharedOGImage],                  // or a page-specific image
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.content?.slice(0, 160),
      images: [sharedOGImage.url],
    },
  };
}
```

---

### Rules

- `cache()` is from `"react"` — not from Next.js. Import it at the top of the action file.
- `cache()` memoizes within a single render request — same data, zero extra DB calls.
- Descriptions must be ≤ 160 characters (Google truncates beyond that).
- Use `title: "Short Name"` in child pages — never repeat the site name, the template handles it.
- `openGraph` and `twitter` are only needed in dynamic pages where each URL has unique shareable content.
- Do NOT throw errors or modify page component logic — `generateMetadata` runs independently.
- The ideal OG image is 1200×630px. The apple-touch-icon should be 180×180px.
- Import order: third-party (`dayjs`, etc.) → `type` imports → internal `@/` imports.

---

### Checklist

- [ ] `constants/metadata.ts` created with `siteConfig`, `sharedKeywords`, `sharedAuthors`, `sharedRobots`, `sharedIcons`, `sharedOGImage`
- [ ] Root layout imports from constants and has full metadata (generator, applicationName, referrer, keywords, authors, creator, publisher, formatDetection, robots, icons, openGraph, twitter)
- [ ] Root layout uses `title.template: "%s | <AppName>"`
- [ ] Every static page has `export const metadata` with `title` + `description` only
- [ ] Every dynamic page has `export async function generateMetadata` with openGraph + twitter
- [ ] Every action called inside `generateMetadata` is wrapped with `cache()` from `"react"`
- [ ] All descriptions are ≤ 160 chars
- [ ] OG image is 1200×630px (or noted as placeholder)
- [ ] Apple touch icon is 180×180px (or noted as placeholder)
- [ ] No `throw new Error` added to any page
```
