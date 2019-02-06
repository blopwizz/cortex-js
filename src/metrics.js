/*
 * Numbers
 * *******
 *
 * This example shows processing numerical data, such as band power readings,
 * performance metrics, and accelerometer/gyro data.
 *
 * We take the band power data from every region and average it together to
 * get a an average band power for the whole brain, then we take both it and
 * the motion data amd run them over a rolling average.
 *
 * You can control the amount of averaging by setting the avgWindow parameter.
 * 1 is the same as no averaging at all.
 *
 */

const Cortex = require("../lib/cortex");
const CONFIG = require("../config.json");


function numbers(client, windowSize, onResult) {
  return client
    .createSession({ status: "active" })
    .then(() => client.subscribe({ streams: ["pow", "mot", "met"] }))
    .then(_subs => {
      const subs = Object.assign({}, ..._subs);
      if (!subs.pow || !subs.mot || !subs.met)
        throw new Error("failed to subscribe");

      // Create a list of all the column indices relevant to each band
      // (there'll be one per sensor)
      const bands = {
        theta: [],
        alpha: [],
        betaL: [],
        betaH: [],
        gamma: []
      };
      for (let i = 0; i < subs.pow.cols.length; i++) {
        // pow columns look like: IED_AF3/alpha
        const bandName = subs.pow.cols[i].split("/")[1];
        bands[bandName].push(i);
      }
      const bandNames = Object.keys(bands);

      // Motion data columns look like 'IMD_GYROX', this will make them look like 'gyroX'
      const makeFriendlyCol = col =>
        col.replace(
          /^IMD_(.*?)([XYZ]?)$/,
          (_, name, dim) => name.toLowerCase() + dim
        );

      const motCols = subs.mot.cols.map(makeFriendlyCol);

      // Set up our rolling average functions
      // met always gets a window size of 1 because at the basic subscription
      // level it's averaged over 10s anyway
      const averageMet = rollingAverage(subs.met.cols, 1);
      const averageMot = rollingAverage(motCols, windowSize);
      const averageBands = rollingAverage(bandNames, windowSize);

      const data = {};
      for (const col of [...motCols, ...subs.met.cols, ...bandNames]) {
        data[col] = 0;
      }

      const onMet = ev => maybeUpdate("met", averageMet(ev.met));
      client.on("met", onMet);

      const onMot = ev => maybeUpdate("mot", averageMot(ev.mot));
      client.on("mot", onMot);

      // This averages overall the sensors in the pow stream to give us our
      // "bands" stream
      const averageSensors = pow =>
        bandNames.map(bandName => {
          const sum = bands[bandName]
            .map(i => pow[i])
            .reduce((total, row) => total + row, 0);
          return sum / bands[bandName].length;
        });

      const onPow = ev =>
        maybeUpdate("bands", averageBands(averageSensors(ev.pow)));
      client.on("pow", onPow);

      // Choosing whether to update here is a bit tricky - we want to update
      // at the rate of the fastest stream, but we don't know which one that
      // will be. So we just wait until we get a second update for the same
      // stream to send everything - that stream must be the fastest.
      let hasUpdate = {};
      const maybeUpdate = (key, newdata) => {
        if (hasUpdate[key]) {
          onResult(data);
          hasUpdate = {};
        }
        hasUpdate[key] = true;
        Object.assign(data, newdata);
      };

      return () =>
        client
          .unsubscribe({ streams: ["pow", "mot", "met"] })
          .then(() => client.updateSession({ status: "close" }))
          .then(() => {
            client.removeListener("mot", onMot);
            client.removeListener("pow", onPow);
          });
    });
}

// Run from Nodejs console
//      When a file is run directly from Node.js, require.main is set to its module. 
//      That means that it is possible to determine whether a file has been run directly by testing require.main === module.
//      else it is required as a module
//      see doc at https://nodejs.org/docs/latest/api/all.html#modules_accessing_the_main_module
if (require.main === module) {
  process.on("unhandledRejection", err => {
    throw err;
  });

    // Arguments and verbose console parameters
  // - verbose : we can set LOG_LEVEL to 0, 1 or 2 with `setenv LOG_LEVEL 0` 
  //   for more detailed errors 
  // - arguments are put in an array
  // - cmd is popped from the array of arguments
  // - create a new Cortex client
  // - average window for smoothing data
  const verbose = process.env.LOG_LEVEL || 1;
  const options = { verbose };
  const client = new Cortex(options);
  const avgWindow = 10;

  const auth = {
    username: CONFIG.username,
    password: CONFIG.password,
    client_id: CONFIG.client_id,
    client_secret: CONFIG.client_secret,
    debit:1 // first time you run example debit should > 0
};

  client.ready.then(() => 
  client.init(auth)).then(() =>
    numbers(client, avgWindow, averages => {
      const output = Object.keys(averages)
        .map(k => `${k}: ${averages[k].toFixed(2)}`)
        .join(", ");
      console.log("Interest: " +averages["int"]);
      console.log("Stress: " +averages["str"]);
      console.log("Relaxation: " +averages["rel"]);
      console.log("Excitement: "+averages["exc"]);
      console.log("Engagement: "+averages["eng"]);
      console.log("Long-term excitement: "+averages["lex"]);
      console.log("Focus: "+averages["foc"]);
      console.log("--------------");
    })
  );

  // We could use the value returned by numbers) here, but when we ctrl+c it
  // will clean up the connection anyway
}

// Rolling average function
function rollingAverage(columns, windowSize) {
  let avgCount = 0;
  const averages = {};
  return row => {
    avgCount = Math.min(windowSize, avgCount + 1);

    columns.forEach((col, i) => {
      const oldAvg = averages[col] || 0;
      averages[col] = oldAvg + (row[i] - oldAvg) / avgCount;
    });

    return averages;
  };
}

module.exports = numbers;
