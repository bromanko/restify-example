var Auth = module.exports = {
  authenticate: function() {
    return function(req, res, next) {
      // The request will need to provide some authentication credentials
      // This can be done via a query string API key, or HTTP headers
      // such as HMAC or HTTP Basic Authentication

      // Those credentials should be compared against your data store and
      // matched with the correct user.

      // The found user is then added to the request object for
      // use in later parts of the pipeline

      // Since this method is purely for authentication purposes
      // We do not fail the request for failing to authenticate
      // Authorization is handled later in the pipeline

      if (!req.params.access_token) { return next(); }

      var tokenParts = decodeAccessToken(req.params.access_token);

      loadUserFromDataStore(tokenParts.userId, tokenParts.secret, function(err, user) {
        if (err || !user) { return next(); }

        req.currentUser = user;
        return next();
      });
    }
  }
};

function decodeAccessToken(accessToken) {
  // This is where we would decode an encrypted token
  // and convert it to component parts
  return {
    version: version,
    userId: userId,
    secret: secret
  };
}

function loadUserFromDataStore(userId, secret, callback) {
  // This is where we would load the user specified
  // in the accessToken from the data store
  // We would also compare the secret with the hashed secret in
  // our data store
  var user = {
    id: userId,
    firstName: '',
    lastName: ''
  };
  return callback(undefined, user);
}