const mqtt = require('mqtt')
/* 
  choose which protocol to use for connection here 
*/
const { connectOptions } = require('./use_mqtts.js')

const MAX_CLIENTS = 100

const clientId = 'xenon_smart_client' + Math.random().toString(16).substring(2, 8)
const options = {
  clientId,
  clean: true,
  connectTimeout: 2000,
  username: 'xenonsmart',
  password: '12345678Aa.',
  reconnectPeriod: 1000,
}

const { protocol, host, port } = connectOptions

let connectUrl = `${protocol}://${host}:${port}`

let clients = []

let counterSuccess = 0
let counterError = 0

const checkAllClientSubStatus = () => {
   if(counterError + counterSuccess === MAX_CLIENTS){
      console.log(`All clients tried to connect...  successes: ${counterSuccess} errors: ${counterError} connect... Ready to send message all subscribed...`)
      return true
   }

   return false
}

const topic = '/xenon/smart'
const qos = 0

for(let i=0; i<MAX_CLIENTS; i++){
  const clientId = 'xenon_smart'+ i + Math.random().toString(16).substring(2, 8)
  let client = mqtt.connect(connectUrl, {...options, clientId})
  
  client.subscribe(topic, { qos }, (error) => {
    if (error) {
      console.log('subscribe error:', error)
      counterError++
      return
    }
    counterSuccess++
    console.log(`client: ${clientId} subscribed to topic '${topic}'`)
    if(checkAllClientSubStatus()){
      const lastOnesMessage = 'last subscribed one' + clientId 
      client.publish(topic, lastOnesMessage, { qos }, (error) => {
        if (error) {
          console.error(error)
        }
      })
    }
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

  clients.push(client)
}

//console.log(client)


