# imi-enrichment-hojin

入力となる JSON-LD に含まれる `ID>識別値 をもつ 法人型` に対して各種のプロパティを補完して返します。

**input.json**

```input.json
{
  "@type": "法人型",
  "ID" : {
    "@type": "ID型",
    "識別値" : "4000012090001"
  }
}
```

**output.json**

```output.json
{
  "@type": "法人型",
  "組織種別": {
    "@type": "コード型",
    "コード種別": {
      "@type": "コードリスト型",
      "表記": "法人種別"
    },
    "識別値": "101",
    "表記": "国の機関"
  },
  "ID": {
    "@type": "ID型",
    "体系": {
      "@type": "ID体系型",
      "表記": "法人番号"
    },
    "識別値": "4000012090001"
  },
  "表記": "経済産業省",
  "名称": {
    "@type": "名称型",
    "表記": "経済産業省",
    "ローマ字表記": "Ministry of Economy, Trade and Industry",
    "カナ表記": "ケイザイサンギョウショウ"
  },
  "住所": [
    {
      "@type": "住所型",
      "種別": "国内所在地",
      "表記": "東京都 千代田区 霞が関１丁目３－１",
      "郵便番号": "1000013",
      "都道府県": "東京都",
      "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
      "市区町村": "千代田区",
      "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101"
    },
    {
      "@type": "住所型",
      "種別": "国内所在地(英語表記)",
      "表記": "1-3-1, Kasumigaseki, Chiyoda ku, Tokyo",
      "都道府県": "Tokyo"
    }
  ]
}
```

