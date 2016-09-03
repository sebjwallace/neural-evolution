
var rules = {

  symmetry: function(grid,i,x,y,sum){
    if(sum == 4)
      return 1
    if(sum == 2)
      return 0
    if(grid.getNeighbour(x,y,'north') && sum == 2)
      return 0
    if(grid.getNeighbour(x,y,'southwest'))
      return 1
  },

  mazeTermites: function(grid,i,x,y,sum){
    if(sum == 4)
      return 1
    if(sum == 5)
      return 0
    if(i && sum == 2)
      return 1
  },

  gameOfLife: function(grid,i,x,y,sum){
    if(i && (sum == 2 || sum == 3))
      return 1
    if(sum == 3)
      return 1
    else return 0
  },

  a: function(grid,i,x,y,sum){
    if(sum > 2)
      return 0
    if(grid.getNeighbour(y,x,'east'))
      return 1
    if(grid.getNeighbour(y,x,'southwest'))
      return 1
    else return i
  }

}
