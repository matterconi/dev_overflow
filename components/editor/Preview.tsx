import sanitizeHtml from "sanitize-html";

export const Preview = ({ content }: { content: string }) => {
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "blockquote",
      "pre",
      "code",
      "ul",
      "ol",
      "li",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      code: ["class"],
      pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  return (
    <section
      className="markdown prose grid max-w-none break-words dark:prose-invert [&_a]:text-primary-500 [&_a]:underline [&_code]:rounded-sm [&_code]:bg-light-800 [&_code]:px-1 [&_code]:text-dark-200 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-light-800 [&_pre]:p-4 [&_pre]:text-dark-100 dark:[&_code]:bg-dark-300 dark:[&_code]:text-light-900 dark:[&_pre]:bg-dark-300 dark:[&_pre]:text-light-900"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
