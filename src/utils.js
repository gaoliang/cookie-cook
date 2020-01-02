/**
 * cookies to text
 */
export function cookiesToText (copyStyle, cookies) {
  switch (copyStyle) {
    case 'json':
      cookies = cookies.reduce(function (map, obj) {
        map[obj.name] = obj.value
        return map
      }, {})
      return JSON.stringify(cookies)
    case 'http':
      return cookies.map(cookie => cookie.name + '=' + cookie.value).join('; ')
    case 'curl':
      let cookieValue = cookies.map(cookie => cookie.name + '=' + cookie.value).join('; ')
      return `curl -H "cookie: ${cookieValue}"`
    default:
      return ''
  }
}
