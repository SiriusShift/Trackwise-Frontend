import { useEffect } from "react";

const SITE_URL = "https://trackwise.hygen.live";

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
    const prevTitle = document.title;
    let descTag = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const prevDescription = descTag?.getAttribute("content") ?? "";

    document.title = title;
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.name = "description";
      document.head.appendChild(descTag);
    }
    descTag.content = description;

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${window.location.pathname}`;

    return () => {
      document.title = prevTitle;
      if (descTag) descTag.content = prevDescription;
      canonical?.remove();
    };
  }, [title, description]);
}
