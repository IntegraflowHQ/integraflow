/**
 * Convert the string to an HTML document
 * @param {string} str The HTML
 * @return {Element} An HTML document
 */
function stringToHTML(str: string): Element {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body || document.createElement('body');
}

/**
 * Remove <script> elements
 * @param {Node} html The HTML
 */
function removeScripts(html: Element) {
  const scripts = html.querySelectorAll('script');
  for (const script of scripts) {
    script.remove();
  }
}

/**
 * Check if the attribute is potentially dangerous
 * @param  {String}  name  The attribute name
 * @param  {String}  value The attribute value
 * @return {Boolean}       If true, the attribute is potentially dangerous
 */
/**
 * Check if the attribute is potentially dangerous
 */
function isPossiblyDangerous(name: string, value: string): boolean {
  const val = value.replace(/\s+/g, '').toLowerCase();
  if (
    ['src', 'href', 'xlink:href'].includes(name) &&
    (val.includes('javascript:') || val.includes('data:'))
  ) {
    return true;
  }

  if (name.startsWith('on')) {
    return true;
  }

  return false;
}

/**
 * Remove potentially dangerous attributes from an element
 * @param  {Node} elem The element
 */
function removeAttributes(elem: Element) {
  // Loop through each attribute
  // If it's dangerous, remove it
  const attrs = elem.attributes;
  for (const { name, value } of attrs) {
    if (!isPossiblyDangerous(name, value)) continue;
    elem.removeAttribute(name);
  }
}

/**
 * Clean the HTML nodes recursively
 * @param  {Element} html The HTML element
 */
function clean(html: Element) {
  const nodes = html.children;
  for (const node of nodes) {
    removeAttributes(node);
    clean(node);
  }
}

/*!
 * Sanitize an HTML string
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String}          str   The HTML string to sanitize
 * @return {String}          The sanitized string
 */
export function cleanHtml(str: string): string {
  // Convert the string to HTML
  const html = stringToHTML(str);

  // Sanitize it
  removeScripts(html);
  clean(html);

  // If the user wants HTML nodes back, return them
  // Otherwise, pass a sanitized string back
  return html.innerHTML;
}
