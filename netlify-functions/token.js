var admin = require('firebase-admin')

var serviceAccount = require('./serviceAccountKey.json')

var app = admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'envoy-carwash',
    private_key_id: `${process.env.PRIVATE_KEY_ID}`,
    private_key: `${process.env.PRIVATE_KEY}`,
    client_email: `${process.env.CLIENT_EMAIL}`,
    client_id: `${process.env.CLIENT_ID}`,
    auth_uri: `${process.env.AUTH_URI}`,
    token_uri: `${process.env.TOKEN_URI}`,
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `${process.env.CLIENT_CERT}`
  }),
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
