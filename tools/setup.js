const Papa = require("papaparse");
const format = require("./format");

const levelup = require('levelup');
const leveldown = require('leveldown');

const DATABASE = process.argv[2];

const db = levelup(leveldown(DATABASE));

/*
db.open().then(() => {
  console.log("database opened");
  const promises = [];
  process.stdin.pipe(Papa.parse(Papa.NODE_STREAM_INPUT, {
    encoding: "UTF-8"
  })).on("data", function(f) {
    const data = format(f);
    if (!data) return;

    const key = data["ID"]["識別値"];
    promises.push(db.put(key, JSON.stringify(data)));

    if (promises.length % 10000 === 0)
      console.log(promises.length);
  }).on("end", function() {
    Promise.all(promises).then(() => {
      console.log("end of input");
      return db.close();
    }).then(() => {
      console.log("database closed")
    });
  });
});*/


/*
real    10m3.038s
user    5m20.063s
sys     3m14.156s

const promises = [];

process.stdin.pipe(Papa.parse(Papa.NODE_STREAM_INPUT, {
  encoding: "UTF-8"
})).on("data", function(f) {
  const data = format(f);
  if (!data) return;

  const key = data["ID"]["識別値"];
  promises.push(db.put(key, JSON.stringify(data)));

  if (promises.length % 10000 === 0)
    console.error(promises.length);
}).on("end", function() {

  Promise.all(promises).then(a => {
    console.error("end of input");
  });
});
*/

const SIZE = 100000;
// 10000 : 6m37.628s
// 100000 : 3m48.405s

let chain = null;
const promises = [];
let count = 0;

function flash() {
  console.log("flash " + count);
  promises.push(chain.write());
  chain = null;
}

db.open().then(() => {
  console.log("database opened");
  process.stdin.pipe(Papa.parse(Papa.NODE_STREAM_INPUT, {
    encoding: "UTF-8"
  })).on("data", function(f) {
    const data = format(f);
    if (!data) return;

    const key = data["ID"]["識別値"];

    if (chain === null) {
      chain = db.batch();
    }
    chain.put(key, JSON.stringify(data));
    count++;

    if (count % SIZE === 0) {
      flash();
    }

  }).on("end", function() {

    if (chain !== null) {
      flash();
    }

    Promise.all(promises).then(() => {
      console.error("done");
      db.close().then(a => {
        console.log("database closed");
      });
    });
  });

});
