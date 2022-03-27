// API testing
const Mishmash = require('../index')
const Bugout = require('bugout')
const wrtc = require('wrtc')

let b = new Bugout('my cool identifier')
b.on('seen', address => {
  console.log('Bugout connected!', address)
  const mishmash = new Mishmash({type:'bugout', address: address, transport: b, transportBindings: {
    on: b.on.bind(b),
    once: b.once.bind(b),
    send: b.send.bind(b),
    destroy: b.destroy.bind(b)
  }})
  b.send('hiiiiiiiiii!')

  for(let transport in mishmash){
    mishmash[transport].on('message', (address, message) => {
      console.log(message)
    })
  }

})