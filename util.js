
function randomFloat(){
  return random(-1000,1000) / 1000
}

function random(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function probable(max){
  return (random(0,10000) / 100 < max)
}
