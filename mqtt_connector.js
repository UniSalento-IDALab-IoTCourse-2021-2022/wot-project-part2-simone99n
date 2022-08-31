console.log(`\nSarcopenia project - Raspberry MQTT - Node.js v${process.versions.node}!`)

const mqtt = require('mqtt')
const clientId = 'mqtt_unisalento_sarcopenia_s'
const connectUrl = `mqtt://mqtt.eclipseprojects.io:1883`
const topic = 'unisalento/sarcopenia'

const option_connect = {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
}
const option_publish = {
    qos: 0,
    retain: false
}

const client = mqtt.connect(connectUrl, option_connect)

client.on("connect",function(){
    console.log("Connected");
});
client.on("error",function(error){
    console.log("Can't connect" + error);
});

setInterval(function () {
        client.publish(topic, `value: ${Math.random().toString(16).slice(3)}`, option_publish, (error) => {
            if (error) {
                console.error(error)
            }
        })
    },2000
);




