import React from 'react'

type Props = {
  body: string,
  assets: Object,
  locale: string,
  title: string,
  description: string
};

function ServerHTML(props: Props) {
  const { body, assets, locale, title, description } = props

  return (
    <html lang={ locale }>
      <head>
        <meta charSet='utf-8' />
        <meta name="google-signin-client_id" content="902317062753-fo92bj01t0n6topc4mbm8i917pm7va5m.apps.googleusercontent.com" />
        <script src="https://apis.google.com/js/client:platform.js"></script>
        {/* Styles */}
        <link rel='icon' type='image/ico' href='/favicon.ico' />
        { assets.style.map((href, idx) =>
          <link key={ idx } rel='stylesheet' href={ href } />) }

        {/* SEO */}
        <title>{ title }</title>
        <meta name='description' content={ description } />
      </head>
      <body>
        <div id='content' dangerouslySetInnerHTML={ { __html: body } } />
        <script src={ assets.script[0] } />
        <script async defer id='github-bjs' src='https://buttons.github.io/buttons.js' />
      </body>
    </html>
  )
}

export default ServerHTML
