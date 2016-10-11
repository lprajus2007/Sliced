const $ = require('jquery')

/**
 *  Parse Amazon Email
 */
function parseAmazonEmail(passedEmailHtml) {
  let emailHtml = null
  const receipt = {
    orderNumber: null,
    orderDate: null,
    products: [],
    shippingInfo: null
  }
  // var receiptLanguage = 'en'

   /**
  * Set product information
  */
  function parseProductInfo() {
    let currentTr = $('h3:contains("Order Details")').closest('tr').next()

    while ($(currentTr).next().text().indexOf('Item Subtotal') === -1 && $(currentTr).next().text().indexOf('Shipping & Handling') === -1) {
      const thisObject = {}
      currentTr = $(currentTr).next()
      thisObject.name = $(currentTr).find('a:not(:has("img"))').html()
      thisObject.id = $(currentTr).find('a').attr('title')
      thisObject.image = $(currentTr).find('img').attr('src')
      thisObject.price = $(currentTr).find('strong:contains("$")').text().replace('$', '')
      receipt.products.push(thisObject)
    }
  }

   /**
  * Set basic order information
  */
  function parseOrderInfo() {
    // Order number
    if ($(emailHtml).find('h2:contains("Order Confirmation")').next('a').length) {
      receipt.orderNumber = $(emailHtml).find('h2:contains("Order Confirmation")').next('a').text()
    }

    // Order Date
    if ($(emailHtml).find('td:contains("Order #") span:contains("Placed on")').length) {
      let dateString = $(emailHtml).find('td:contains("Order #"") span:contains("Placed on")').text()
      dateString = dateString.split('Placed on ')[1]
      receipt.orderDate = new Date(dateString)
    }
  }

   /**
  * Set shipping information
  */
  function parseShippingInfo() {
    let fullShippingString
    // let shippingSegments
    let i = 0

    if ($(emailHtml).find('p:contains("Your order will be sent to:")').length) {
      fullShippingString = $(emailHtml).find('p:contains("Your order will be sent to:")').text()
      fullShippingString = fullShippingString.split('Your order will be sent to:')[1]

      receipt.shippingInfo = fullShippingString.split('  ')

      for (; i < receipt.shippingInfo.length; i++) {
        if (receipt.shippingInfo[i] === '') {
          delete receipt.shippingInfo[i]
        }
      }
    }
  }

   /**
  * Get HTML content from passed email content string, put into jQuery object
  */
  function setEmailHtml() {
    emailHtml = $(passedEmailHtml)
  }

   /**
  * Set language of email
  */
  // function setLanguage() {
  //   receiptLanguage = 'en'
  // }


   /**
  * Public method - parses entire email or just html segment
  *
  * @return reciept
  *
  */
  function parse() {
    // Retrieve only HTML from email
    setEmailHtml()

    // Determine receipt language
    // setLanguage()

    // Parse basic order information
    parseOrderInfo()

    // Parse shipping info
    parseShippingInfo()

    // Parse product info
    parseProductInfo()

    // Return receipt object
    return receipt
  }

  return parse()
}

exports.parseAmazonEmail = parseAmazonEmail

