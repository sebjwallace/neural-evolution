
function Matrix(r,c,v){

  this.matrix = []
  this.isMatrix = true
  this.keys = {}

  for(var y = 0; y < r; y++){
    this.matrix[y] = []
    for(var x = 0; x < (c || r); x++)
      this.matrix[y][x] = v || 0
  }

}

Matrix.prototype = {

  iterate: function(f){
    for(var y = 0; y < this.matrix.length; y++)
      for(var x = 0; x < this.matrix[y].length; x++)
        f(this.matrix[y][x],y,x)
  },

  iterateRow: function(y,f){
    for(var x = 0; x < this.matrix[y].length; x++)
      f(this.matrix[y][x],y,x)
  },

  iterateCol: function(x,f){
    for(var y = 0; y < this.matrix.length; y++)
      f(this.matrix[y][x],y,x)
  },

  key: function(k){
    return this.matrix[this.keys[k]][this.keys[k]]
  },

  keyRow: function(k){
    return this.matrix[this.keys[k]]
  },

  keyCol: function(y,k){
    return this.matrix[y][this.keys[k]]
  },

  keyAssign: function(k,yx){
    this.keys[k] = yx
  },

  keyInsert: function(k,v){
    this.addRowCol(v)
    this.keyAssign(k,this.root()-1)
  },

  keyRemove: function(k){
    this.removeRowCol(this.keys[k])
    delete this.keys[k]
  },

  get: function(y,x,wrap){
    if(y >= this.root() && wrap)
      y = 0
    if(y < 0 && wrap)
      y = this.root()-1
    if(x >= this.root() && wrap)
      x = 0
    if(x < 0 && wrap)
      x = this.root()-1
    if(!this.matrix[y] && !wrap)
      return null
    return this.matrix[y][x]
  },

  set: function(y,x,v){
    this.matrix[y][x] = v
  },

  increment: function(y,x,v){
    this.set(y,x,this.get(y,x) + v)
  },

  decrement: function(y,x,v){
    this.set(y,x,this.get(y,x) - v)
  },

  getRow: function(y){
    return [].concat(this.matrix[y])
  },

  getCol: function(x){
    var col = []
    for(var y = 0; y < this.matrix.length; y++)
      col[y] = this.matrix[y][x]
    return col
  },

  setRow: function(y,r){
    this.matrix[y] = [].concat(r)
  },

  setCol: function(x,c){
    for(var y = 0; y < this.matrix.length; y++)
      this.matrix[y][x] = c[y]
  },

  addRow: function(v){
    var row = []
    for(var x = 0; x < this.cols(); x++)
      row[x] = v || 0
    this.matrix.push(row)
  },

  addCol: function(v){
    for(var y = 0; y < this.matrix.length; y++)
      this.matrix[y].push(v || 0)
  },

  addRowCol: function(v){
    this.addRow(v)
    this.addCol(v)
  },

  removeRow: function(y){
    this.matrix.splice(y || this.rows()-1,1)
  },

  removeCol: function(x){
    for(var y = 0; y < this.rows(); y++)
      this.matrix[y].splice(x || this.cols()-1,1)
  },

  removeRowCol: function(y){
    this.removeRow(y)
    this.removeCol(y)
  },

  fillRow: function(y,v){
    for(var x = 0; x < this.matrix[y].length; x++)
      this.matrix[y][x] = v
  },

  fillCol: function(x,v){
    for(var y = 0; y < this.matrix.length; y++)
      this.matrix[y][x] = v
  },

  reduceRow: function(y){
    var n = 0
    for(var x = 0; x < this.matrix[y].length; x++)
      n += this.matrix[y][x]
    return n
  },

  reduceCol: function(x){
    var n = 0
    for(var y = 0; y < this.matrix.length; y++)
      n += this.matrix[y][x]
    return n
  },

  reduce: function(){
    var n = 0
    this.iterate(function(i){
      n += i
    })
    return n
  },

  sumRows: function(){
    var m = new Matrix(this.rows(),this.cols())
    for(var y = 0; y < this.matrix.length; y++){
      var n = this.reduceRow(y)
      m.fillRow(y,n)
    }
    return m
  },

  sumCols: function(){
    var m = new Matrix(this.rows(),this.cols())
    for(var x = 0; x < this.matrix.length; x++){
      var n = this.reduceCol(x)
      m.fillCol(x,n)
    }
    return m
  },

  flip: function(){
    var m = new Matrix(this.rows(),this.cols())
    for(var y = 0; y < this.matrix.length; y++)
      m.setRow(y,this.getCol(y))
    return m
  },

  clone: function(f){
    var clone = new Matrix(this.rows(),this.cols())
    this.iterate(function(i,y,x){
      var k = (f || function(){})(i,y,x)
      clone.set(y,x,k == null ? i : k)
    })
    return clone
  },

  transform: function(f){
    return this.clone(f)
  },

  multiply: function(v,y,x){
    if(v.isMatrix)
      return this.clone(function(i,y,x){
        var r = i * v.get(y,x)
        return r
      })
    return this.clone(function(i,Y,X){
      if(y != null){
        if(y == Y)
          return i * v
        else return 0
      }
      if(x != null){
        if(x == X)
          return i * v
        else return 0
      }
      return i * v
    })
  },

  add: function(m){
    return this.clone(function(i,y,x){
      return i + m.get(y,x)
    })
  },

  isEmpty: function(){
    return this.reduce() ? true : false
  },

  size: function(){
    return this.rows() * this.cols()
  },

  root: function(){
    return this.rows()
  },

  rows: function(){
    return this.matrix.length
  },

  cols: function(){
    if(!this.matrix[0])
      return 0
    return this.matrix[0].length
  },

  toString: function(){
    var s = ''
    for(var y = 0; y < this.matrix.length; y++)
      s += this.matrix[y].toString() + '\n'
    return s
  },

  fromArray: function(arr){
    for(var y = 0; y < arr.length; y++)
      for(var x = 0; x < arr[y].length; x++)
        this.matrix[y][x] = arr[y][x]
  },

  toArray: function(){
    return this.matrix
  },

  toJSON: function(){
    return JSON.stringify(this.matrix)
  }

}

