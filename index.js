

var net = new Network(2,1)

var ga = new MatrixGA(3,100)

ga.train(100,function(matrix){

  net.weights = matrix
  var result = net.process([2,5])

  return result

})

net.weights = ga.master
console.log(net.weights.toString())
console.log(net.process([2,4]))
