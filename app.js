var restify = require('restify')
    , Logger = require('bunyan');

// Pick your poison for config. Perhaps node-config.
// For the purposes of this example I'll just use this object.
var CONFIG = {
  server: {
    port: 3000,
    log: {
      name: "restify_api",
      streams: [
        {
          stream: process.stdout,
          level: 'trace'
        },
        {
          path: 'log/restify_api.log',
          level: 'debug'
        }
      ]
    }
  }
};

var opts = {
  name: 'Hello Restify'
};
if (CONFIG.server.log) {
  opts.log = new Logger(CONFIG.server.log);
}
var server = restify.createServer(opts);

server.listen(CONFIG.server.port, function() {
  server.log.info('%s listening at %s', server.name, server.url);
});