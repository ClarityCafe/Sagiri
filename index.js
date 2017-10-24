const Handler = require('./lib/Handler');
const Constants = require('./lib/Constants');
const Ratelimiter = require('./lib/Ratelimiter');
const Sagiri = Handler;

Sagiri.Handler = Handler;
Sagiri.Constants = Constants;
Sagiri.Ratelimiter = Ratelimiter;

module.exports = Sagiri;