//oop js
$(() => {
  let purgeIndexPool = [];
  let createIndexPool = [];
  let run = false;

  class Cell {
    constructor(x, y, alive) {
      this.position = {
        x,
        y
      };
      this.alive = alive;
      this.neighboursIndex = [];
    }

    getAliveNeighbours() {
      let count = 0;

      for (let i = 0; i < this.neighboursIndex.length; i++) {
        //if the neighbour is alive
        if (field.allCells[this.neighboursIndex[i]].alive) {
          count++;
        }
      }

      return count;
    }
  }

  class Field {
    constructor() {
      this.width = 80; //number of fields in length (column)

      //assure a quadratic Field
      this.height = this.width; //number of fields in height (row)
      this.cellSize = 10; //chose to put it here instead of in the Cell Object
      //draw size, needed because one cell is 10x10(cell size)
      this.draw = {
        width: this.width * this.cellSize,
        height: this.height * this.cellSize
      };

      this.allCells = [];
      this.cornerCellsIndex = {};
    }

    prepare() {
      //create dead cells for every field
      //first one will be on position 1/1, second on 1/2 etc
      //loop through every row
      for (let i = 1; i <= this.height; i++) {
        //fill row
        for (let k = 1; k <= this.width; k++) {
          //x, y, alive
          this.allCells.push(new Cell(k, i, false));
        }
      }

      this.setCornerCellsIndex();

      $.each(this.allCells, (i, cell) => {
        this.defineNeighbours(i, cell);
        this.setDefaultAlives(i, cell);
      });
    }

    setCornerCellsIndex() {
      this.cornerCellsIndex = {
        leftTop: 0,
        leftBot: this.allCells.length - this.width, //can take width or height, doesn't matter because its square
        rightTop: this.width - 1, //can take width or height, doesn't matter because its square
        rightBot: this.allCells.length - 1
      };
    }

    defineNeighbours(i, cell) {
      const neighbourIndex = {
        topLeft: i - this.width - 1,
        topMiddle: i - this.width,
        topRight: i - this.width + 1,

        middleLeft: i - 1,
        middleRight: i + 1,

        botLeft: i + this.width - 1,
        botMiddle: i + this.width,
        botRight: i + this.width + 1
      };

      const actualNeighboursIndex = [];

      switch (i) {
        case this.cornerCellsIndex.leftTop:
          //no neighbour left and top
          actualNeighboursIndex.push(
            neighbourIndex.middleRight,
            neighbourIndex.botMiddle,
            neighbourIndex.botRight
          );
          break;
        case this.cornerCellsIndex.leftBot:
          //no neighbour left and bot
          actualNeighboursIndex.push(
            neighbourIndex.topMiddle,
            neighbourIndex.topRight,
            neighbourIndex.middleRight
          );
          break;
        case this.cornerCellsIndex.rightTop:
          //no neighbour right and top
          actualNeighboursIndex.push(
            neighbourIndex.middleLeft,
            neighbourIndex.botMiddle,
            neighbourIndex.botLeft
          );
          break;
        case this.cornerCellsIndex.rightBot:
          //no neighbour right and bot
          actualNeighboursIndex.push(
            neighbourIndex.topLeft,
            neighbourIndex.topMiddle,
            neighbourIndex.middleLeft
          );
          break;
        default:
          if (i < this.width) { //top
            //no neighbour top
            actualNeighboursIndex.push(
              neighbourIndex.middleLeft,
              neighbourIndex.middleRight,
              neighbourIndex.botLeft,
              neighbourIndex.botMiddle,
              neighbourIndex.botRight
            );
          } else if (i >= this.allCells.length - field.width) { //bot
            //no neighbour bot
            actualNeighboursIndex.push(
              neighbourIndex.topLeft,
              neighbourIndex.topMiddle,
              neighbourIndex.topRight,
              neighbourIndex.middleLeft,
              neighbourIndex.middleRight
            );
          } else if (i % this.width === 0) { //left, first and last left ones won't reach this (corners)
            //no neighbour left
            actualNeighboursIndex.push(
              neighbourIndex.topMiddle,
              neighbourIndex.topRight,
              neighbourIndex.middleRight,
              neighbourIndex.botMiddle,
              neighbourIndex.botRight
            );
          } else if ((i + 1) % this.width === 0) { //right, first and last right ones won't reach this (corners)
            //no neighbour right
            actualNeighboursIndex.push(
              neighbourIndex.topLeft,
              neighbourIndex.topMiddle,
              neighbourIndex.middleLeft,
              neighbourIndex.botLeft,
              neighbourIndex.botMiddle
            );
          } else {
            //all neighbours
            actualNeighboursIndex.push(
              neighbourIndex.topLeft,
              neighbourIndex.topMiddle,
              neighbourIndex.topRight,
              neighbourIndex.middleLeft,
              neighbourIndex.middleRight,
              neighbourIndex.botLeft,
              neighbourIndex.botMiddle,
              neighbourIndex.botRight
            );
          }
      }

      this.allCells[i].neighboursIndex = actualNeighboursIndex;
    }

    setDefaultAlives(i, cell) {
      //coordinates of the fields that should be alive as default
      const coordinates = [
        [70, 66],
        [70, 67],
        [70, 68],
        [71, 68],

        [76, 66],
        [76, 67],
        [76, 68],
        [75, 68],

        [70, 80],
        [70, 79],
        [70, 78],
        [71, 78],

        [76, 80],
        [76, 79],
        [76, 78],
        [75, 78],

        [68, 75],
        [68, 76],
        [67, 76],
        [66, 76],

        [68, 71],
        [68, 70],
        [67, 70],
        [66, 70],

        [78, 75],
        [78, 76],
        [79, 76],
        [80, 76],

        [78, 71],
        [78, 70],
        [79, 70],
        [80, 70],

        [72, 70],
        [72, 71],
        [71, 72],
        [70, 72],
        [70, 71],
        [71, 70],

        [76, 71],
        [76, 72],
        [75, 72],
        [74, 71],
        [74, 70],
        [75, 70],

        [72, 75],
        [72, 76],
        [71, 76],
        [70, 75],
        [70, 74],
        [71, 74],

        [76, 74],
        [76, 75],
        [75, 76],
        [74, 76],
        [74, 75],
        [75, 74],
      ];

      $.each(coordinates, (i, coordinateSet) => {
        if (cell.position.x === coordinateSet[0] && cell.position.y === coordinateSet[1]) {
          cell.alive = true;
        }
      });
    }
  }

  const field = new Field();
  field.prepare();

  class GridCanvas {
    constructor(canvasEl) {
      //size of canvas
      this.width = field.draw.width;
      this.height = field.draw.height;

      this.context = canvasEl.getContext('2d');

      canvasEl.setAttribute('width', this.width);
      canvasEl.setAttribute('height', this.height);
    }

    draw() {
      for (let i = 0; i <= field.draw.width; i += field.cellSize) {
        this.context.moveTo(0.5 + i, 0); //0 = padding
        this.context.lineTo(0.5 + i, field.draw.height);
      }

      for (let i = 0; i <= field.draw.height; i += field.cellSize) {
        this.context.moveTo(0, 0.5 + i);
        this.context.lineTo(field.draw.width, 0.5 + i);
      }

      this.context.strokeStyle = 'black';
      this.context.stroke();
    }
  }

  const gridCanvas = new GridCanvas(document.getElementById('grid-canvas'));
  gridCanvas.draw();

  class GameCanvas {
    constructor(canvasEl) {
      //size of canvas
      this.width = field.draw.width;
      this.height = field.draw.height;

      this.context = canvasEl.getContext('2d');

      canvasEl.setAttribute('width', this.width);
      canvasEl.setAttribute('height', this.height);

      canvasEl.addEventListener('click', e => {
        const cursorPos = this.getCursorPosition(canvasEl, e);

        //loop through every cell and check if its in range of the clicked area
        $.each(field.allCells, (i, cell) => {
          const checkXInRange = cell.position.x * field.cellSize === cursorPos[0] && cell.position.x * field.cellSize === cursorPos[0];
          const checkYInRange = cell.position.y * field.cellSize === cursorPos[1] && cell.position.y * field.cellSize === cursorPos[1];

          if (checkXInRange && checkYInRange) {
            //draw/hide circle
            //will change on next generation
            cell.alive = !cell.alive;

            //show the user the changes if the game is paused
            if (!run) {
              //clear and draw everything new
              this.context.clearRect(0, 0, field.draw.width, field.draw.height);

              $.each(field.allCells, (i, cell) => {
                if (cell.alive) {
                  gameCanvas.drawCell(cell);
                }
              });
            }

            //exit
            return false;
          }
        });
      });
    }

    drawCell(cell) {
      const actualPos = cell.position;

      //- value so it starts on 0/0
      const x = actualPos.x * field.cellSize - field.cellSize;
      const y = actualPos.y * field.cellSize - field.cellSize;

      this.context.fillStyle = '#000';

      this.context.fillRect(x, y, field.cellSize, field.cellSize);
    }


    getCursorPosition(canvasEl, event) {
      const rect = canvasEl.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      console.log(`x: ${x} y: ${y}`);

      x = Math.floor(x / 10) * 10 + 10;
      y = Math.floor(y / 10) * 10 + 10;

      return [x, y]
    }

    getCanvasContext() {
      return this.context;
    }
  }

  const gameCanvas = new GameCanvas(document.getElementById('game-canvas'));

  class GameOfLife {
    constructor() {

    }

    lifeCycle() {
      //stop endless execution
      if (!run) {
        //draw everything new and return
        $.each(field.allCells, (i, cell) => {
          if (cell.alive) {
            gameCanvas.drawCell(cell);
          }
        });

        return;
      }

      $.each(field.allCells, (i, cell) => {
        const an = cell.getAliveNeighbours();
        if (cell.alive) {
          gameCanvas.drawCell(cell);

          //any live cell with fewer than two live neighbours dies, as if caused by underpopulation
          //any live cell with two or three live neighbours lives on to the next generation
          //any live cell with more than three live neighbours dies, as if by overpopulation

          //mark the cell for purge if its under or overpopulated
          if (an < 2 || an > 3) {
            purgeIndexPool.push(i);
          }
        } else {
          //any dead cell with exactly three live neighbours will become alive at the next cycle
          if (an === 3) {
            ///mark the cell for becoming alive
            createIndexPool.push(i);
          }
        }
      });

      setTimeout(() => {
        this.newGeneration();
      }, 100);

      // requestAnimationFrame(newGeneration);
    }

    newGeneration() {
      //clear everything
      gameCanvas.getCanvasContext().clearRect(0, 0, field.draw.width, field.draw.height);

      //set cells alive or dead
      this.god();

      //continue lifeCycle
      this.lifeCycle();
    }

    //decide if a cell lives or dies
    god() {
      for (let i = 0; i < purgeIndexPool.length; i++) {
        field.allCells[purgeIndexPool[i]].alive = false;
      }

      for (let k = 0; k < createIndexPool.length; k++) {
        field.allCells[createIndexPool[k]].alive = true;
      }

      //clear pools
      purgeIndexPool = [];
      createIndexPool = [];
    }
  }

  const gol = new GameOfLife();

  //initial draw
  $.each(field.allCells, (i, cell) => {
    if (cell.alive) {
      gameCanvas.drawCell(cell);
    }
  });

  $('.game-of-life #start').click(() => {
    run = true;
    gol.lifeCycle();
  });

  $('.game-of-life #stop').click(() => {
    run = false;
  });
});
