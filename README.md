# 🧠 Cortex JS
A set of NodeJS examples to get started with the Cortex API for Emotiv EEG headsets. For more information about Cortex API, see [Cortex API documentation](https://emotiv.github.io/cortex-docs). These examples use code from [Emotiv starter examples for Cortex API](https://github.com/Emotiv/cortex-example).

## Requirements
You will need :
* An Emotiv headset with the USB dongle (tested with Epoc v1.1)
* [Nodejs](https://nodejs.org) installed (version 7.10.1+ is required to use await/async)

## Getting started
1. Sign up or login on [Emotiv Developers website](https://www.emotiv.com/developer/) and install CortexUI.
2. Create a Cortex app on your [Emotiv Account](https://www.emotiv.com/my-account/cortex-apps/). Take note of your credentials.
3. Clone this repository, `cd` into the repo and do `npm install` to install the dependencies. 
4. Edit `config-example.json` to fill your Emotiv credentials and save the file as `config.json`. Check that this configuration file is included in `.gitignore` to avoid any sensitive data to be unintentionally uploaded on a public repository on Github. 🙈
5. Plug the USB dongle in the computer. Turn on the headset. Make sure that the headset is running on battery (not connected to the computer via USB cable).
6. Start the hello-world example with `node hello.js`. You should see your Client ID appearing.

## Common errors
* Request timeout : happens from time to time ... restart the app.

## Ideas of things to do
* raw.js fix
* headset.js fix
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

## Useful resources
* This code makes extensive use of asynchronous requests using Promises and async/await. If you never heard these words or if you just need a refresher, check out this [great explanation on Youtube](https://www.youtube.com/watch?v=gB-OmN1egV8) by Tyler McGinnis. 
