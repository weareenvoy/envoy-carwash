const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.sendNotifications = functions.database.ref('/flamelink/environments/production/content/carwash/en-US/{carwashId}').onCreate(event => {
  const createdData = event.val()

  const payload = {
    notification: {
      title: `Envoy Carwash`,
      body: `There is a new active carwash for ${createdData.name}`,
      icon:
        'https://firebasestorage.googleapis.com/v0/b/envoy-carwash.appspot.com/o/carwash-icon--black.png?alt=media&token=6d08ecde-a455-46d8-82ae-e38d78a0ecce',
      requireInteraction: 'true',
      click_action: 'https://envoycarwash.netlify.com/'
    }
  }

  // Clean invalid tokens
  function cleanInvalidTokens(tokensWithKey, results) {
    const invalidTokens = []

    results.forEach((result, i) => {
      if (!result.error) return

      console.error('Failure sending notification to', tokensWithKey[i].token, result.error)

      switch (result.error.code) {
        case 'messaging/invalid-registration-token':
        case 'messaging/registration-token-not-registered':
          invalidTokens.push(
            admin
              .database()
              .ref('/tokens')
              .child(tokensWithKey[i].key)
              .remove()
          )
          break
        default:
          break
      }
    })

    return Promise.all(invalidTokens)
  }

  return admin
    .database()
    .ref('/tokens')
    .once('value')
    .then(data => {
      if (!data.val()) return

      const snapshot = data.val()
      const tokensWithKey = []
      const tokens = []

      for (let key in snapshot) {
        tokens.push(snapshot[key].token)
        tokensWithKey.push({
          token: snapshot[key].token,
          key: key
        })
      }

      return admin
        .messaging()
        .sendToDevice(tokens, payload)
        .then(response => cleanInvalidTokens(tokensWithKey, response.results))
    })
})
