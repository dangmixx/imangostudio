const contents = document.querySelector('.legal-toc');
const list = contents.querySelector('ol');
const headings = [...document.querySelectorAll('.legal-document h2')];

for (const [index, heading] of headings.entries()) {
    if (!heading.id) heading.id = `legal-section-${index + 1}`;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    item.append(link);
    list.append(item);
}
contents.hidden = headings.length === 0;
