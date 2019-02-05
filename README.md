# 🧠 Cortex JS
A set of NodeJS examples to get started with the Cortex API for Emotiv EEG headsets. For more information about Cortex API, see [Cortex API documentation](https://emotiv.github.io/cortex-docs). These examples use code from Emotiv starter examples for Cortex API, check out https://github.com/Emotiv/cortex-example. 

### Requirements
You will need :
* An Emotiv headset with the USB dongle (tested with Epoc v1.1)
* [Nodejs](https://nodejs.org) installed (version 7.10.1+ is required to use await/async)


### Getting started
* Sign up or login on [Emotiv Developers website](https://www.emotiv.com/developer/) and install CortexUI.
* Create a Cortex app on https://www.emotiv.com/my-account/cortex-apps/. Take note of your credentials.
* Clone the repository, cd into the repo and do `npm install`. 
* Edit `config-example.json` to fill your Emotiv credentials and save the file as `config.json`. Check that this configuration file is included in `.gitignore` to avoid any sensitive data to be unintentionally uploaded on a public repository on Github. 
* Plug the USB dongle in the computer. Turn on the headset. 
* Start the hello-world example with `node hello.js`. You should see your Client ID appearing.

### Common errors
* Request timeout

### Useful resources
* This code makes extensive use of asynchronous requests using Promises and async/await. If you never heard these words or if you just need a refresher, check out this [great explanation on Youtube](https://www.youtube.com/watch?v=gB-OmN1egV8) by Tyler McGinnis. 
