import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import EmailView from 'components/emailView'

@connect('social')
class LoginPage extends Component {

  static propTypes = { twitter: PropTypes.array }

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.renderGoogleSignIn()
  }

  state = {
    showLogout: false
  }

  renderGoogleSignIn() {
    window.gapi.signin2.render('g-signin2', {
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
      onsuccess: ::this.onSignIn
    })
  }

  onSignIn() {
    window.gapi.auth2.init({
      client_id: '902317062753-fo92bj01t0n6topc4mbm8i917pm7va5m.apps.googleusercontent.com'
    }).then(() => {
      this.setState({
        showLogout: window.gapi.auth2.getAuthInstance().isSignedIn.get()
      })
      this.context.flux.getActions('social').getGmail(window.gapi)
    })
  }

  onSignOut() {
    window.gapi.auth2.getAuthInstance().signOut().then(() => {
      this.setState({
        showLogout: false
      }, () => {
        this.renderGoogleSignIn()
      })
      this.context.flux.getActions('social').clearGmail()
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { flux } = this.context
    const data = Object.keys(this.refs).reduce((res, input) =>
      ({ ...res, [input]: this.refs[input].value }), {})
    const response = flux.getActions('social').getTwitterFriends(data.username)
    console.log(response)
  }

  render() {
    const { i18n } = this.context
    let { twitter } = this.props

    return (
      <div>
        <form onSubmit={ ::this.handleSubmit } style={ { textAlign: 'center' } }>
          <p className='alert alert-info'>{ i18n('login.helpsignIn') }</p>
          <div id='content' />
          <div className='form-group'>
            { !this.state.showLogout ? <div id='g-signin2' style={ { width: '240px', margin: '0px auto', display: 'inline-block' } } ></div>
            : <div style={ { width: '240px', height: '50px', display: 'inline-block' } } onClick={ ::this.onSignOut } > Sign Out</div> }
            <div />
            <label htmlFor='username'>
              { i18n('login.username.label') }
            </label>
            <input
              ref='username'
              type='text'
              name='username'
              className='form-control'
              placeholder={ i18n('login.username.placeholder') }
              required style={ { marginTop: '20px', marginLeft: '10px' } } />
          </div>
          <div className='form-group'>
            <button className='btn btn-primary' style={ { marginTop: '20px' } }>
              { i18n('login.submit') }
            </button>
          </div>
          <div>
          { twitter }
          </div>
        </form>
        <EmailView />
      </div>
    )
  }

}

export default LoginPage
