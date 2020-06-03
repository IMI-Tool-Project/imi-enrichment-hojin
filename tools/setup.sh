#!/usr/bin/env bash

# 準備: https://www.houjin-bangou.nta.go.jp/download/zenken/ から CSV 形式・Unicode を全48ファイルダウンロードして cache ファルダに保存

SCRIPT_DIR=$(cd $(dirname $0); pwd)
CACHE_DIR=${SCRIPT_DIR}/../cache
DATABASE_DIR=${SCRIPT_DIR}/../db

#(find ${CACHE_DIR}/*.zip -exec unzip -p {} '*.csv' \;) | node ${SCRIPT_DIR}/c2j.js | gzip > ${OUTPUT_DIR}/data.txt.gz

rm -fR ${DATABASE_DIR}
mkdir ${DATABASE_DIR}

for zip in `find ${CACHE_DIR}/*.zip ` ; do
  echo ${zip}
  unzip -p ${zip} '*.csv' | node ${SCRIPT_DIR}/setup.js ${DATABASE_DIR}
done

# (find ${CACHE_DIR}/*.zip -exec unzip -p {} '*.csv' \;) | node ${SCRIPT_DIR}/c2j.js ${DATABASE_DIR}
# (find ${CACHE_DIR}/13_*.zip -exec unzip -p {} '*.csv' \;) | node ${SCRIPT_DIR}/c2j.js ${DATABASE_DIR}
