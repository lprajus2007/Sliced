import React, { Component, PropTypes } from 'react'

class LoginPage extends Component {

  static contextTypes = {
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  handleSubmit(e) {
    e.preventDefault()
    // const { flux } = this.context

    // const token = flux.getActions('oauth').fetchTwitterToken()

    // // Use `refs` it fixes `null` values from state when field has
    // // been autocompleted from the browser on first render or using
    // // autofill from browser on click into input
    // const data = Object.keys(this.refs).reduce((res, input) =>
    //   ({ ...res, [input]: this.refs[input].value }), {})
    // return flux.getActions('session').login(data)
  }

  render() {
    // const { i18n } = this.context

    return (
      <div>
        <div onClick={ ::this.handleSubmit } >twitter</div>
      </div>
    )
  }

}

export default LoginPage
