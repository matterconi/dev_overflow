import type { Metadata } from "next";

export const siteConfig = {
  name: "Dev Overflow",
  url: "https://devoverflow.dev",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  creator: "Dev Overflow Team",
  twitterHandle: "@devoverflow",
};

export const sharedKeywords: string[] = [
  "Dev Overflow",
  "programming questions",
  "developer Q&A",
  "web development",
  "JavaScript",
  "React",
  "Next.js",
  "algorithms",
  "data structures",
  "developer community",
];

export const sharedAuthors: { name: string; url?: string }[] = [
  { name: "Dev Overflow Team", url: siteConfig.url },
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
  icon: "/images/site-logo.svg",
  shortcut: "/favicon.ico",
  // Replace with a proper apple-touch-icon.png (180x180) when available
  apple: "/images/logo.png",
};

// Replace url with a proper 1200x630 OG banner image when available
export const sharedOGImage = {
  url: "/images/logo.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — Ask & Answer Programming Questions`,
};
