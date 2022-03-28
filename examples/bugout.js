// API testing
const Mishmash = require('../index.js')
const Bugout = require('bugout')
const wrtc = require('wrtc')

let b = new Bugout('my cool identifier')
b.on('seen', address => {
  console.log('Bugout connected!', address)
  let last
  b.on('message', (address, message) => {
    if(last === message) return
    console.log(message)
  })
  process.stdout.on('data', data => {
    b.send(data.toString().trim())
    last = data.toString().trim()
  })

})