Matrix.prototype.getNeighbour = function(y,x,d){
  if(d == 'north' || d == 0)
    return this.get(y-1,x,true)
  if(d == 'northeast' || d == 1)
    return this.get(y-1,x+1,true)
  if(d == 'east' || d == 2)
    return this.get(y,x+1,true)
  if(d == 'southeast' || d == 3)
    return this.get(y+1,x+1,true)
  if(d == 'south' || d == 4)
    return this.get(y+1,x,true)
  if(d == 'southwest' || d == 5)
    return this.get(y+1,x-1,true)
  if(d == 'west' || d == 6)
    return this.get(y,x-1,true)
  if(d == 'northwest' || d == 7)
    return this.get(y-1,x-1,true)
}

Matrix.prototype.getNeighbours = function(y,x){
  var n = []
  for(var i = 0; i < 8; i++)
    n.push(this.getNeighbour(y,x,i))
  return n
}

Matrix.prototype.iterateNeighbours = function(y,x,f){
  var n = this.getNeighbours(y,x)
  for(var i = 0; i < n.length; i++)
    f(n[i],y,x)
}

Matrix.prototype.randomNeighbour = function(){
  return this.getNeighbour(Math.floor(Math.random() * 8))
}

Matrix.prototype.traverse_forward = this.iterate

Matrix.prototype.traverse_backward = function(f){
  for(var y = this.matrix.length-1; y >= 0; y--)
    for(var x = this.matrix[y].length; x >= 0; x--)
      f(this.get(y,x),y,x)
}

Matrix.prototype.traverse_random = function(f,n){
  for(var i = 0; i < (n || this.size()); i++){
    var y = Math.floor(Math.random() * this.root())
    var x = Math.floor(Math.random() * this.root())
    f(this.get(y,x),y,x)
  }
}

Matrix.prototype.traverse_neighbourhood = function(f){
  this.iterate(function(i,y,x){
    this.iterateNeighbours(y,x,f)
  }.bind(this))
}
