const levelup = require('levelup');
const leveldown = require('leveldown');
const util = require("./lib/util");

const DATABASE = __dirname + "/db";

module.exports = function(src) {

  const dst = typeof src === 'string' ? {
    "@context": "https://imi.go.jp/ns/core/context.jsonld",
    "@type": "法人型",
    "ID": {
      "@type": "ID型",
      "体系": {
        "@type": "ID体系型",
        "表記": "法人番号"
      },
      "識別値": src
    }
  } : JSON.parse(JSON.stringify(src));

  const targets = [];

  const dig = function(focus) {
    if (Array.isArray(focus)) {
      focus.forEach(a => dig(a));
    } else if (typeof focus === 'object') {
      if (focus["@type"] === "法人型" && focus["ID"] && focus["ID"]["識別値"]) {
        const key = focus["ID"]["識別値"];
        if (!util.isValidHoujinBangou(key)) {
          util.put(focus, "メタデータ", {
            "@type": "文書型",
            "説明": "法人番号は1～9ではじまる13桁の数字でなければなりません"
          });
        } else if (!util.isValidCheckDigit(key)) {
          util.put(focus, "メタデータ", {
            "@type": "文書型",
            "説明": "法人番号のチェックデジットが不正です"
          });
        } else {
          targets.push(focus);
        }
      }
      Object.keys(focus).forEach(key => {
        dig(focus[key]);
      });
    }
  };

  dig(dst);

  if (targets.length === 0) {
    return Promise.resolve(dst);
  }

  const db = levelup(leveldown(DATABASE));
  const promises = targets.map(target => {
    return db.get(target["ID"]["識別値"], {
      asBuffer: false
    }).then(str => {
      const json = JSON.parse(str);
      delete json["@context"];
      delete target["ID"];
      Object.keys(json).forEach(key => {
        util.put(target, key, json[key]);
      });
      return true;
    }).catch(e => {
      util.put(target, "メタデータ", {
        "@type": "文書型",
        "説明": "該当する法人番号がありません"
      });
      return true;
    });
  });
  return Promise.all(promises).then(() => db.close()).then(() => dst);
};
