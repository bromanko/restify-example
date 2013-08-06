var restify = require('restify')
    , Logger = require('bunyan')
    , security = require('./middleware/security')
    , representation = require('./middleware/representation')
    , validation = require('./middleware/validation');

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

// Some convenience for transforming response objects
server.use(representation.responder());

if (CONFIG.server.auditLog) {
  server.on('after', restify.auditLogger({
    log: new Logger(CONFIG.server.auditLog)
  }));
}


// Route with only business logic
server.get('/', function(req, res, next) {
  res.json({
    version: '0.1'
  });
  return next();
});

// Route with a pipeline of methods
// The first function will ensure required params are passed
// The second function performs our actual business logic
server.get('/tasks', [validation.requireParams('status'), function(req, res, next) {
  res.json({
    tasks: [
      {
        name: 'Get groceries',
        status: 'Not done'
      },
      {
        name: 'Walk the cat',
        status: 'Not done'
      }
    ]
  });
  return next();
}]);

// Route with a pipeline of its own



server.listen(CONFIG.server.port, function() {
  server.log.info('%s listening at %s', server.name, server.url);
});