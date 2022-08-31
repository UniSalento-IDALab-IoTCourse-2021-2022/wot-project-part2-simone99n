const http = require('http')


console.log(`\nHello Node.js v${process.versions.node}!`)

const data = JSON.stringify({
    'sensor' : 'accelerometer',
    'timestamp' : Date.now(),
    'acc_x' : 12,
    'acc_y' : 10,
    'acc_z' : 16
})

console.log('\nhalo' + data)

//insert ip:port of back-end cloud server
const options = {
    hostname: '192.168.1.250', port: 3000,
    path: '/temperature', method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length }
}

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    //define the callback function that will print the result of the request in case of success
    res.on('data', d => {
        process.stdout.write(d);
    })

    //define the callback function that will print the result of the request in case of error
    req.on('error', error => {
    console.error(error);
    })
})

//send the request
req.write(data);
req.end();
