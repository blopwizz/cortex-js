/*
 * Dev data
 * ********
 * Just listening to dev stream
 *
 */

const Cortex = require("../lib/cortex");
const CONFIG = require("../config.json");


function fetchDevData(client, onResult) {
  return client
    .createSession({ status: "active" })
    .then(() => client.subscribe({ streams: ["dev"] }))
    .then(subs => {
      if (!subs[0].dev) throw new Error("failed to subscribe");

      const headers = subs[0].dev.cols.slice();
      headers.unshift("seq", "time");
      headers.headers = true;

      let n = 0;
      const onDev = data => {
        if (n === 0) onResult(headers);
        onResult([n, data.time].concat(data.dev));
        n++;
      };

      client.on("dev", onDev);

      return () =>
        client
          .inspectApi()
          .then(() => client.unsubscribe({ streams: ["dev"] }))
          .then(() => client.updateSession({ status: "close" }))
          .then(() => client.removeListener("dev", onDev));
    });
}

if (require.main === module) {
  process.on("unhandledRejection", err => {
    throw err;
  });

  const verbose = process.env.LOG_LEVEL || 1;
  const options = { verbose };
  const client = new Cortex(options);
  // Authorization login
  const auth = {
      username: CONFIG.username, 
      password: CONFIG.password,
      client_id: CONFIG.client_id,
      client_secret: CONFIG.client_secret,
      debit:1 // first time you run example debit should > 0
    };

  client.ready
    .then(() => client.init(auth))
    .then(() => fetchData(client, data => console.log(data.join(","))))
    .then(finish => {
      console.warn(
        "Streaming dev data as CSV."
      );
    })
    .then(() => client.close())
    .then(() => {
      console.warn("Finished!");
    });
}

module.exports = fetchDevData;
