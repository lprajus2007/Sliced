const fs = require('fs')
const readline = require('readline')
const google = require('googleapis')
const GoogleAuth = require('google-auth-library')
const atob = require('atob')
const MailParser = require('mailparser').MailParser
//const parseAmazonEmail = require('utils/data-utils/amazonEmailParser').parseAmazonEmail
const { web } = require('./client_secret.json');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
const SCOPES = [ 'https://www.googleapis.com/auth/gmail.readonly' ]
const TOKEN_DIR = `${(process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE)}/.credentials/`
const TOKEN_PATH = `${TOKEN_DIR}gmail-nodejs-quickstart.json`

module.exports = {

  storeToken: function(token) {
    try {
      fs.mkdirSync(TOKEN_DIR)
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token))
    console.log(`Token stored to ${TOKEN_PATH}`)
  },

  getNewToken: function(oauth2Client, callback) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    console.log('Authorize this app by visiting this url: ', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.log('Error while trying to retrieve access token', err)
          return
        }
        oauth2Client.credentials = token
        this.storeToken(token)
        callback(oauth2Client)
      })
    })
  },

  authorize: function(credentials, callback) {
    const clientSecret = credentials.web.client_secret
    const clientId = credentials.web.client_id
    const redirectUrl = credentials.web.redirect_uris[0]
    const auth = new GoogleAuth()
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

    // Check if we have previously stored a token.
    oauth2Client.credentials = JSON.parse(credentials.token)
    callback(oauth2Client, this)
    // return new Promise((resolve, reject) => fs.readFile(TOKEN_PATH, (err, token) => {
    //   if (err) {
    //     this.getNewToken(oauth2Client, callback)
    //     reject()
    //   } else {
    //     oauth2Client.credentials = JSON.parse(token)
    //     resolve(callback(oauth2Client, this))
    //   }
    // }))
  },

  getMessage: function(auth, messageId/* , callback */) {
    const gmail = google.gmail('v1')
    return new Promise((resolve, reject) => gmail.users.messages.get({
      auth,
      userId: 'lprajus2007@gmail.com',
      id: messageId,
      format: 'raw'
    }, (err, response) => {
      const mailparser = new MailParser()

      // setup an event listener when the parsing finishes
      mailparser.on('end', (mailObject) => {
        const email = JSON.stringify(mailObject.html)
        //const parsedEmail = parseAmazonEmail(email)
        const parsedEmail = email
        resolve(parsedEmail)
      })

      if (err) {
        console.log(err)
        reject(err)
        return
      }
      mailparser.write(atob(response.raw.replace(/-/g, '+').replace(/_/g, '/')))
      mailparser.end()
    }))
  },

  listMessages: function(auth, context) {
    console.log(auth)
    const gmail = google.gmail('v1')
    return new Promise((resolve, reject) => gmail.users.messages.list({
      auth,
      userId: 'lprajus2007@gmail.com'
    }, (err, response) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      const messages = response.messages
      const result = []
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        result[i] = context.getMessage(auth, message.id)
      }
      Promise.all(result).then((res) => {
        resolve(res)
      })
    }))
  },

  getGmailMessages: function(token) {
    return new Promise((resolve, reject) => {
      resolve(this.authorize({ web, token }, this.listMessages))
    })
  }
}

