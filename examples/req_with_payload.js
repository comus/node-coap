const coap        = require('../') // or coap

coap.createServer(function(req, res) {
  console.log(req.url)
  console.log(req.method)
  console.log(req.payload)
  res.end('Hello ' + req.url.split('/')[1] + '\nMessage payload:\n'+req.payload+'\n')
}).listen(function() {

  var req = coap.request({
    host: 'localhost',
    pathname: 'hb',
    method: 'POST'
  })

  // edit this to adjust max packet
  // req.setOption('Block2', Buffer.of(0x2))
  
  var payload = {
    title: 'this is a test payload',
    body: 'dd'
  }
  
  req.write('88');
  
  req.on('response', function(res) {
    res.pipe(process.stdout)
    res.on('end', function() {
      process.exit(0)
    })
  })

  req.end()
})
