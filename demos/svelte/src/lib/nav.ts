export type Page = "playground" | "docs";

export function readPage(): Page {
  const match = location.hash.match(/^#\/(\w+)/);
  return match?.[1] === "docs" ? "docs" : "playground";
}

export function go(page: Page): void {
  location.hash = `#/${page}`;
}

export function pageHref(page: Page): string {
  return `#/${page}`;
}
