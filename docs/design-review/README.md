# Public design review

The review keeps the existing red, white, and black news style, the centered logo, the full category menu, and the six selected home page sections.

Changes:

- Supporting category stories use compact image-and-text rows. At a 1440-pixel viewport, the reviewed five-story sections decreased from 690–722 pixels tall to 586 pixels.
- A section with one story uses a full-width image-and-text row. This removes the empty right column. Two-story sections use two equal columns. Mobile sections stack naturally.
- Dates and small reading notes use darker text. Article paragraphs have a maximum reading width of 72 characters, based on the font's character width.
- Header controls have larger touch targets. The menu opens as a proper side panel. Article font controls are visible on phones and use the current rendered font size.
- Footer branding is smaller so it does not compete with the main logo.

Verified at viewport widths of 320, 390, 768, 1024, 1238, and 1440 pixels. No horizontal page overflow was found. The removed home page sections and category jump bar remain absent. Menu, search, category pages, and mobile article font changes were checked in the browser.

Previews: [desktop](section-desktop.png), [mobile](section-mobile.png).
