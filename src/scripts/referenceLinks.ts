function addMissingReferenceLinks(): void {
  document.querySelectorAll<HTMLTableRowElement>('tr[id^="ref"]').forEach((row) => {
    const citationCell = row.querySelector<HTMLTableCellElement>('td:nth-child(2)');
    if (!citationCell) return;

    const hasExternalLink = citationCell.querySelector<HTMLAnchorElement>('a[href^="http"]');
    if (hasExternalLink) return;

    const citationText = citationCell.textContent?.replace(/\s+/g, ' ').trim();
    if (!citationText) return;

    const sourceLink = document.createElement('a');
    sourceLink.href = `https://scholar.google.com/scholar?q=${encodeURIComponent(citationText)}`;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener noreferrer';
    sourceLink.textContent = 'Find source';

    citationCell.append(document.createTextNode(' '), sourceLink);
  });
}

document.addEventListener('DOMContentLoaded', addMissingReferenceLinks);
