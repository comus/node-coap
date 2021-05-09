var udp = require('dgram');
var buffer = require('buffer');
const fetch = require('node-fetch');
let log = require('simple-node-logger').createSimpleLogger(`./logs/${Date.now()}.log`);

let type = '0'

// creating a client socket
var client = udp.createSocket('udp4');

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error',function(error){
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message', async function(msg,info) {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  console.log('Data received from client : ' + msg.toString('hex'), ', count:', msg.slice(4, 6).readUInt16BE());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
  
  console.log('msg', msg.toString('hex'))
  console.log('count', msg.slice(4, 6).readUInt16BE())
  console.log('ttl', msg.slice(6, 7).readUInt8()),
  console.log('iotdevi send time', new Date(1617120000000 + parseInt('0x' + msg.toString('hex').substr(16, 8))))
  console.log('gateway send time', new Date(1617120000000 + parseInt('0x' + msg.toString('hex').substr(24, 8))))

  const fetchStartTime = new Date()
  console.log('fetch start  time', fetchStartTime)

  const body = await fetch('http://fhir.chris.school:4004/hapi-fhir-jpaserver/fhir/Observation/9/_history/1?_pretty=true&_format=json')
    .then(res => res.text())

  const fetchEndTime = new Date()
  console.log('fetch end    time', fetchEndTime)

  log.info(JSON.stringify({
    msg: msg.toString('hex'),
    count: msg.slice(4, 6).readUInt16BE(),
    ttl: msg.slice(6, 7).readUInt8(),
    type,
    iotDeviceSendTime: new Date(1617120000000 + parseInt('0x' + msg.toString('hex').substr(16, 8))),
    gatewaySendTime: new Date(1617120000000 + parseInt('0x' + msg.toString('hex').substr(24, 8))),
    fetchStartTime,
    fetchEndTime
  }))

  const buffer = Buffer.from("434559fc026103ff6f6b", "hex")
  client.send(buffer,5683,info.address,function(error){
    if(error){
      client.close();
    }else{
      console.log('Data sent !!!');
    }
  });
});

//emits when socket is ready and listening for datagram msgs
server.on('listening',function(){
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port:', port);
  console.log('Server ip:', ipaddr);
  console.log('Server is IP4/IP6:', family);
});

//emits after the socket is closed using socket.close();
server.on('close',function(){
  console.log('Socket is closed !');
});

server.bind(5683);

var readline = require('readline')
var rl = readline.createInterface(process.stdin, process.stdout);

rl.prompt();

rl.on('line', function(line) {
  const cmd = line.trim()
    if (cmd === 'hello') {
      console.log('world!');
    } else if (cmd) {
      type = cmd
    }
    rl.prompt();
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});