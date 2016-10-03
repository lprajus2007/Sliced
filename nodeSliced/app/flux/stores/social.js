class SocialStore {

  constructor() {
    this.bindActions(this.alt.getActions('social'))
    this.twitter = []
    this.error = null
  }

  onSetTwitterFriends(friends) {
    console.log(friends)
    this.twitter = friends
    this.error = null
  }
}

export default SocialStore

