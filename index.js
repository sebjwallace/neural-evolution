
var ga = new GeneticAlgorithm(100,function(){
  var net = new Network(3,1)
  net.mutate(100)
  return net
})

ga.train(100,function(net){

  var score = 0

  var start = new Date()
  score += net.process([1,0,0])[0].toFixed(3) == 1 ? 1 : 0
  score += net.process([1,0,1])[0].toFixed(3) == 1 ? 1 : 0
  score += net.process([1,1,0])[0].toFixed(3) == 1 ? 1 : 0
  score += net.process([1,1,1])[0].toFixed(3) == 0 ? 1 : 0
  var end = new Date()

  return {
    score: score,
    time: end - start
  }

})

var net = ga.master
console.log(net.weights.toString())

console.log('1 1 : 0')
console.log(net.process([1,1,1])[0])

console.log('1 0 : 1')
console.log(net.process([1,1,0])[0])

console.log('0 1 : 1')
console.log(net.process([1,0,1])[0])

console.log('0 0 : 1')
console.log(net.process([1,0,0])[0])
