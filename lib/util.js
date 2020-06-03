const deepStrictEqual = function(expected, actual) {
  if (typeof expected !== typeof actual) return false;

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return false;
    if (expected.length !== actual.length) return false;
    if (expected.find((x, i) => !deepStrictEqual(x, actual[i]))) return false;
    return true;
  }

  if (typeof expected === 'object') {
    const k1 = Object.keys(expected);
    const k2 = Object.keys(actual);
    if (k1.length !== k2.length) return false;
    if (k1.find(k => k2.indexOf(k) === -1)) return false;
    if (k1.find(k => !deepStrictEqual(expected[k], actual[k]))) return false;
    return true;
  }
  return expected === actual;
};

module.exports = {
  isValidHoujinBangou: function(bangou) {
    return !!(bangou.match(/^([1-9])([0-9]{12})$/));
  },
  isValidCheckDigit: function(bangou) {
    const expected = this.calcCheckDigit(bangou);
    const actual = this.getCheckDigit(bangou);
    return !isNaN(expected) && !isNaN(actual) && expected === actual;
  },
  getCheckDigit: function(bangou) {
    if (!this.isValidHoujinBangou(bangou)) return NaN;
    return parseInt(bangou.substring(0, 1));
  },
  calcCheckDigit: function(bangou) {
    if (!this.isValidHoujinBangou(bangou)) return NaN;
    let s = 0;
    bangou.substring(1).split("").map(a => parseInt(a)).forEach((v, i) => {
      s += (i % 2 === 0 ? v * 2 : v);
    });
    return 9 - (s % 9);
  },
  deepStrictEqual: deepStrictEqual,
  put: function(s, p, o) {
    if (s[p] === undefined) {
      s[p] = o;
    } else if (Array.isArray(s[p])) {
      if (s[p].find(x => deepStrictEqual(x, o)) === undefined)
        s[p].push(o);
    } else if (!deepStrictEqual(s[p], o)) {
      s[p] = [s[p], o];
    }
    return s;
  }
};
