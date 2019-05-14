'use strict'

//The middleware has a simple job, read the value of the cookie and then call 
//antl.switchLocale to update the language for the current HTTP request.

//Also, we are sharing the locales with all the views by calling view.share method.
//After this, you can remove the locales sharing from the routes file.

class Locale {

  async handle ({ request, antl, view }, next) {
    const lang = request.cookie('lang')
    if (lang) {
      antl.switchLocale(lang)
    }
    // will share locales with all views
    view.share({ locales: antl.availableLocales() })
    await next()
  }

}
module.exports = Locale