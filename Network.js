
function Network(i,o){

  this.inputs = i
  this.outputs = o
  this.ports = i + o
  this.weights = new Matrix(this.ports)
  this.neurons = []

  for(var i = 0; i < this.ports; i++)
    this.neurons[i] = {
      activation: 'sigmoid',
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
    this.neurons.push({threshold: 1, activation: 'sigmoid'})
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
      this.neurons[i].activation = probable(50) ? 'sigmoid' : 'binary'
}

Network.prototype.crossover = function(a,b){
  this.weights.iterate(function(i,y,x){
    var weight = probable(50) ? a.weights.get(y,x) : b.weights.get(y,x)
    if(weight)
      this.weights.set(y,x,weight)
  }.bind(this))
}

Network.prototype.activations = {

  identity: function(x){
    return x
  },

  binary: function(x,t){
    return x > (t || 0) ? 1 : 0
  },

  bipolar: function(x,t){
    return x > (t || 0) ? 1 : -1
  },

  rectifier: function(x,t){
    return x > (t || 0) ? x : 0
  },

  gate: function(x,t){
    return Math.floor(x > (t || 1) ? x : 0)
  },

  sigmoid: function(x){
    return 1 / (1 + Math.pow(Math.E,-x))
  },

  tahn: function(x){
    return Math.tan(x)
  },

  sin: function(x){
    return Math.sin(x)
  },

  cos: function(x){
    return Math.cos(x)
  },

  gaussian: function(x){
    var n = 0
    for(var i = 0; i < x; i++)
      n += Math.random()
    return n / x
  }

}
