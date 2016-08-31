
function Network(i,o){

  this.inputs = i
  this.outputs = o
  this.ports = i + o
  this.weights = new Matrix(this.ports)
  this.neurons = []

  for(var i = 0; i < this.ports; i++)
    this.neurons[i] = {
      activation: 0,
      threshold: 1
    }

}

Network.prototype.process = function(inputs){

  var matrix = new Matrix(this.weights.root())
  for(var i = 0; i < this.inputs; i++)
    matrix.fillRow(i,inputs[i])

  var step = 0
  while(!matrix.get(this.ports-1,0) && step++ < 100)
    matrix = matrix.multiply(this.weights).sumCols().flip()
      .transform(function(i,y,x){
        return this.activations[this.neurons[y].activation](i,this.neurons[y].threshold)
      }.bind(this))

  var outputs = []
  for(var i = this.inputs; i < this.ports; i++)
    outputs.push(matrix.get(i,0))

  return outputs

}

Network.prototype.clone = function(){
  var clone = new Network(this.inputs,this.outputs)
  clone.weights = this.weights.clone()
  for(var i = 0; i < this.neurons.length; i++)
    clone.neurons[i] = {threshold: this.neurons[i].threshold,
      activation: this.neurons[i].activation}
  return clone
}

Network.prototype.mutate = function(rate){
  if(probable(rate/100)){
    this.weights.addRowCol()
    this.neurons.push({threshold: 1, activation: 0})
  }
  if(probable(rate/1000) && this.weights.length > this.ports){
    this.weights.removeRowCol()
    this.neurons.pop()
  }
  this.weights.iterate(function(i,y,x){
    if(probable(rate))
      this.weights.set(y,x,i + randomFloat())
  }.bind(this))
  for(var i = 0; i < this.neurons.length; i++)
    if(probable(rate))
      this.neurons[i].activation = random(0,this.activations.length-1)
}

Network.prototype.crossover = function(a,b){
  this.weights.iterate(function(i,y,x){
    var weight = probable(50) ? a.weights.get(y,x) : b.weights.get(y,x)
    if(weight)
      this.weights.set(y,x,weight)
  }.bind(this))
  for(var i = 0; i < this.neurons.length; i++){
    // this.neurons[i].activation = probable(50) ? a.neurons[i].activation : b.neurons[i].activation
    // this.neurons[i].threshold = probable(50) ? a.neurons[i].threshold : b.neurons[i].threshold
  }
}

Network.prototype.activations = [

  function(x){ // identity
    return x
  },

  function(x,t){ // binary
    return x > (t || 0) ? 1 : 0
  },

  function(x,t){ // bipolar
    return x > (t || 0) ? 1 : -1
  },

  function(x,t){ // rectifier
    return x > (t || 0) ? x : 0
  },

  function(x,t){ // gate
    return Math.floor(x > (t || 1) ? x : 0)
  },

  function(x){ // sigmoid
    return 1 / (1 + Math.pow(Math.E,-x))
  },

  function(x){ // tahn
    return Math.tan(x)
  },

  function(x){ // sin
    return Math.sin(x)
  },

  function(x){ // cos
    return Math.cos(x)
  }

]
