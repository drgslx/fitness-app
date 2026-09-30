// Interpret product identifiers, never navigate to an arbitrary QR URL.
export function barcodeFromText(value) {
  const text = String(value || "").trim();
  if (/^[0-9]{8,14}$/.test(text)) return text;
  try {
    const url = new URL(text);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    if (url.hostname === "openfoodfacts.org" || url.hostname.endsWith(".openfoodfacts.org")) {
      return url.pathname.match(/^\/(?:product|produit|produs)\/([0-9]{8,14})(?:\/|$)/)?.[1] ||
        (url.pathname === "/cgi/product.pl" && /^[0-9]{8,14}$/.test(url.searchParams.get("code") || "") ? url.searchParams.get("code") : null);
    }
    // GS1 Digital Link /01/GTIN identifies a product without fetching that URL.
    return url.pathname.match(/^\/01\/([0-9]{14})(?:\/|$)/)?.[1] || null;
  } catch { return null; }
}
