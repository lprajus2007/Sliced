var $ = require("jquery");

/**
 *  Parse Amazon Email
 */
function parseAmazonEmail(passedEmailHtml) {
  "use strict";

  var emailHtml = null,
    receipt = {
      orderNumber   : null,
      orderDate   : null,
      products    : [],
      shippingInfo  : null
    },
    receiptLanguage = 'en';

   /**
  * Public method - parses entire email or just html segment
  *
  * @return reciept
  *
  */
  function parse() {
    // Retrieve only HTML from email
    setEmailHtml();

    // Determine receipt language
    setLanguage();

    // Parse basic order information
    parseOrderInfo();

    // Parse shipping info
    parseShippingInfo();

    // Parse product info
    parseProductInfo();

    // Return receipt object
    return receipt;
  };

   /**
  * Set product information
  */
  function parseProductInfo() {
    var productsContainer,
      currentTr = $('h3:contains("Order Details")').closest('tr').next();

      while ($(currentTr).next().text().indexOf('Item Subtotal') == -1 && $(currentTr).next().text().indexOf('Shipping & Handling') == -1) {
        var thisObject = {};

        currentTr = $(currentTr).next(),

        thisObject.name = $(currentTr).find("a:not(:has('img'))").html();
        thisObject.id = $(currentTr).find("a").attr("title");
        thisObject.image = $(currentTr).find("img").attr("src");
        thisObject.price = $(currentTr).find('strong:contains("$")').text().replace('$','');

        receipt.products.push(thisObject);
      }
  }

   /**
  * Set basic order information
  */
  function parseOrderInfo() {
    // Order number
    if ($(emailHtml).find('h2:contains("Order Confirmation")').next("a").length) {
      receipt.orderNumber = $(emailHtml).find('h2:contains("Order Confirmation")').next("a").text();
    }

    // Order Date
    if ($(emailHtml).find('td:contains("Order #") span:contains("Placed on")').length) {
      var dateString = $(emailHtml).find('td:contains("Order #") span:contains("Placed on")').text();

      dateString = dateString.split("Placed on ")[1];
      receipt.orderDate = new Date(dateString);
    }
  }

   /**
  * Set shipping information
  */
  function parseShippingInfo() {
    var fullShippingString,
      shippingSegments,
      i = 0;

    if ($(emailHtml).find('p:contains("Your order will be sent to:")').length) {
      fullShippingString = $(emailHtml).find('p:contains("Your order will be sent to:")').text();
      fullShippingString = fullShippingString.split("Your order will be sent to:")[1];

      receipt.shippingInfo = fullShippingString.split("  ");

      for ( ; i < receipt.shippingInfo.length; i++) {
        if (receipt.shippingInfo[i] === '') {
          delete receipt.shippingInfo[i];
        }
      }
    }
  }

   /**
  * Get HTML content from passed email content string, put into jQuery object
  */
  function setEmailHtml() {
    emailHtml = $(passedEmailHtml);
  }

   /**
  * Set language of email
  */
  function setLanguage() {
    receiptLanguage = 'en';
  }

  return parse();
};

exports.parseAmazonEmail = parseAmazonEmail;

