const EventEmitter = require('events').EventEmitter
let networks = {}
const Mishmesh = function(params){
  const mishmesh = this
  const events = new EventEmitter()
  mishmesh.emit = events.emit.bind(events)
  mishmesh.on = events.on.bind(events)
  mishmesh.once = events.once.bind(events)
  mishmesh.off = events.off.bind(events)

  mishmesh.adapters = []
  
  mishmesh.adapter = params => {
    mishmesh.adapters[params.type] = params
    networks[params.type] = mishmesh.adapters[params.type].transportBindings
    return mishmesh.adapters[params.type].transportBindings
  }
}
module.exports = Mishmesh