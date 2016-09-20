import React, { Component, PropTypes } from 'react'
import connect from 'connect-alt'
import { Link } from 'react-router'

import Spinner from 'components/shared/spinner'
import LangPicker from 'components/shared/lang-picker'

@connect(({ requests: { inProgress } }) => ({ inProgress }))

class Header extends Component {

  static propTypes = {
    inProgress: PropTypes.bool,
    session: PropTypes.object
  }

  static contextTypes = {
    locales: PropTypes.array.isRequired,
    flux: PropTypes.object.isRequired,
    i18n: PropTypes.func.isRequired
  }

  handleLocaleChange = (locale: string) => {
    const { flux } = this.context
    flux.getActions('locale').switchLocale({ locale })
  }

  handleLogout = () => {
    const { flux } = this.context
    flux.getActions('session').logout()
  }

  render() {
    const { inProgress } = this.props
    const { locales: [ activeLocale ], i18n } = this.context

    return (
      <header className='app--header'>
        { /* Spinner in the top right corner */ }
        <Spinner active={ inProgress } />

        { /* LangPicker on the right side */ }
        <LangPicker
          activeLocale={ activeLocale }
          onChange={ this.handleLocaleChange } />

        { /* React Logo in header */ }
        <Link to='/' className='app--logo text-center'>
          <h1>Sliced</h1>
        </Link>

        { /* Links in the navbar */ }
        <ul className='app--navbar text-center reset-list un-select'>
          <li>
            <Link to={ i18n('routes.login') }>
              { i18n('header.login') }
            </Link>
          </li>
        </ul>
      </header>
    )
  }
}

export default Header
