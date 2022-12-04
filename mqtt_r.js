console.log(`\nSarcopenia project - Raspberry MQTT - Node.js v${process.versions.node}!`)

const mqtt = require('mqtt')
const host = 'mqtt.eclipseprojects.io'
const port = '1883'
const clientId = 'mqtt_unisalento_sarcopenia_r'
const connectUrl = `mqtt://${host}:${port}`
const topic = 'unisalento/sarcopenia/data/bia'

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
})

client.on("connect",function(){
    console.log("connected");
});
client.on("error",function(error){
    console.log("Can't connect"+error);
});


client.on('connect', () => {
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
    })
});

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
});
