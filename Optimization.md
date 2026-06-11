# Next.js Optimization Strategies

A practical reference for optimizing Next.js applications. Apply these strategies after the feature works — not before.

---

## 1. Prefer Server Components for Data Fetching

Fetch data in Server Components whenever possible. This keeps data-fetching logic on the server, reduces the client bundle, and avoids unnecessary client-side state.

**Rule of thumb:** if a component doesn't need `useState`, `useEffect`, or browser APIs, make it a Server Component.

---

## 2. Parallel Data Fetching (Avoid Waterfalls)

Never await sequential fetches when they are independent. Use `Promise.all` to fire them simultaneously.

```ts
// Bad — waterfall
const user = await getUser(id);
const posts = await getPosts(id);

// Good — parallel
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

Total wait time = slowest request, not the sum of all requests.

---

## 3. Stream with Suspense for Progressive Rendering

Wrap slow data-fetching components in `<Suspense>` so the rest of the page renders immediately. This improves First Contentful Paint (FCP).

```tsx
import { Suspense } from 'react';
import HeavyComponent from './HeavyComponent';

export default function Page() {
  return (
    <div>
      <FastSection />
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

Pair this with `loading.tsx` files for route-level streaming.

---

## 4. React `cache` — Memoize Repeated Server Calls

If multiple Server Components in the same request call the same function with the same arguments, wrap it with React's `cache` to avoid duplicate work.

```ts
import { cache } from 'react';

export const getQuestion = cache(async (id: string) => {
  return db.question.findById(id);
});
```

**Rules:**
- Only works in Server Components.
- Cache is scoped to a single server request — it resets on every new request.
- Define cached functions at module level (outside components).
- Each `cache()` call creates its own separate cache.
- Not the same as `useMemo` (which is client-only).

---

## 5. Next.js Data Cache (fetch-level)

Control caching behavior per `fetch` call using Next.js's built-in data cache.

```ts
// SSG-like: cached indefinitely (default)
const data = await fetch('https://api.example.com/data');

// ISR-like: revalidate on a schedule
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }, // seconds
});

// SSR-like: never cache
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store',
});
```

Think of it as applying a rendering strategy at the request level rather than the page level.

---

## 6. Full Route Cache (Page-level)

Next.js caches the rendered output (RSC Payload + HTML) of entire routes at build time for static pages.

- Static routes (no dynamic data) → cached at build time (SSG).
- Routes using `searchParams`, `cookies()`, or `headers()` → rendered per request (SSR), not cached.

To force a route into dynamic rendering:

```ts
export const dynamic = 'force-dynamic';
```

To opt into ISR at the route level:

```ts
export const revalidate = 3600; // revalidate every hour
```

---

## 7. Client-Side Router Cache

Next.js automatically prefetches routes linked via `<Link>` and caches them in memory on the client. This makes navigation feel instant.

To disable prefetching for a specific link:

```tsx
import Link from 'next/link';

<Link href="/heavy-page" prefetch={false}>Go</Link>
```

Only disable when the page is large, rarely visited, or has data that must always be fresh.

---

## 8. Image Optimization

Use `next/image` for images that are part of the UI. It handles lazy loading, responsive sizes, and format conversion (WebP) automatically.

```tsx
import Image from 'next/image';

<Image src="/hero.png" alt="Hero" width={800} height={400} priority />
```

Use `priority` only for above-the-fold images. Don't use `next/image` for every image — user-generated content served from external URLs may need explicit `remotePatterns` config.

---

## 9. Font Optimization

Load fonts via `next/font` to eliminate layout shift and avoid extra network requests. Fonts are downloaded at build time and self-hosted automatically.

```ts
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

Apply to the root layout for global coverage.

---

## 10. Minimize Client-Side Code

- Avoid marking components `'use client'` unless they need interactivity or browser APIs.
- Keep `'use client'` boundaries as deep (leaf) as possible — push them down the tree.
- Heavy libraries used only in client components increase bundle size; consider dynamic imports.

```ts
import dynamic from 'next/dynamic';

const HeavyEditor = dynamic(() => import('./HeavyEditor'), { ssr: false });
```

---

## Decision Guide: Which Strategy Per Page?

| Page type | Strategy |
|---|---|
| Static content (docs, landing) | SSG — default, no extra config |
| Content that changes occasionally | ISR — `revalidate` on fetch or route |
| User-specific or always-fresh data | SSR — `cache: 'no-store'` or `dynamic = 'force-dynamic'` |
| Mixed (static shell + slow section) | SSG shell + Suspense for the slow part |
| Repeated server calls within a request | React `cache` |

---

## Checklist Before Shipping

- [ ] Are all data-fetching components Server Components unless they need client interactivity?
- [ ] Are independent fetches parallelized with `Promise.all`?
- [ ] Are slow sections wrapped in `<Suspense>`?
- [ ] Are repeated server calls wrapped with React `cache`?
- [ ] Is the correct fetch cache strategy applied to each `fetch` call?
- [ ] Are `<Image>` and `next/font` used where appropriate?
- [ ] Are `'use client'` boundaries as narrow as possible?
