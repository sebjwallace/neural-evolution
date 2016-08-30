
function GeneticAlgorithm(size,constructor){

  this.size = size
  this.networks = []
  this.master = null

  this.populate(constructor)

}

GeneticAlgorithm.prototype.populate = function(constructor){
  for(var i = 0; i < this.size; i++)
    this.networks[i] = constructor()
}

GeneticAlgorithm.prototype.train = function(iterations,test){
  for(var i = 0; i < iterations; i++){
    var scores = []
    for(var n = 0; n < this.size; n++)
      scores.push({
        score: test(this.networks[n]),
        network: this.networks[n]
      })
    this.repopulate(scores)
  }
}

GeneticAlgorithm.prototype.repopulate = function(scores){
  this.networks = this.select(scores)
  for(var i = 0; i < this.size / 2; i++){
    var mother = this.networks[random(0,this.networks.length-1)]
    var father = this.networks[random(0,this.networks.length-1)]
    var child = this.networks[random(1,this.networks.length-1)]
    child.crossover(mother,father)
    child.mutate(random(10,100))
    for(var n = 0; n < (probable(0.1) ? random(1,10) : 0); n++)
      child.mutate(100)
  }
}

GeneticAlgorithm.prototype.select = function(scores){
  scores.sort(function(a,b){ return a.score - b.score }).reverse()
  this.master = scores[0].network
  console.log(scores[0].score)
  var selection = []
  for(var i = 0; i < scores.length; i++)
    if(probable((100-i)/0.9))
      selection.push(scores[i].network.clone())
  while(selection.length < this.size)
    selection.push(selection[random(0,selection.length-1)].clone())
  return selection
}
