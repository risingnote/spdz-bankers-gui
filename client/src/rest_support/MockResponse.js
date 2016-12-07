/**
 * Provide a mock to use when testing functions which use Fetch, returns a mock response.
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