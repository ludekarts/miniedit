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
    format: (match, content) => `<strong data-md="bold">${content.trim()}</strong>`
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
    // Linked images.
    match: /\[!\[(.+?)\]\((.+?)\)\]\((.+?)\)/gm,
    format: (match, alt, imgUrl, url) => `<figure data-md="img" data-block="true" data-noedit="true" data-link="${url}" data-click="showImageOptions"><img src="${imgUrl}" alt="${alt}"/></figure>`,
  },
  {
    // Images and Links.
    match: /!?\[(.*?)\]\((.*?)\)/gm,
    format: (match, text, url) => {
      if (match.indexOf("!") === 0) {
        return `<figure data-md="img" data-block="true" data-noedit="true" data-click="showImageOptions"><img src="${url}" alt="${text}"/></figure>`;
      }
      return `<a href="${url}" data-md="link">${text}</a>`;
    }
  },
  {
    // Paste image/link.
    match: /^(http[^\s]+)$/gm,
    format: (match, url) => {
      const isImage = /\.(gif|png|jpe?g|svg|tiff)$/g.test(url);

      if (isImage) {
        return `<figure data-md="img" data-block="true" data-noedit="true" data-click="showImageOptions"><img src="${url}" alt="figure"/></figure>`;
      }

      if (url.includes("youtube.com")) {
        return `<figure data-md="embed" data-block="true" data-noedit="true"data-click="showEmbedOptions" data><img src="${formatYTCover(url)}" alt="${url}"/></figure>`
      }

      return `<a href="${url}" data-md="link">${cropUrl(url)}</a>`;
    }
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
  "bold": content => `**${content}**`,
  "italic": content => `*${content}*`,
  "strike": content => `~~${content}~~`,
  "upper": content => `^${content}^`,
  "quote": content => `> ${content}`,
  "line": _ => `---`,
  "embed": (url) => `[${url}](${url})`,
  "link": (url, name) => `[${name}](${url})`,
  "img": (url, name) => `![${name}](${url})`,
  "imglink": (url, name, link) => `[![${name}](${url})](${link})`,
};

// ---- HELPERS ----------------

function cropUrl(url) {
  return url.length > 37 ? `${url.slice(0, 37)}...` : url;
}

function formatYTCover(url) {
  const searchParams = new URLSearchParams(url.slice(url.indexOf("?") + 1));
  return `https://i3.ytimg.com/vi/${searchParams.get("v")}/maxresdefault.jpg`;
}
