
function Matrix(r,c,v){

  this.matrix = []
  this.isMatrix = true

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

  get: function(y,x){
    if(!this.matrix[y])
      return null
    return this.matrix[y][x]
  },

  set: function(y,x,v){
    this.matrix[y][x] = v
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
    for(var x = 0; x < this.columns(); x++)
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
      this.matrix[y].splice(x || this.columns()-1,1)
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
    var m = new Matrix(this.rows(),this.columns())
    for(var y = 0; y < this.matrix.length; y++){
      var n = this.reduceRow(y)
      m.fillRow(y,n)
    }
    return m
  },

  sumCols: function(){
    var m = new Matrix(this.rows(),this.columns())
    for(var x = 0; x < this.matrix.length; x++){
      var n = this.reduceCol(x)
      m.fillCol(x,n)
    }
    return m
  },

  flip: function(){
    var m = new Matrix(this.rows(),this.columns())
    for(var y = 0; y < this.matrix.length; y++)
      m.setRow(y,this.getCol(y))
    return m
  },

  clone: function(f){
    var clone = new Matrix(this.rows(),this.columns())
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
    return this.rows() * this.columns()
  },

  root: function(){
    return this.rows()
  },

  rows: function(){
    return this.matrix.length
  },

  columns: function(){
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
