type MetaInput = {
  title: string;
  description: string;
  image?: string;
  path?: string;
};

export function pageMeta({ title, description, image, path }: MetaInput) {
  const url = path ? `https://runwayrefined.com${path}` : undefined;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  if (url) {
    meta.push({ property: "og:url", content: url });
  }
  return meta;
}
