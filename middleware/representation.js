var jiggler = require('jiggler');

module.exports = {
  // This middleware provides a helper method to the response object: `represent`
  // This method allows for leveraging jiggler templates for fine-grained control
  // of response output
  responder: function() {
    return function(req, res, next) {
      res.represent = function(statusCode, template, key, object, options) {
        if (typeof statusCode !== 'number') {
          object = key;
          key = template;
          template = statusCode;
          statusCode = 200;
        }
        jiggler.as[template](object, options, function(err, serialized) {
          if (err) { return next(err); }

          var output = {};
          output[key] = serialized;
          res.json(statusCode, output);
        });
      };

      return next();
    }
  }
};