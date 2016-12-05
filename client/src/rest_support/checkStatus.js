/**
 * Provide a function for fetch request to determine if request was successful
 */
export default function checkStatus(response) {
    if (response.ok) {
      return response
    } else {
      var error = new Error(`Status: ${response.status} Message: ${response.statusText}`)
      error.response = response
      throw error
    }
  }