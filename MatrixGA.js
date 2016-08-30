
function MatrixGA(r,s){

  this.size = s
  this.matrices = []
  this.master = null

  this.populate(r,this.size)

}

MatrixGA.prototype.populate = function(r,s){
  for(var i = 0; i < s; i++)
    this.matrices[i] = new Matrix(r)
  return this.matrices
}

MatrixGA.prototype.train = function(iterations,test){
  for(var i = 0; i < iterations; i++){
    var scores = []
    for(var m = 0; m < this.matrices.length; m++)
      scores.push({
        score: test(this.matrices[m]),
        matrix: this.matrices[m]
      })
    this.repopulate(scores)
  }
}

MatrixGA.prototype.repopulate = function(scores){
  var selection = this.select(scores,this.size)
  for(var i = 0; i < this.size; i++){
    var a = selection[random(0,selection.length-1)]
    var b = selection[random(0,selection.length-1)]
    var offspring = this.crossover(a,b)
    this.matrices[i] = this.mutate(offspring,random(0,100))
  }
}

MatrixGA.prototype.select = function(scores,size){
  scores.sort(function(a,b){ return a.score + b.score })
  this.master = scores[0].matrix
  var selection = []
  for(var i = 0; i < scores.length; i++)
    if(probable(i/0.9))
      selection.push(scores[i].matrix)
  while(selection.length < (size || this.size))
    selection.push(selection[random(0,selection.length-1)])
  return selection
}

MatrixGA.prototype.mutate = function(matrix,rate){
  if(probable(rate/100))
    matrix.addRowCol()
  if(probable(rate/100))
    matrix.removeRowCol()
  matrix.iterate(function(i,y,x){
    if(probable(rate))
      matrix.set(y,x,i + (randomFloat() / ((101 - rate)/10)))
  })
  return matrix
}

MatrixGA.prototype.crossover = function(a,b){
  // composite crossover
  return a.clone(function(i,y,x){
    return probable(50) ? a.get(y,x) : b.get(y,x)
  })
}
