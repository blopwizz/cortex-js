# 🧠 Cortex JS
A set of NodeJS examples to get started with the Cortex API for Emotiv EEG headsets. For more information about Cortex API, see [Cortex API documentation](https://emotiv.github.io/cortex-docs). These examples use code from [Emotiv starter examples for Cortex API](https://github.com/Emotiv/cortex-example).

## Requirements
You will need :
* An Emotiv headset with the USB dongle (tested with Epoc v1.1)
* [Nodejs](https://nodejs.org) installed (version 7.10.1+ is required to use await/async)

## Getting started
1. Sign up or login on [Emotiv Developers website](https://www.emotiv.com/developer/) and install CortexUI. Run CortexUI.
2. Create a Cortex app on your [Emotiv Account](https://www.emotiv.com/my-account/cortex-apps/). Take note of your credentials.
3. Clone this repository, `cd` into the repo and do `npm install` to install the dependencies. 
4. Edit `config-example.json` to fill your Emotiv credentials and save the file as `config.json`. Check that this configuration file is included in `.gitignore` to avoid any sensitive data to be unintentionally uploaded on a public repository on Github. 🙈
5. Plug the USB dongle in the computer. Turn on the headset. Make sure that the headset is running on battery (not connected to the computer via USB cable).
6. Start the hello-world example with `node hello.js`. You should see your Client ID appearing.

## Common problems and quick fix
* `JSONRPCError: Request timed out.` : happens from time to time, try again command line.
* `TypeError: Cannot read property 'length' of null` : happens sometimes when headset is not ready yet. Try again.
* `JSONRPCError: No headset connected.` : Redo step (5) step by step. After plugging the USB dongle, one LED lights up on the dongle. After turning on the headset, a second LED should light up on the dongle. If not, try again and wait for some 10 seconds between each step. (to let time for the bluetooth connection to establish)

## Examples

### Streams

Name | Description | Example
--- | --- | ---
mot | Motion data stream from the accelerometer/gyroscope | 
eeg | Raw EEG data stream (require license)| [raw.js](https://github.com/blopwizz/cortex-js/blob/master/src/raw.js)
com |	Mental Command Event |
fac |	Facial Expression Event |
met |	Performance Metrics data stream | [metrics.js](https://github.com/blopwizz/cortex-js/blob/master/src/metrics.js)
dev |	Device data  stream including battery level , signal strength, and signal quality all of channel headset | [dev.js](https://github.com/blopwizz/cortex-js/blob/master/src/dev.js)
pow |	Band Power data stream |
sys |	System event (to setup training) |

## Contribution : Scripts up and working
* events.js
* raw.js
* dev.js – Device data stream includeing battery level , signal strength, and signal quality all of channel headset
* headset.js status, show – headset info
* numbers.js – all streams
* metrics.js – performance metrics stream

## Contribution : Ideas of things to do
* ~~raw.js fix~~
* ~~headset.js update fix~~
* ~~numbers.js auth fix (with config file)~~
* refactor code with :direct execution, module exports, utils
* include checkheadset check in cortex js lib
* check out REPL example
* Training example
* Facial Expression training
* Mental Command training
* Motion logger
* EEG Logger
* Plot data viz examples 
* UI example
* OSC example (UDP protocol often used in interactive real-time applications)
* Workflow illustration
* Estimation of battery time left

## Non documented Cortex methods
These are some methods used in the code that are **not documented** at the moment in [Cortex API documentation](https://emotiv.github.io/cortex-docs). These should be documented.
* inspectApi()
* updateHeadset()

## Useful resources
* This code makes extensive use of asynchronous requests using Promises and async/await. If you never heard these words or if you just need a refresher, check out this [great explanation on Youtube](https://www.youtube.com/watch?v=gB-OmN1egV8) by Tyler McGinnis. 
* Matching regular expressions are super useful to format data. Check out this [interactive lesson here](https://regexone.com).
