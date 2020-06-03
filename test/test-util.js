const expect = require('chai').expect;
const util = require("../lib/util.js");

describe('imi-enrichment-hojin#util', () => {

  it("getCheckDigit", () => {
    expect(util.getCheckDigit("8700110005901")).to.equal(8);
    expect(util.getCheckDigit("4000012090001")).to.equal(4);
    expect(util.getCheckDigit("400001209000")).to.be.NaN;
    expect(util.getCheckDigit("40000120900000")).to.be.NaN;
  });

  it("calcCheckDigit", () => {
    expect(util.calcCheckDigit("8700110005901")).to.equal(8);
    expect(util.calcCheckDigit("4000012090001")).to.equal(4);
    expect(util.calcCheckDigit("400001209000")).to.be.NaN;
    expect(util.calcCheckDigit("40000120900000")).to.be.NaN;
  });

  it("isValidHoujinBangou", () => {
    expect(util.isValidHoujinBangou("8700110005901")).to.be.true;
    expect(util.isValidHoujinBangou("4000012090001")).to.be.true;
    expect(util.isValidHoujinBangou("400001209000")).to.be.false;
    expect(util.isValidHoujinBangou("40000120900000")).to.be.false;
  });

  it("isValidCheckDigit", () => {
    expect(util.isValidCheckDigit("8700110005901")).to.be.true;
    expect(util.isValidCheckDigit("4000012090001")).to.be.true;
    expect(util.isValidCheckDigit("5000012090001")).to.be.false;
    expect(util.isValidCheckDigit("6000012090001")).to.be.false;
    expect(util.isValidCheckDigit("600001209000")).to.be.false;
    expect(util.isValidCheckDigit("60000120900000")).to.be.false;
  });

  it("deepStrictEqual", () => {
    expect(util.deepStrictEqual(0, 0)).to.be.true;
    expect(util.deepStrictEqual(1, 1)).to.be.true;
    expect(util.deepStrictEqual(true, true)).to.be.true;
    expect(util.deepStrictEqual(false, false)).to.be.true;
    expect(util.deepStrictEqual("hello", "hello")).to.be.true;
    expect(util.deepStrictEqual([0, "hello", true], [0, "hello", true])).to.be.true;
    expect(util.deepStrictEqual({
      a: 1,
      b: 2
    }, {
      b: 2,
      a: 1
    })).to.be.true;

    expect(util.deepStrictEqual("hello", "world")).to.be.false;
    expect(util.deepStrictEqual([0, "hello", true], [0, "hello", false])).to.be.false;
    expect(util.deepStrictEqual([0, "hello", true], [0, true, "hello"])).to.be.false;
    expect(util.deepStrictEqual({
      a: 1,
      b: 2
    }, {
      b: 2
    })).to.be.false;
  });

  it("put", () => {
    expect(util.put({}, "name", "Alice")).deep.equal({
      "name": "Alice"
    });
    expect(util.put({
      "name": "Alice"
    }, "name", "Alice")).deep.equal({
      "name": "Alice"
    });
    expect(util.put({
      "name": "Bob"
    }, "name", "Alice")).deep.equal({
      "name": ["Bob", "Alice"]
    });
    expect(util.put({
      "name": ["Bob", "Cate"],
    }, "name", "Alice")).deep.equal({
      "name": ["Bob", "Cate", "Alice"]
    });
    expect(util.put({}, "is", {
      "@type": "Cat"
    })).deep.equal({
      "is": {
        "@type": "Cat"
      }
    });
    expect(util.put({
      "is": {
        "@type": "Cat"
      }
    }, "is", {
      "@type": "Cat"
    })).deep.equal({
      "is": {
        "@type": "Cat"
      }
    });
    expect(util.put({
      "is": {
        "@type": "Dog"
      }
    }, "is", {
      "@type": "Cat"
    })).deep.equal({
      "is": [{
        "@type": "Dog"
      }, {
        "@type": "Cat"
      }]
    });
    expect(util.put({
      "is": [{
        "@type": "Dog"
      }, {
        "@type": "Animal"
      }]
    }, "is", {
      "@type": "Cat"
    })).deep.equal({
      "is": [{
        "@type": "Dog"
      }, {
        "@type": "Animal"
      }, {
        "@type": "Cat"
      }]
    });
  });
});
