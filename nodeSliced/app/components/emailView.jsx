import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import find from 'lodash/find'

@connect(({ social: { emails } }) => ({ emails }))
class EmailView extends Component {

  static propTypes = {
    emails: PropTypes.array
  }

  static contextTypes = {
    locales: PropTypes.array.isRequired,
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  state = {
    emails: 'test'
  }

  renderEmails(messages) {
    return (
      <div style={ { width: '700px', margin: '0px auto' } } >
        { messages.map((message, i) => {
          const from = find(message.payload.headers, { name: 'From' })
          return (
            <div key={ i } style={ { margin: '10px' } } >
              <div style={ { background: '#80B8C1' } } >{ from.value }</div>
              <div>{ message.snippet }</div>
            </div>
          )
        }) }
      </div>
    )
  }

  render() {
    const { emails } = this.props
    return (
      <div style={ { marginTop: '50px', borderTop: '1px dashed gray', padding: '20px' } } >
        { emails ? this.renderEmails(emails) : <div /> }
      </div>
    )
  }
}

export default EmailView
