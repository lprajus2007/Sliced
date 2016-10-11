class SocialStore {

  constructor() {
    this.bindActions(this.alt.getActions('social'))
    this.twitter = []
    this.error = null
    this.emails = []
  }

  onSetTwitterFriends(friends) {
    this.twitter = friends
    this.error = null
  }

  onSetEmails(emails : Object) {
    this.setState({ emails: this.emails.concat(emails) })
  }

  onClearEmails() {
    this.setState({ emails: [] })
  }
}

export default SocialStore

