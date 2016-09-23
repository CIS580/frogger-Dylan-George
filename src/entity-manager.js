module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize, heightSize) {
  this.cellSize = cellSize;
  this.heightSize = heightSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / heightSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.heightSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x + entity.width/2, entity.y + entity.height/2);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){

  var index = getIndex.call(this, entity.x + entity.width/2, entity.y + entity.height/2);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

EntityManager.prototype.collide = function(callback) {
  this.cells.forEach(function(cell) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
      cell.forEach(function(entity2) {
		//console.log(entity1._cell);
        if(entity1 != entity2) checkForCollision(entity1, entity2, callback);
      });
    });
  });
}

//The collision boxes have a slight padding so collisions feel more fair
function checkForCollision(entity1, entity2, callback) {
  var collides = !(entity1.x + entity1.width - 10 < entity2.x ||
                   entity1.x > entity2.x + entity2.width - 10 ||
                   entity1.y + entity1.height - 10 < entity2.y ||
                   entity1.y > entity2.y + entity2.height - 10);
  if(collides) {
    callback(entity1, entity2);
  }
} 
