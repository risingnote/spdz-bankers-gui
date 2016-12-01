/**
 * Provide a function for fetch request to determine if request was successful
 */
export default function MockResponse (status, statusText, response) {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};