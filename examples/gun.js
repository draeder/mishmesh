const crypto = require('crypto')
const Gun = require('gun')
const SEA = require('gun/sea')


let topic = 'my cool identifier' // <== bugout topic
let secret = crypto.createHash('sha256').update(topic).digest('hex')
console.log(secret)

;(async ()=>{  
  let pair = await SEA.pair()

  let gun = new Gun()
  
  let user = gun.user()
  user.create(topic, secret, ack => {
    console.log(ack)
    user.auth(topic, secret)
  })
  gun.on('auth', ack => {
    console.log('Authenticated!')
    let last
    user.get(topic).on(data => {
      if(last === data) return
      console.log(data)
    })
    process.stdout.on('data', data => {
      last = data.toString().trim()
      user.get(topic).put(data.toString().trim())
    })
  })
  /*
  user.auth(pair)
  gun.on('auth', ack => {
    console.log('Authenticated!')
    user.get(topic).on(data => {
      console.log(data)
    })
    process.stdout.on('data', data => {
      console.log('hmm', data)
      user.get(topic).put(data.toString().trim())
    })
  })
  */
})()