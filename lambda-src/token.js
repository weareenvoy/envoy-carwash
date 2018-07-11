require('dotenv').config()
const admin = require('firebase-admin')

admin.initializeApp({
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

const statusCode = 200
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}

exports.handler = function(event, context, callback) {
  console.log(event)
}
