
function Network(i,o){

  this.inputs = i
  this.outputs = o
  this.ports = i + o
  this.weights = new Matrix(this.ports)
  this.neurons = []

  for(var i = 0; i < this.ports; i++)
    this.neurons[i] = {
      activation: i >= this.inputs ? 'identity' : 'rectifier',
      threshold: 1
    }

}

Network.prototype.process = function(inputs){

  var self = this

  var matrix = new Matrix(this.weights.root())
  for(var i = 0; i < this.inputs; i++)
    matrix.fillRow(i,inputs[i])

  var step = 0
  while(!matrix.get(this.ports-1,0) && step++ < 100)
    matrix = matrix.multiply(this.weights).sumCols().flip()
      .transform(function(i,y,x){
        return self.activations[self.neurons[y].activation](i,self.neurons[y].threshold)
      })

  var outputs = []
  for(var i = this.inputs; i < this.ports; i++)
    outputs.push(matrix.get(i,0))

  return outputs

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
