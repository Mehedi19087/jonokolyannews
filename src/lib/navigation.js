const specialPages = {
  latest: "/archive",
  photostory: "/photostory",
  tube: "/tube",
  newstoday: "/newstoday",
  archive: "/archive-calendar",
};

export const categoryOrder = [
  "latest", "bangladesh", "national", "politics", "jela-songbad", "country",
  "world", "business", "sports", "sport", "culture", "entertainment", "glitz",
  "crime", "opinion", "tech", "lifestyle", "religion", "photostory", "tube",
  "newstoday", "archive",
];

export function categoryHref(slug) {
  return specialPages[slug] || `/category/${encodeURIComponent(slug)}`;
}

export function navigationItems(categories) {
  return categories.map((category) => ({
    label: category.name,
    href: categoryHref(category.slug),
  }));
}

export function isHomeCategory(slug) {
  return !["jela-songbad", "opinion", "tech", "lifestyle", ...Object.keys(specialPages)].includes(slug);
}
