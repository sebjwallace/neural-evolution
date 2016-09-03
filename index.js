
function randomInt(min,max){
  return Math.floor((Math.random() * max) + min)
}

var ga = new GeneticAlgorithm({
  size: 100,
  genesis: function(){
    return new DeepNet(2,1,2,0,'rectifier')
  },
  clone: function(net){
    var clone = new DeepNet(2,1,2,0,'rectifier')
    var i = clone.weights.length; while(i--)
      clone.weights[i] = net.weights[i].clone()
    return clone
  },
  mutate: function(net){
    for(var i = 0; i < net.weights.length; i++)
      net.weights[i].iterate(function(v,y,x){
        var w = randomInt(1,10)/100
        net.weights[i].increment(y,x,probable(50) ? -w : w)
      })
    return net
  },
  crossover: function(net){
    return net
  },
  test: function(net){
    return net.feedforward([2,8])[0]
  },
  log: function(gen,score){
    console.log(gen + ' ' + score)
  }
})

ga.train(100)

// var net = new DeepNet(10,1,8,1,'identity')
//
// for(var i = 0; i < net.weights.length; i++)
// net.weights[i].iterate(function(v,y,x){
//   var w = randomInt(1,10)/10
//   net.weights[i].set(y,x,probable(50) ? -w : w)
// })
//
//
// var ctx = document.getElementById('canvas').getContext('2d')
// canvas.height = canvas.width = 500
//
// var grid = new Matrix(100)
//
// grid.traverse_random(function(i,y,x){
//   grid.set(y,x,randomInt(1,10)/10)
// },100)
//
// function step(){
//
//   grid = grid.clone(function(i,y,x){
//     var sum = grid.getNeighbours(y,x).reduce(function(a,b){
//       return a + b
//     })
//     return net.feedforward([
//       i, sum,
//       grid.getNeighbour(y,x,'north'),
//       grid.getNeighbour(y,x,'northeast'),
//       grid.getNeighbour(y,x,'east'),
//       grid.getNeighbour(y,x,'southeast'),
//       grid.getNeighbour(y,x,'south'),
//       grid.getNeighbour(y,x,'southwest'),
//       grid.getNeighbour(y,x,'west'),
//       grid.getNeighbour(y,x,'northwest')
//     ])[0]
//   })
//
//   ctx.clearRect(0,0,500,500)
//   grid.iterate(function(i,y,x){
//     ctx.fillStyle = 'rgba(0,0,0,'+i+')'
//     ctx.fillRect(x,y,1,1)
//   })
//
//   count++
//
//   if(count >= 80)
//   clearInterval(interval)
//
// }
//
// var count = 0
// var interval = setInterval(step,500)
