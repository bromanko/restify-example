var restify = require('restify')
    , Logger = require('bunyan')
    , security = require('./middleware/security')
    , representation = require('./middleware/representation');

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
    },
    auditLog: {
      name: 'audit',
      streams: [{
        stream: process.stdout
      }]
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


// Request validation
server.use(restify.acceptParser(server.acceptable));

// Logging
server.use(restify.requestLogger());

// Request transformation
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Authentication and authorization
server.use(security.authenticate());

//server.use(representation.responder());

if (CONFIG.server.auditLog) {
  server.on('after', restify.auditLogger({
    log: new Logger(CONFIG.server.auditLog)
  }));
}


server.listen(CONFIG.server.port, function() {
  server.log.info('%s listening at %s', server.name, server.url);
});