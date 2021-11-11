# reach-algo-testnet-rps
Testing reach.sh on the algorand testnet

## Windows Setup

Follow setup instructions here: https://docs.reach.sh/guide-windows.html

Clone this repo to a WSL directory. E.g. `\\wsl$\Ubuntu\home\hutch120\reach\demo`

You will certainly need to install some additional libraries
e.g. nodejs, yarn, gcc, and more... follow the error trail for the required libraries.

## Program Setup

### Create secrets.js

Copy secrets_template.js to secrets.js and add the account details.

### Compile Reach App

`./reach compile`

Should now have a file called ./build/index.main.mjs

### Install dependancies

`yarn`

### Run

`yarn start`

