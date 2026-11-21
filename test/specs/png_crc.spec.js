/* global describe, it, expect, jsPDF, loadBinaryResource */
/**
 * png chunk integrity spec tests
 */

describe("Module: PNGSupport (chunk integrity)", () => {
  beforeAll(loadGlobals);

  // colortype_2_rgb_8_bit.png: first IDAT chunk starts at byte 111 and holds
  // 32768 data bytes, so its stored CRC starts at byte 111 + 8 + 32768.
  const idatCrcOffset = 111 + 8 + 32768;

  function loadPng() {
    return loadBinaryResource("reference/images/colortype_2_rgb_8_bit.png");
  }

  it("accepts an intact PNG", () => {
    const png = loadPng();
    expect(png.substr(115, 4)).toEqual("IDAT");
    const doc = new jsPDF();
    expect(() => doc.addImage(png, "PNG", 10, 10, 50, 50)).not.toThrow();
  });

  it("rejects a PNG whose IDAT chunk has a wrong CRC", () => {
    const png = loadPng();
    const flipped = String.fromCharCode(png.charCodeAt(idatCrcOffset) ^ 0xff);
    const corrupt =
      png.substr(0, idatCrcOffset) + flipped + png.substr(idatCrcOffset + 1);
    const doc = new jsPDF();
    expect(() => doc.addImage(corrupt, "PNG", 10, 10, 50, 50)).toThrowError(
      /CRC/
    );
  });
});