- 補完される情報は [国税庁法人番号公表サイト](https://www.houjin-bangou.nta.go.jp/) で公開されている情報を `法人型` にマッピングしたものとなります
- データソースは [国税庁法人番号公表サイト・基本3情報](https://www.houjin-bangou.nta.go.jp/download/) をダウンロードしたものです
- 本パッケージに添付されているデータは 令和元年12月27日更新 のものになります
- 所与の法人番号に問題がある場合には `メタデータ` プロパティにメッセージが記述されます

**output_with_error.json**

```
{
  "@context": "https://imi.go.jp/ns/core/context.jsonld",
  "@type": "法人型",
  "ID": {
    "@type": "ID型",
    "体系": {
      "@type": "ID体系型",
      "表記": "法人番号"
    },
    "識別値": "2876543210987"
  },
  "メタデータ": {
    "@type": "文書型",
    "説明": "該当する法人番号がありません"
  }
}
```

以下のエラーが検出されます

- 法人番号が 13桁の数字でない場合
- 法人番号の先頭が 2～9 でない場合
- 法人番号のチェックデジットが不正な場合
- 指定された法人番号が存在しない場合

# 利用者向け情報

以下の手順はパッケージアーカイブ `imi-enrichment-hojin-2.0.0.tgz` を用いて実行します。

## インストール

以下の手順でインストールします。

```
$ npm install imi-enrichment-hojin-2.0.0.tgz
```

## コマンドラインインターフェイス

`imi-enrichment-hojin-2.0.0.tgz` にはコマンドラインインターフェイスが同梱されており、
通常はインストールすると `imi-enrichment-hojin` コマンドが使用できるようになります。

コマンドラインインターフェイスのファイルの実体は `bin/cli.js` です。

```
$ npm install imi-enrichment-hojin-2.0.0.tgz

# ヘルプの表示
$ imi-enrichment-hojin -h

# JSON ファイルの変換
$ imi-enrichment-hojin input.json > output.json

# 標準入力からの変換
$ cat input.json | imi-enrichment-hojin > output.json

# 文字列からの変換
$ imi-enrichment-hojin -s 4000012090001 > output.json

```

または `npx` を使って以下のようにインストールせずに実行することも可能です。

```
$ npx imi-enrichment-hojin-2.0.0.tgz -s 4000012090001
```

## Web API

`imi-enrichment-hojin-2.0.0.tgz` には Web API を提供するサーバプログラムが同梱されています。

### サーバの起動方法

`bin/server.js` がサーバの実体です。
以下のように `bin/server.js` を実行することで起動できます。

```
$ npm install imi-enrichment-hojin-2.0.0.tgz
$ node node_modules/imi-enrichment-hojin/bin/server.js
Usage: node server.js [port number]

$ node node_modules/imi-enrichment-hojin/bin/server.js 8080
imi-enrichment-hojin-server is running on port 8080
```

なお、実行時にはポート番号の指定が必要です。指定しなかった場合にはエラーが表示されて終了します。
サーバを停止するには `Ctrl-C` を入力してください。

### 利用方法

WebAPI は POST された JSON または テキストを入力として JSON を返します。

```
$ curl -X POST -H 'Content-Type: application/json' -d '{"@type":"法人型","ID":{"識別値":"4000012090001"}}' localhost:8080
{
  "@type": "法人型",
  "組織種別": {
    "@type": "コード型",
    "コード種別": {
      "@type": "コードリスト型",
      "表記": "法人種別"
    },
    "識別値": "101",
    "表記": "国の機関"
  },
  "ID": {
    "@type": "ID型",
    "体系": {
      "@type": "ID体系型",
      "表記": "法人番号"
    },
    "識別値": "4000012090001"
  },
  "表記": "経済産業省",
  "名称": {
    "@type": "名称型",
    "表記": "経済産業省",
    "ローマ字表記": "Ministry of Economy, Trade and Industry",
    "カナ表記": "ケイザイサンギョウショウ"
  },
  "住所": [
    {
      "@type": "住所型",
      "種別": "国内所在地",
      "表記": "東京都 千代田区 霞が関１丁目３－１",
      "郵便番号": "1000013",
      "都道府県": "東京都",
      "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
      "市区町村": "千代田区",
      "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101"
    },
    {
      "@type": "住所型",
      "種別": "国内所在地(英語表記)",
      "表記": "1-3-1, Kasumigaseki, Chiyoda ku, Tokyo",
      "都道府県": "Tokyo"
    }
  ]
}
```

```
$ curl -X POST -H 'Content-Type: text/plain' -d '4000012090001' localhost:8080
{
  "@type": "法人型",
  "組織種別": {
    "@type": "コード型",
    "コード種別": {
      "@type": "コードリスト型",
      "表記": "法人種別"
    },
    "識別値": "101",
    "表記": "国の機関"
  },
  "ID": {
    "@type": "ID型",
    "体系": {
      "@type": "ID体系型",
      "表記": "法人番号"
    },
    "識別値": "4000012090001"
  },
  "表記": "経済産業省",
  "名称": {
    "@type": "名称型",
    "表記": "経済産業省",
    "ローマ字表記": "Ministry of Economy, Trade and Industry",
    "カナ表記": "ケイザイサンギョウショウ"
  },
  "住所": [
    {
      "@type": "住所型",
      "種別": "国内所在地",
      "表記": "東京都 千代田区 霞が関１丁目３－１",
      "郵便番号": "1000013",
      "都道府県": "東京都",
      "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
      "市区町村": "千代田区",
      "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101"
    },
    {
      "@type": "住所型",
      "種別": "国内所在地(英語表記)",
      "表記": "1-3-1, Kasumigaseki, Chiyoda ku, Tokyo",
      "都道府県": "Tokyo"
    }
  ]
}
```

- WebAPI の URL に GET メソッドでアクセスした場合には HTML ページが表示され、WebAPI の動作を確認することができます
- POST,GET 以外のメソッドでアクセスした場合には `405 Method Not Allowed` エラーが返されます
- `Content-Type: application/json` ヘッダが設定されている場合は、POST Body を JSON として扱い、JSON に対しての変換結果を返します
- `Content-Type: application/json` ヘッダが設定されているが POST Body が JSON としてパースできない場合は `400 Bad Request` エラーが返されます
- `Content-Type: application/json` ヘッダが設定されていない場合は、POST Body を法人番号文字列として扱い、法人番号をもとに情報の補完された法人型を返します

## API (Node.js)

モジュール `imi-enrichment-hojin` は以下のような API の関数を提供します。

```
module.exports = function(input) {..}
```

- 入力 (input) : 変換対象となる JSON または法人番号文字列(1～9から始まる13桁の数字)
- 出力 : 変換結果の JSON-LD オブジェクトを返却する Promise ※ 変換は非同期で行うために Promise が返されます

```
const convert = require('imi-enrichment-hojin');
convert("4000012090001").then(json=>{
  console.log(json);
});
```

# 開発者向け情報

以下の手順はソースコードアーカイブ `imi-enrichment-hojin-2.0.0.src.tgz` を用いて実行します。

## 準備

[国税庁法人番号公表サイト・全件データのダウンロード（各都道府県別）](https://www.houjin-bangou.nta.go.jp/download/zenken/) から
**CSV 形式・Unicode** をダウンロードします（47都道府県+国外の全48ファイル)。
ダウンロードしたファイルは `01_hokkaido_all_20191227.zip` のような zip ファイルで、
これらのファイルを `/tmp/zenken/` フォルダに保存するものとします。

## 環境構築

以下の手順で環境を構築します。

```
$ mkdir imi-enrichment-hojin
$ cd imi-enrichment-hojin
$ tar xvzf /tmp/imi-enrichment-hojin-2.0.0.src.tgz
$ npm install
$ mkdir cache
$ cp /tmp/zenken/*.zip cache
$ npm run setup
```

## テスト

以下の手順でテストを実行します

```
$ cd imi-enrichment-hojin
$ npm test
```


## ブラウザビルド(参考情報)

`imi-enrichment-hojin` はブラウザ上での直接動作をサポートしていません。
WebAPI を使用してください。
