/**
 * Provide a function for fetch request to determine if request was successful
 */
export default (status, response=null, headers=(new Headers()) ) => {
  if (response !== null) {
    headers.set('Content-type','application/json')
  }

  return new window.Response(response, {
    status: status,
    headers: headers
  })
}