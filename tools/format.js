const PROCESS = {
  "01": "新規",
  "11": "商号又は名称の変更",
  "12": "国内所在地の変更",
  "13": "国外所在地の変更",
  "21": "登記記録の閉鎖等",
  "22": "登記記録の復活等",
  "71": "吸収合併",
  "72": "吸収合併無効",
  "81": "商号の登記の抹消",
  "99": "削除"
};

const KIND = {
  "101": "国の機関",
  "201": "地方公共団体",
  "301": "株式会社",
  "302": "有限会社",
  "303": "合名会社",
  "304": "合資会社",
  "305": "合同会社",
  "399": "その他の設立登記法人",
  "401": "外国会社等",
  "499": "その他"
};

const CLOSE = {
  "01": "清算の結了等",
  "11": "合併による解散等",
  "21": "登記官による閉鎖",
  "31": "その他の清算の結了等"
};

module.exports = function(f) {
  if (!f || f[1] === undefined) return null;

  const data = {
    "@context": "https://imi.go.jp/ns/core/context.jsonld",
    "@type": "法人型",
    "組織種別": {
      "@type": "コード型",
      "コード種別": {
        "@type": "コードリスト型",
        "表記": "法人種別"
      },
      "識別値": f[8],
      "表記": KIND[f[8]]
    },
    "ID": {
      "@type": "ID型",
      "体系": {
        "@type": "ID体系型",
        "表記": "法人番号"
      },
      "識別値": f[1],
    },
    "表記": f[6],
    "名称": {
      "@type": "名称型",
      "表記": f[6]
    },
    "住所": []
  };

  if (f[24] !== "")
    data["名称"]["ローマ字表記"] = f[24];

  if (f[28] !== "")
    data["名称"]["カナ表記"] = f[28];

  if (f[7] !== "")
    data["名称"]["画像"] = `https://www.houjin-bangou.nta.go.jp/image?imageid=${f[7]}`;


  if (f[9] !== "") {
    const a = {
      "@type": "住所型",
      "種別": "国内所在地",
      "表記": `${f[9]} ${f[10]} ${f[11]}`,
      "郵便番号": f[15],
      "都道府県": f[9],
      "都道府県コード": `http://data.e-stat.go.jp/lod/sac/C${f[13]}000`,
      "市区町村": f[10],
      "市区町村コード": `http://data.e-stat.go.jp/lod/sac/C${f[13]}${f[14]}`
    };
    if (f[12].length > 0) a["画像"] = `https://www.houjin-bangou.nta.go.jp/image?imageid=${f[12]}`;
    data["住所"].push(a);
  }

  if (f[25] !== "") {
    const a = {
      "@type": "住所型",
      "種別": "国内所在地(英語表記)",
      "表記": `${f[26]}, ${f[25]}`,
      "都道府県": f[25]
    };
    if (f[12].length > 0) a["画像"] = `https://www.houjin-bangou.nta.go.jp/image?imageid=${f[12]}`;
    data["住所"].push(a);
  }

  if (f[16] !== "") {
    const a = {
      "@type": "住所型",
      "種別": "国外所在地",
      "表記": f[16]
    };
    if (f[17].length > 0) a["画像"] = `https://www.houjin-bangou.nta.go.jp/image?imageid=${f[17]}`;
    data["住所"].push(a);
  }

  if (f[27] !== "") {
    const a = {
      "@type": "住所型",
      "種別": "国外所在地(英語表記)",
      "表記": f[27]
    };
    if (f[17].length > 0) a["画像"] = `https://www.houjin-bangou.nta.go.jp/image?imageid=${f[17]}`;
    data["住所"].push(a);
  }

  if (data["住所"].length === 0) delete data["住所"];
  else if (data["住所"].length === 1) data["住所"] = data["住所"][0];


  if (f[19] !== "") {
    const a = {
      "@type": "状況型",
      "種別コード": {
        "@type": "コード型",
        "コード種別": {
          "@type": "コードリスト型",
          "表記": "登記記録の閉鎖等の事由"
        },
        "識別値": f[19],
        "表記": CLOSE[f[19]]
      },
      "日時": {
        "@type": "日時型",
        "標準型日時": f[18]
      }
    };
    if (f[20] !== "")
      a["関与"] = {
        "@type": "関与型",
        "役割": "継承先法人",
        "関与者": {
          "@type": "法人型",
          "ID": {
            "@type": "ID型",
            "体系": {
              "@type": "ID体系型",
              "表記": "法人番号"
            },
            "識別値": f[20]
          }
        }
      }
    data["活動状況"] = a;
  }

  return data;
};
