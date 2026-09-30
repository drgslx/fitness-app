import { test } from 'node:test';
import assert from 'node:assert/strict';
import { barcodeFromText } from '../src/components/foods/barcode.js';

test('EAN, UPC, OFF URLs and GS1 product identifiers', () => {
  for (const code of ['012345678905', '5941234567890', '12345678']) assert.equal(barcodeFromText(code), code);
  assert.equal(barcodeFromText('https://ro.openfoodfacts.org/product/5941234567890/test'), '5941234567890');
  assert.equal(barcodeFromText('https://world.openfoodfacts.org/cgi/product.pl?code=5941234567890'), '5941234567890');
  assert.equal(barcodeFromText('https://id.example.org/01/05941234567890/10/lot'), '05941234567890');
});
test('arbitrary QR text and untrusted URLs are not followed', () => {
  for (const text of ['hello','123','javascript:alert(1)','https://evil.test/product/5941234567890','https://openfoodfacts.org.evil.test/product/5941234567890']) assert.equal(barcodeFromText(text), null);
});
