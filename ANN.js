
function ANN({inputs,outputs,topology,activation,modifier}){

  this.inputs = inputs
  this.outputs = outputs || 0
  this.topology = topology || 'feedforward'
  this.activation = activation || 'sigmoid'
  this.modifier = modifier || null
  this.neurons = {}
  this.cache = []
  this.setTopology(...arguments)

}

ANN.prototype.feedforward = function(input){
  while(Object.keys(input).length){
    console.log(input)
    input = this.propagate(input)
  }
}

ANN.prototype.propagate = function(input){
  var output = {}
  for(var y in input)
    for(var x in this.neurons[y])
      output[x] = (output[x] || 0) + (this.neurons[y][x] * input[y])
  for(var i in output)
    output[i] = this.activations[this.activation](output[i])
  this.neurons = this.modifiers[this.modifier || 'default'](this.neurons,this.cache)
  return output
}

ANN.prototype.setTopology = function({topology,inputs,outputs}){
  if(topology && inputs)
    this.neurons = this.topologies[topology](...arguments)
}

ANN.prototype.topologies = {

  feedforward: function(inputs,outputs,layers = 0,hidden = inputs){
    function initLayer(start,end,synapses){
      for(var y = start; y < start + end; y++){
        neurons[y] = {}
        for(var x = start + end; x < start + end + synapses; x++)
          neurons[y][x] = randomInt(0,10) / 10
      }
    }
    var neurons = {}
    initLayer(0,inputs,hidden)
    for(var i = 0; i < layers; i++)
      initLayer(inputs+(hidden*i),hidden,hidden)
    initLayer(inputs+(hidden*layers),hidden,outputs)
    return neurons
  },

  recurrent: function(){},

  acyclic: function(){},

  cortical: function({inputs,layers}){
    var neurons = {}
    for(var layer = 0; layer < layers; layer++){
      for(var y = 0; y < inputs; y++){
        var neuron = layer * inputs + y
        neurons[neuron] = {}
        for(var x = y-1; x < y+2; x++){
          var synapse = inputs * (layer + 1) + x
          if(synapse >= inputs && synapse < inputs * layers && neuron < (layers-1) * inputs)
            neurons[neuron][synapse] = randomInt(0,10) / 10
        }
      }
    }
    return neurons
  }

}

ANN.prototype.genetic = {

  crossover: function(){},

  mutate: function(){},

  clone: function(){}

}

ANN.prototype.activations = {

  identity: function(x){
    return x
  },

  binary: function(x,t){
    return x > (t || 1) ? 1 : 0
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

  gaussian: function(x){
    var rnd = randomInt(0,10) / 10
    var mix = rnd * influence
    return rnd * (1 - mix) + 1 * mix
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

ANN.prototype.modifiers = {

  default: function(neurons){
    return neurons
  },

  STDP: function(neurons,inputs,outputs){
    for(var y in inputs)
      for(var x in outputs)
        if(inputs[y] >= 1 && outputs[x] >= 1)
          neurons[y][x] += 0.1
    return neurons
  }

}
