#!/usr/bin/env node

const fs = require('fs');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const enrichment = require("../main");

const optionDefinitions = [{
  name: 'help',
  alias: 'h',
  type: Boolean,
  description: 'このヘルプを表示します'
}, {
  name: 'file',
  alias: 'f',
  type: String,
  defaultOption: true,
  typeLabel: '{underline file}',
  description: '変換対象とする JSON ファイル'
}, {
  name: 'string',
  alias: 's',
  type: String,
  typeLabel: '{underline string}',
  description: '変換対象とする法人番号文字列',
}, {
  name: 'indent',
  alias: 'i',
  type: Number,
  typeLabel: '{underline number}',
  description: '出力する JSON のインデント (default 2)',
  defaultValue: 2
}];

const options = commandLineArgs(optionDefinitions);

if (options.help) {
  const usage = commandLineUsage([{
    header: 'imi-enrichment-hojin',
    content: '法人番号をもとに法人型の情報を補完します'
  }, {
    header: 'オプション',
    optionList: optionDefinitions
  }, {
    header: '実行例',
    content: [{
        desc: 'ヘルプの表示',
        example: '$ imi-enrichment-hojin -h'
      },
      {
        desc: '文字列の処理',
        example: '$ imi-enrichment-hojin -s 4000012090001'
      },
      {
        desc: 'ファイルの処理',
        example: '$ imi-enrichment-hojin input.json'
      },
      {
        desc: '標準入力の処理',
        example: '$ cat input.json | imi-enrichment-hojin'
      }
    ]
  }]);
  console.log(usage)
} else if (options.string) {
  enrichment(options.string).then(json => {
    console.log(JSON.stringify(json, null, options.indent));
  });
} else if (options.file) {
  const input = JSON.parse(fs.readFileSync(options.file, "UTF-8"));
  enrichment(input).then(json => {
    console.log(JSON.stringify(json, null, options.indent));
  });
} else {
  let buffer = "";
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', chunk => {
    buffer += chunk;
  }).on('end', () => {
    const input = JSON.parse(buffer);
    enrichment(input).then(json => {
      console.log(JSON.stringify(json, null, options.indent));
    });
  });
}
