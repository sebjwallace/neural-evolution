
function GeneticAlgorithm(args){

  this.size = args.size
  this.subjects = []
  this.scores = []
  this.generation = 0
  this.master = null

  this.genesis = args.genesis
  this.clone = args.clone
  this.mutate = args.mutate
  this.crossover = args.crossover
  this.test = args.test
  this.log = args.log

  this.populate()

}

GeneticAlgorithm.prototype.populate = function(){
  var i = this.size; while(i--)
    this.subjects[i] = this.genesis()
}

GeneticAlgorithm.prototype.train = function(generations){
  var i = generations; while(i--){
    var scores = []
    var n = this.size; while(n--){
      scores.push({
        score: this.test(this.subjects[n]),
        subject: this.subjects[n]
      })
    }
    this.generation = this.size - i
    this.repopulate(scores)
  }
}

GeneticAlgorithm.prototype.repopulate = function(scores){
  this.subjects = this.select(this.sort(scores))
  var i = this.size/2; while(i--){
    var mother = this.subjects[random(0,this.subjects.length-1)]
    var father = this.subjects[random(0,this.subjects.length-1)]
    var child = this.subjects[random(1,this.subjects.length-1)]
    if(this.crossover)
      child = this.crossover(child,mother,father)
    child = this.mutate(child)
  }
}

GeneticAlgorithm.prototype.sort = function(scores){
  scores.sort(function(a,b)
    {return a.score - b.score}).reverse()
  this.master = scores[0].subject
  this.scores.push(scores[0].score)
  if(this.log)
    this.log(this.generation,scores[0].score)
  return scores
}

GeneticAlgorithm.prototype.select = function(scores){
  var selection = []
  var i = scores.length; while(i--)
    if(probable((100-i)/0.9))
      selection.push(this.clone(scores[i].subject))
  while(selection.length < this.size)
    selection.push(this.clone(selection[random(0,selection.length-1)]))
  return selection
}
