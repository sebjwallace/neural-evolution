
function DeepNet(i,o,h,l,a){

  this.activation = a || 'sigmoid'
  this.weights = []

  this.weights.push(new Matrix(i+1,h))
  for(var x = 0; x < this.layers; x++)
    this.weights.push(new Matrix(h+1,h))
  this.weights.push(new Matrix(h+1,o))

}

DeepNet.prototype.propagate = function(inputs,layer){
  var outputs = []
  layer.iterate(function(v,y,x){
    var p = v * (inputs[y] || 1)
    outputs[x] = outputs[x] ? outputs[x] + v * p : p
  })
  for(var i = 0; i < outputs.length; i++)
    outputs[i] = this.activations[this.activation](outputs[i])
  return outputs
}

DeepNet.prototype.feedforward = function(inputs){
  for(var i = 0; i < this.weights.length; i++)
      inputs = this.propagate(inputs,this.weights[i])
  return inputs
}

DeepNet.prototype.activations = {

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
  }

}
