import request from 'superagent'
import { nonceString } from 'utils/data-utils/string'
import oauthSignature from 'oauth-signature'

class oAuthActions {
  constructor() {
    this.generateActions('start', 'success')
  }

  fetchTwitterToken() {
    const httpMethod = 'POST' // Method to request via oauth
    const twitterConsumerKey = 'j7EBodP02a5ZFuy0u4hEZ97TS'
    const twitterConsumerSecret = 'Rew9SoyYlqfbYvsDhckOFpaYLf0xbK6ouNcwRKqDdixj6bJkgy'
    const oauthSignatureMethod = 'HMAC-SHA1' // sha1 signature
    const oauthNonce = nonceString(16) // generate random nonce for oauth
    const oauthTimestamp = new Date().getTime() / 1000 // timestamp in seconds
    const parameters = {
      oauth_consumer_key: twitterConsumerKey,
      oauth_nonce: oauthNonce,
      oauth_timestamp: oauthTimestamp,
      oauth_signature_method: oauthSignatureMethod,
      oauth_version: '1.0'
    }

    const twitterEndpoint = 'https://api.twitter.com/oauth/request_token'
    const encodedSignature = oauthSignature.generate(
      httpMethod, twitterEndpoint, parameters, twitterConsumerSecret
    )
    const authorizationHeaderString = `OAuth oauth_consumer_key="${twitterConsumerKey}",
    oauth_signature_method="${oauthSignatureMethod}",
    oauth_timestamp="${oauthTimestamp}",
    oauth_nonce="${oauthNonce}",
    oauth_version="1.0",
    oauth_signature="${encodedSignature}"`

    const promise = (resolve, reject) => {
      request
      .post(twitterEndpoint)
      .withCredentials()
      .auth(authorizationHeaderString)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', 'www.slicedrecommendations.com')
      .end((err, res) => {
        if (res.ok) {
          console.log(res)
          this.actions.success(res.body)
          return resolve()
        } else {
          console.error(err)
          return reject()
        }
      })
    }
    return promise
  }
}

export default oAuthActions
