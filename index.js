const EventEmitter = require('events').EventEmitter
let transports = {}
const Mishmash = function(params){
  const mishmash = this
  const events = new EventEmitter()

  if(!params) throw new Error('Cannot start with empy parameters')
  mishmash.params = params ? params : {}

  for(let transportBinding in params.transportBindings){
    console.log(transportBinding)
    mishmash[transportBinding] = params.transportBindings[transportBinding].bind(params.transport)
  }

  transports[params.type] = this
  return transports
}
module.exports = Mishmash