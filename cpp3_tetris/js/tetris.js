document.onkeyup = key;
const levels = [777, 690, 555, 444, 404, 333, 303, 222, 202, 111, 101];
let run;

const board = new Board(10, 20);
const highscore = new Highscore();
const gameStatus = new status();

function newGame() {
  next = new piece();
  current = new piece();
  view = new view(20, 10, 20);
  preview = new preview(20);

  document.getElementById("player").innerText = localStorage.getItem(
    "username"
  );
  gameStatus.update();
  preview.update();
  view.update();

  run = setInterval(step, levels[0]);
}

function piece() {
  this.x = 4;
  this.y = 0;
  const id = Math.floor(Math.random() * 7);
  this.Color = id + 1;
  this.Shape = shapes[id];
  this.Rotation = 0;

  this.move = function(dx, dy) {
    const newx = this.x + dx;
    const newy = this.y + dy;
    if (!this.checkPos(newx, newy, this.Rotation)) return;
    this.x = newx;
    this.y = newy;
    view.update();
  };

  this.rotate = function(dr) {
    let newrot = (this.Rotation + dr) % this.Shape.length;
    if (newrot < 0) newrot = this.Shape.length + newrot;
    if (!this.checkPos(this.x, this.y, newrot)) return;
    this.Rotation = newrot;
    view.update();
  };

  this.drop = function() {
    while (!this.stuck()) this.y += 1;
    view.update();
  };

  this.checkPos = function(newx, newy, newrot) {
    const d = this.Shape[newrot];
    for (let i = 0; i < 4; i++)
      if (
        newx + d[i][0] < 0 ||
        newx + d[i][0] >= board.x ||
        newy + d[i][1] < 0 ||
        newy + d[i][1] >= board.y ||
        board.val[newx + d[i][0]][newy + d[i][1]]
      )
        return false;
    return true;
  };

  this.stuck = function() {
    if (this.checkPos(this.x, this.y + 1, this.Rotation)) return false;
    return true;
  };
}

function view(size, x, y) {
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.ctx.strokeStyle = colors[0];
  this.xsize = x * size;
  this.ysize = y * size;

  this.update = function() {
    this.ctx.clearRect(0, 0, this.xsize, this.ysize);
    this.drawBoard();
    let c = current.Shape[current.Rotation];

    this.ctx.fillStyle = colors[current.Color];
    for (let i = 0; i < 4; i++) {
      this.ctx.fillRect(
        (c[i][0] + current.x) * size,
        (c[i][1] + current.y) * size,
        size,
        size
      );

      this.ctx.strokeRect(
        (c[i][0] + current.x) * size,
        (c[i][1] + current.y) * size,
        size,
        size
      );
    }
  };

  this.drawBoard = function() {
    for (let i = 0; i < board.y; i++)
      for (let j = 0; j < board.x; j++) {
        const b = board.val[j][i];
        if (b) {
          this.ctx.fillStyle = colors[b];
          this.ctx.fillRect(j * size, i * size, size, size);
          this.ctx.strokeRect(j * size, i * size, size, size);
        }
      }
  };
}

function preview(size) {
  this.canvas = document.getElementById("preview");
  this.ctx = this.canvas.getContext("2d");
  this.ctx.strokeStyle = colors[0];

  this.update = function() {
    this.ctx.clearRect(0, 0, 5 * size, 6 * size);
    let d = next.Shape[0];
    for (let i = 0; i < 4; i++) {
      this.ctx.fillStyle = colors[next.Color];
      this.ctx.fillRect(
        size + d[i][0] * size,
        size + d[i][1] * size,
        size,
        size
      );
      this.ctx.strokeRect(
        size + d[i][0] * size,
        size + d[i][1] * size,
        size,
        size
      );
    }
  };
}

function status() {
  this.lines = 0;
  this.level = 1;
  const score = document.getElementById("score");
  const lvl = document.getElementById("level");

  this.checkLevel = function() {
    if (this.lines % 10 == 0) {
      clearInterval(run);
      this.level++;
      run = setInterval(step, levels[this.level]);
      this.update();
    }
  };
  this.update = function() {
    score.innerText = this.lines;
    lvl.innerText = this.level;
  };
}

function key(e) {
  const evt = e ? e : window.event ? window.event : null;
  if (evt) {
    const key = evt.charCode
      ? evt.charCode
      : evt.keyCode
      ? evt.keyCode
      : evt.which
      ? evt.which
      : 0;
    if (key == "37") current.move(-1, 0);
    else if (key == "39") current.move(1, 0);
    else if (key == "40") current.rotate(1);
    else if (key == "38") current.rotate(-1);
    else if (key == "32") current.drop();
  }
}

function step() {
  if (!current.checkPos(current.x, current.y + 1, current.Rotation)) {
    if (current.y == 0) clearInterval(run);
    board.add(current);
    board.checkLines(
      () => {
        view.update();
      },
      () => {
        gameStatus.lines++;
        gameStatus.checkLevel();
      }
    );
    if (!next.checkPos(next.x, next.y, next.Rotation)) {
      endGame();
    }
    current = next;
    next = new piece();
    preview.update();
    gameStatus.update();
  } else current.y += 1;
  view.update();
}

function endGame() {
  clearInterval(run);
  highscore.saveToScoreboard({
    username: localStorage.getItem("username"),
    level: gameStatus.level
  });
  $("#highscore").modal();
  $("#reboot").click(() => {
    window.location.href = "index.html";
  });
  highscore.showScoreboard();
}

$(() => {
  newGame();
});
