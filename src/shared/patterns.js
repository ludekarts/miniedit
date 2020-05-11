// WARNING: Order of this rules matters!

export const headlines = {
  "#": "h1",
  "##": "h2",
  "###": "h3",
  "####": "h4",
  "#####": "h5",
  "######": "h6",
};

// Pure Markdown markup to HTML-nodes.
export const markdownToHtml = [
  // BLOCK.
  {
    // Headers.
    match: /^(#{1,6}) ([\s\S]+?)$/gm,
    format: (match, head, tail) => `<${headlines[head]} data-block="true" data-md="${head}">${tail}</${headlines[head]}>`
  },
  {
    // Comments.
    match: /^> ([\s\S]+?)$/gm,
    format: (match, content) => `<blockquote data-block="true" data-md="quote">${content.trim()}</blockquote>`
  },
  {
    // Horizontal line.
    match: /^--{2,}$/gm,
    format: (match, content) => `<hr data-block="true" data-md="line"/>`
  },

  // INLINE.

  {
    // Lists.
    match: /^( *-) ([\s\S]+?)\n/gm,
    format: (match, head, content) => `${head} ${content.trim()}\n`
  },
  {
    // Bold
    match: /\*\*(.+?)\*\*/g,
    format: (match, content) => `<strong data-md="strong">${content.trim()}</strong>`
  },
  {
    // Italic.
    match: /\*(.+?)\*/g,
    format: (match, content) => `<em data-md="italic">${content.trim()}</em>`
  },
  {
    // Strike.
    match: /~~(.+?)~~/g,
    format: (match, content) => `<s data-md="strike">${content.trim()}</s>`
  },
  {
    // Superscript.
    match: /\^(.+?)\^/g,
    format: (match, content) => `<sup data-md="upper">${content.trim()}</sup>`
  },
  {
    // Links.
    match: /([^!])\[(.+?)\]\((.+?)\)/g,
    format: (match, prefix, name, url) => `${prefix}<a href="${url}" data-md="link">${name}</a>`,
  },
  {
    // Images.
    match: /!\[(.*?)\]\((.+?)\)/gm,
    format: (match, name, url) => `<figure data-md="img" data-block="true" data-noedit="true" data-click="showImageOptions"><img src="${url}" alt="${name}"/></figure>`,
  },
  {
    // Paste image /link.
    match: /^(http[^\s]+)$/gm,
    format: (match, content) => /\.(png|jpe?g|svg|tiff)$/g.test(content)
      ? `<figure data-md="img" data-block="true" data-noedit="true" data-click="showImageOptions"><img src="${content}" alt="figure"/></figure>`
      : `<a href="${content}" data-md="link">${cropUrl(content)}</a>`
  },
  {
    // New Lines.
    match: /\n/gm,
    format: (match, content) => `<br data-md="nl"/>`
  },
];

// Regexes for Block-style elements.
export const block = markdownToHtml.slice(0, 3);

// Regexes for Inline-style elements.
export const inline = markdownToHtml.slice(4, markdownToHtml.length);

// List of markdown markup.
export const markdownMarkup = {
  "#": content => `# ${content}`,
  "##": content => `## ${content}`,
  "###": content => `### ${content}`,
  "####": content => `#### ${content}`,
  "#####": content => `##### ${content}`,
  "######": content => `###### ${content}`,
  "strong": content => `**${content}**`,
  "italic": content => `*${content}*`,
  "strike": content => `~~${content}~~`,
  "upper": content => `^${content}^`,
  "quote": content => `> ${content}`,
  "line": _ => `---`,
  "link": (url, name) => `[${name}](${url})`,
  "img": (url, name) => `![${name}](${url})`,
};

// ---- HELPERS ----------------

function cropUrl(content) {
  const text = content.slice(content.lastIndexOf("/") + 1, content.length);
  return !text.length ? content : text;
}
