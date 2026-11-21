/* global describe, it, jsPDF, expect, loadGlobals */
/**
 * jsPDF javascript plugin tests: addJS state is per document
 */

describe("Module: JavaScript (per-document state)", () => {
  beforeAll(loadGlobals);

  it("keeps the script of each document in that document", () => {
    const docA = new jsPDF();
    const docB = new jsPDF();
    docA.addJS("var a = 1;");
    docB.addJS("var b = 2;");

    const outputA = docA.output();
    expect(outputA).toContain("/JS (var a = 1;)");
    expect(outputA).not.toContain("var b = 2;");

    const outputB = docB.output();
    expect(outputB).toContain("/JS (var b = 2;)");
    expect(outputB).not.toContain("var a = 1;");
  });

  it("still embeds the script when only one document calls addJS", () => {
    const doc = new jsPDF();
    doc.addJS("var c = 3;");
    const output = doc.output();
    expect(output).toContain("/S /JavaScript");
    expect(output).toContain("/JS (var c = 3;)");
    expect(output).toContain("/Names <</JavaScript ");
  });
});
