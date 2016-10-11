import { users } from './data.json'
import Twitter from 'twitter'
import Social from './social'

const simplifyUsers = (collection) => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ email, name, seed, picture }) => ({ email, name, seed, picture }))

function routes(router) {
  router.get('/users', async function (ctx) {
    console.log('users route on server');
    ctx.body = simplifyUsers(users.slice(0, 10))
  })

  router.post('/getGmail', async function (ctx) {
    console.log(ctx)
    var { token } = ctx.params
    let response = Social.getGmailMessages(token)
    ctx.body = await response
  })

  router.get('/getTwitterFriends/:twitterHandle', async function (ctx) {
    //console.log('twitter friends')
    const twitterConsumerKey = 'j7EBodP02a5ZFuy0u4hEZ97TS'
    const twitterConsumerSecret = 'Rew9SoyYlqfbYvsDhckOFpaYLf0xbK6ouNcwRKqDdixj6bJkgy'
    const twitterAccessTokenKey = '169893016-c39HAa7ef7WEqa8t6hOKvgxN68YspGQncC3lCAwn'
    const twitterAccessTokenSecret = 'xcQvfGUB8LjX8vHpkUL6xt2lpR3pHrFcNon6oTEC6BoEI'

    var client = new Twitter({
      consumer_key: twitterConsumerKey,
      consumer_secret: twitterConsumerSecret,
      access_token_key: twitterAccessTokenKey,
      access_token_secret: twitterAccessTokenSecret
    })
    var { twitterHandle } = ctx.params
    var params = { screen_name: twitterHandle }
    let response = new Promise ((resolve, reject) => client.get('friends/list', params, function(error, tweets, response) {
      let names = JSON.parse(response.body).users.map((friend) => friend.name);
      if (!error) {
        resolve(names)
      }
      else reject(error)
    }))
    ctx.body = await response
  })

  router.get('/users/:seed', async function (ctx) {
    const { seed } = ctx.params
    const [ result ] = simplifyUsers(users.filter(user => user.seed === seed))
    if (!result) {
      ctx.body = { error: { message: 'User not found' } }
    } else {
      ctx.body = result
    }
  })
}

// can't export directly function, run into const issue
// see: https://phabricator.babeljs.io/T2892
export default routes
