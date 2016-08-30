


var ga = new GeneticAlgorithm(100,function(){
  return new Network(2,1)
})

ga.train(1000,function(net){

  var result = net.process([2,5])[0]

  return result

})

var net = ga.master
console.log(net.weights.toString())
console.log(net.process([2,4]))
