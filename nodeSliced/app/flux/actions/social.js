class SocialActions {

  constructor() {
    this.generateActions('setTwitterFriends', 'setEmails', 'clearEmails')
  }

  getTwitterFriends(twitterHandle) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        try {
          alt.getActions('requests').start()
          const response = await alt.request({ url: `/getTwitterFriends/${twitterHandle}` })
          this.setTwitterFriends(response)
        } catch (error) {
          console.log(error)
        }
        alt.getActions('requests').stop()
      })
  }

  getGmail(gapi) {
    gapi.client.load('gmail', 'v1', () => {
      const request = window.gapi.client.gmail.users.messages.list({
        userId: 'me'
      })
      request.execute((response) => {
        if (response) {
          response.messages.map((message) => {
            const req = gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: message.id
            })
            req.execute((res) => {
              this.setEmails(res)
            })
            return null
          })
        }
      })
    })
  }

  clearGmail() {
    this.clearEmails()
  }
}

export default SocialActions
