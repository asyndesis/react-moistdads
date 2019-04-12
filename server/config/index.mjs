// fetch env config
import config from './config'
// check env.
var env = process.env.NODE_ENV || 'development'
var envConfig = config[env]
// process.env now contains all config items
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key])

export default process.env