const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  console.log('fetch end    time', new Date())
  res.send('ok')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//-------------------

const coap    = require('../') // or coap
const server  = coap.createServer()
const _ = require('lodash')
const fetch = require('node-fetch');

server.on('request', async function(req, res) {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  console.log('req.url', req.url)
  console.log('req.payload', req.payload.toString('hex'))
  console.log('count', req._packet.token.slice(0, 2).readUInt16BE())
  console.log('ttl', req._packet.token.slice(2, 3).readUInt8()),
  console.log('iotdevi send time', new Date(1617120000000 + parseInt('0x' + req.payload.toString('hex').substr(0, 8))))
  console.log('gateway send time', new Date(1617120000000 + parseInt('0x' + req.payload.toString('hex').substr(8, 8))))
  console.log('fetch start  time', new Date())

  // fetch('http://fhir.chris.school:4004/hapi-fhir-jpaserver/fhir/Observation/9/_history/1?_pretty=true&_format=json')
  //   .then(res => res.text())
  //   .then(body => {
  //     console.log('fetch end    time', new Date())
  //     req.rsinfo.port = 5683;
  //     res.end('ok')
  //   });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 5000);
  })

  req.rsinfo.port = 5683;
  res.end('ok')
})

server.listen(function() {
  console.log('server started')
})
