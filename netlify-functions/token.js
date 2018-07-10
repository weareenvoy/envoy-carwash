var admin = require('firebase-admin')

var serviceAccount = require('./serviceAccountKey.json')

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://envoy-carwash.firebaseio.com'
})

var additionalClaims = {
  admin: true
}

exports.handler = function(event, context, callback) {
  var email = event.body.email

  admin
    .auth()
    .createCustomToken(email, additionalClaims)
    .then(function(customToken) {
      // Send token back to client
      callback(null, {
        statusCode: 200,
        body: customToken
      })
    })
    .catch(function(error) {
      console.log('Error creating custom token:', error)
    })
}
