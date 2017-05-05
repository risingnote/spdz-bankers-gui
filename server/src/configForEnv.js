/**
 * Read config file with environment specific name (-dev in dev)
 * @param {String} fileNameBase 
 */
const configForEnv = (fileNameBase) => {
  const environ = process.env.NODE_ENV || 'development'
  return require('../config/' + fileNameBase + ((environ === 'development') ? '-dev' : ''))  
}

module.exports = configForEnv