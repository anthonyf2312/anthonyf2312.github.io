// The Patchr legal pages are Markdown copied word for word from the Patchr repo. Their links to other
// sites get the same treatment as every other external link here: a new tab, and a note for screen readers.
export function withExternalLinksInNewTab(html: string): string {
  return html.replace(
    /<a href="(https?:\/\/[^"]+)">([\s\S]*?)<\/a>/g,
    '<a href="$1" target="_blank" rel="noopener">$2<span class="visually-hidden"> (opens in a new tab)</span></a>',
  );
}
