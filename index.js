const Handler = require('./lib/Handler');
const Constants = require('./lib/Constants');
const Ratelimiter = require('./lib/Ratelimiter');

function Sagiri(key, options) {
    return new Handler(key, options);
}

Sagiri.Handler = Handler;
Sagiri.Constants = Constants;
Sagiri.Ratelimiter = Ratelimiter;

module.exports = Sagiri;