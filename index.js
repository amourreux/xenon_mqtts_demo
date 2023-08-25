const mqtt = require('mqtt')
/* 
  choose which protocol to use for connection here 
*/
const { connectOptions } = require('./use_mqtts.js')

const clientId = 'xenon_smart' + Math.random().toString(16).substring(2, 8)
const options = {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'xenonsmart',
  password: '12345678Aa.',
  reconnectPeriod: 1000,
}

const { protocol, host, port } = connectOptions

let connectUrl = `${protocol}://${host}:${port}`
const client = mqtt.connect(connectUrl, options)

const topic = '/xenon/smart'
const payload = 'xenon mqtt test'
const qos = 0

client.on('connect', () => {
  console.log(`${host}: Connected`)

  // subscribe topic
  // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
  client.subscribe(topic, { qos }, (error) => {
    if (error) {
      console.log('subscribe error:', error)
      return
    }
    console.log(`${host}: Subscribe to topic '${topic}'`)
    // publish message
    // https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
    client.publish(topic, payload, { qos }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
})

// https://github.com/mqttjs/MQTT.js#event-reconnect
client.on('reconnect', (error) => {
  console.log(`Reconnecting(${protocol}):`, error)
})

// https://github.com/mqttjs/MQTT.js#event-error
client.on('error', (error) => {
  console.log(`Cannot connect(${protocol}):`, error)
})

// https://github.com/mqttjs/MQTT.js#event-message
client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})