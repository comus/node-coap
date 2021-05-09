var udp = require('dgram');
var buffer = require('buffer');

// creating a client socket
var client = udp.createSocket('udp4');

//buffer msg
var data = Buffer.from('aaaaaaaaaa');

//sending msg
client.send(data,5683,'172.20.10.12',function(error){
  if(error){
    client.close();
  }else{
    console.log('Data sent !!!');
  }
});
