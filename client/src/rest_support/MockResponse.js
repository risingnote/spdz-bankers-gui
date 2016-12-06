/**
 * Provide a function for fetch request to determine if request was successful
 */
export default (status, response=null) => {
  const headers = new Headers()
  if (response !== null) {
    headers.append('Content-type','application/json')
  }
  return new window.Response(response, {
    status: status,
    headers: headers
  })
}