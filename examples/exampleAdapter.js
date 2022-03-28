
const crypto = require('crypto')
const Mishmesh = require('../index.js')
let mishmesh = new Mishmesh()

let topic = 'my cool identifier'
let secret = crypto.createHash('sha256').update(topic).digest('hex')
let mesh = {}
let last

// Bugout
const bugout = function(){
  const Bugout = require('bugout')
  let b = new Bugout(topic)

  const transportBindings =  {
    on: b.on.bind(b),
    once: b.once.bind(b),
    send: b.send.bind(b),
    destroy: b.destroy.bind(b)
  }
  process.stdout.on('data', data => {
    b.send(data.toString().trim())
    last = data.toString().trim()
  })
  return {b, transportBindings}
}
mesh['bugout'] = mishmesh.adapter({type: 'bugout', transportBindings: bugout().transportBindings})

mesh['bugout'].on('seen', address => {
  console.log(address)
})
mesh['bugout'].on('message', (address, message) => {
  //console.log(message)
  let user = mesh['gun'].user()
  user.auth(topic, secret)
  user.get(topic).put(message)
  last = message
})

// Gun
const gun = function(){
  const GUN = require('gun')
  const SEA = require('gun/sea')

  //let pair = await SEA.pair()
  let Gun = new GUN()

  const transportBindings =  {
    on: Gun.on.bind(Gun),
    once: Gun.once.bind(Gun),
    put: Gun.put.bind(Gun),
    get: Gun.get.bind(Gun),
    user: Gun.user.bind(Gun)
    //destroy: Gun.destroy.bind(Gun)
  }
  return {Gun, transportBindings}
}
mesh['gun'] = mishmesh.adapter({type: 'gun', transportBindings: gun().transportBindings})

let user = mesh['gun'].user()
user.create(topic, secret, ack => {
  console.log(ack)
  user.auth(topic, secret)
})
mesh['gun'].on('auth', ack => {
  user.get(topic).on(data => {
    if(last === data) return
    //console.log(data)
    mesh['bugout'].send(data)
    last = data
  })
  process.stdout.on('data', data => {
    last = data.toString().trim()
    user.get(topic).put(data.toString().trim())
  })
})