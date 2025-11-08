#!/bin/sh
PORT=${PORT:-3000}
exec node_modules/.bin/next start -H 0.0.0.0 -p $PORT
