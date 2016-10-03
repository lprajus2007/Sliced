import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'

@connect('social')
class LoginPage extends Component {

  static propTypes = { twitter: PropTypes.array }

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
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
      <form onSubmit={ ::this.handleSubmit }>
        <p className='alert alert-info'>{ i18n('login.help') }</p>
        <div className='form-group'>
          <label htmlFor='username'>
            { i18n('login.username.label') }
          </label>
          <input
            ref='username'
            type='text'
            name='username'
            className='form-control'
            placeholder={ i18n('login.username.placeholder') }
            required />
        </div>
        <div className='form-group'>
          <button className='btn btn-primary'>
            { i18n('login.submit') }
          </button>
        </div>
        <div>
        { twitter }
        </div>
      </form>
    )
  }

}

export default LoginPage
