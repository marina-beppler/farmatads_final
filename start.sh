#!/bin/bash

# Start Vue app
cd farmatads
npm run serve &

# Go back to the root directory
cd ..

# Start Node.js backend
cd farmatads/backend
node index.js

