const Handler = require('./Handler');
const Constants = require('./Constants');
const Ratelimiter = require('../lib/Ratelimiter');
const Sagiri = Handler;

Sagiri.Handler = Handler;
Sagiri.Constants = Constants;
Sagiri.Ratelimiter = Ratelimiter;

module.exports = Sagiri;