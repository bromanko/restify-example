var _ = require('underscore')
    , restify = require('restify');

module.exports = {
  requireParams: function(requiredParams) {
    var toCheck = requiredParams;
    if (!_.isArray(toCheck))
      toCheck = [toCheck];

    return function(req, res, next) {
      var err = undefined;
      toCheck.forEach(function(param) {
        if (!req.params[param]) {
          err = new restify.BadRequestError('Must specify ' + param);
        }
      });

      return next(err);
    };
  }
};