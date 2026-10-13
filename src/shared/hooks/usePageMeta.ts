import { useEffect } from "react";

const SITE_URL = "https://trackwise.hygen.live";

const defaultTitle = document.title;
const defaultDescription =
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.getAttribute("content") ?? "";

interface PageMeta {
  title: string;
  description: string;
}

/**
 * Sets the document title, meta description and canonical URL for the
 * current route, and restores the defaults on unmount.
 */
export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = title;

    let descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.name = "description";
      document.head.appendChild(descTag);
    }
    descTag.content = description;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${window.location.pathname}`;

    return () => {
      document.title = defaultTitle;
      if (descTag) descTag.content = defaultDescription;
      canonical?.remove();
    };
  }, [title, description]);
}
