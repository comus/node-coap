const _ = require('lodash')

const data = require('./chart_data.json')

function σ (array) {
  var avg = _.sum(array) / array.length;
  return Math.sqrt(_.sum(_.map(array, (i) => Math.pow((i - avg), 2))) / array.length);
};

const types = {
  1: [],
  2: [],
  3: [],
  4: []
}

let currentCount
data.forEach(record => {
  record.count = parseInt(record.count)
  record.type = parseInt(record.type)
  record.iotDeviceSendTime = new Date(record.iotDeviceSendTime).getTime()
  record.gatewaySendTime = new Date(record.gatewaySendTime).getTime()
  record.fetchStartTime = new Date(record.fetchStartTime).getTime()
  record.fetchEndTime = new Date(record.fetchEndTime).getTime()

  record.iotDeviceToGatewayTime = record.gatewaySendTime - record.iotDeviceSendTime
  record.gatewayToIoTEndpointTime = record.fetchStartTime - record.gatewaySendTime
  record.ioTEndpointToHTTPServerTime = record.fetchEndTime - record.fetchStartTime
  record.totalRequestTime = record.fetchEndTime - record.iotDeviceSendTime
  
  if (record.count !== currentCount) {
    currentCount = record.count
  } else {
    // 等於之前個個
    console.log(record.count)
  }
})

data.forEach(record => {
  const typeArray = types[record.type]
  typeArray.push(record)
})

for(let i = 1; i <= 4; i++) {
  const typeArray = types[i]

  console.log(i)

  const iotDeviceToGatewayTimeAvg = _.sumBy(typeArray, 'iotDeviceToGatewayTime') / typeArray.length
  const gatewayToIoTEndpointTimeAvg = _.sumBy(typeArray, 'gatewayToIoTEndpointTime') / typeArray.length
  const ioTEndpointToHTTPServerTimeAvg = _.sumBy(typeArray, 'ioTEndpointToHTTPServerTime') / typeArray.length
  const totalRequestTimeAvg = _.sumBy(typeArray, 'totalRequestTime') / typeArray.length
  const iotDeviceToIoTEndpointTimeAvg = iotDeviceToGatewayTimeAvg + gatewayToIoTEndpointTimeAvg

  const iotDeviceToGatewayTimeMin = _.minBy(typeArray, 'iotDeviceToGatewayTime').iotDeviceToGatewayTime
  const gatewayToIoTEndpointTimeMin = _.minBy(typeArray, 'gatewayToIoTEndpointTime').gatewayToIoTEndpointTime
  const ioTEndpointToHTTPServerTimeMin = _.minBy(typeArray, 'ioTEndpointToHTTPServerTime').ioTEndpointToHTTPServerTime
  const totalRequestTimeMin = _.minBy(typeArray, 'totalRequestTime').totalRequestTime

  const iotDeviceToGatewayTimeMax = _.maxBy(typeArray, 'iotDeviceToGatewayTime').iotDeviceToGatewayTime
  const gatewayToIoTEndpointTimeMax = _.maxBy(typeArray, 'gatewayToIoTEndpointTime').gatewayToIoTEndpointTime
  const ioTEndpointToHTTPServerTimeMax = _.maxBy(typeArray, 'ioTEndpointToHTTPServerTime').ioTEndpointToHTTPServerTime
  const totalRequestTimeMax = _.maxBy(typeArray, 'totalRequestTime').totalRequestTime

  const iotDeviceToGatewayTimeSD = σ(_.map(typeArray, 'iotDeviceToGatewayTime'))
  const gatewayToIoTEndpointTimeSD = σ(_.map(typeArray, 'gatewayToIoTEndpointTime'))
  const ioTEndpointToHTTPServerTimeSD = σ(_.map(typeArray, 'ioTEndpointToHTTPServerTime'))
  const totalRequestTimeSD = σ(_.map(typeArray, 'totalRequestTime'))

  const length = typeArray.length
  const ttl3 = _.filter(typeArray, { ttl: 3 }).length
  const ttl2 = _.filter(typeArray, { ttl: 2 }).length
  const ttl1 = _.filter(typeArray, { ttl: 1 }).length

  const ttl3Percent = ttl3 / length * 100
  const ttl2Percent = ttl2 / length * 100
  const ttl1Percent = ttl1 / length * 100

  let lastStartTime
  let sum = 0
  let l = 0
  let x = 0
  let y = 0
  typeArray.forEach((record, index) => {
    if (index > 0) {
      if (record.count < typeArray[index - 1].count) {
        console.log('!!!!!!!!')
      } else {
        const diff = record.iotDeviceSendTime - lastStartTime
        if (diff < 0) {
          console.log(diff, '*********')
        } else if (diff > 2000 && diff < 12507) {
          sum += diff
          l++;
        } else {
          x += diff
          y++;
        }

        lastStartTime = record.iotDeviceSendTime
      }
    } else {
      lastStartTime = record.iotDeviceSendTime
    }
  })
  console.log('!!!!avg', x / y)
  console.log('!!!!sum', (sum / ( x / y)) / (length + (sum / ( x / y))))

  console.log({
    iotDeviceToGatewayTimeAvg,
    gatewayToIoTEndpointTimeAvg,
    ioTEndpointToHTTPServerTimeAvg,
    totalRequestTimeAvg,
    iotDeviceToIoTEndpointTimeAvg,

    iotDeviceToGatewayTimeMin,
    gatewayToIoTEndpointTimeMin,
    ioTEndpointToHTTPServerTimeMin,
    totalRequestTimeMin,

    iotDeviceToGatewayTimeMax,
    gatewayToIoTEndpointTimeMax,
    ioTEndpointToHTTPServerTimeMax,
    totalRequestTimeMax,

    iotDeviceToGatewayTimeSD,
    gatewayToIoTEndpointTimeSD,
    ioTEndpointToHTTPServerTimeSD,
    totalRequestTimeSD,

    length,
    ttl3,
    ttl2,
    ttl1,
    ttl3Percent,
    ttl2Percent,
    ttl1Percent
  })
}