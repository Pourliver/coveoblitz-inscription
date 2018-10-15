var express = require('express');
const SERVER_PORT = 80;
let json_response = require("./team.json");

/*
* Server setup
*/ 
var app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.end("Handled methods : POST");
});

app.post('/', (req, res) => {
  puzzles = req.body.puzzles;
  solutions = puzzles.map(puzzle => solvePuzzle(puzzle.origin, puzzle.end, puzzle.scrambledPath));
  // Make Solutions a JSON.
  json_response.solutions = solutions;
  res.send(json_response);    // echo the result back
});

/*
* Solver
*
* L'idée, c'est que si je prend un point de départ, et que j'y additionne tous les déplacements "certains",
* je vais obtenir un autre point. À partir de ce point, je peut calculer les variations en X et en Y pour 
* arriver au point de destination. Ces variations là se traduisent directement en lettre pour "unscramble"
* le path.
*
*/

const BOUNDS = 4; // 0-4 is allowed.
const ROW_LETTERS = "du"; 
const COL_LETTERS = "rl"; 
const LETTER_MAP = {
  "r": 1,
  "l": -1,
  "d": 1,
  "u": -1
};


function solvePuzzle(origin, end, path) {
  console.log(`Puzzle : ${origin}, ${end}, ${path}`);
  let solution = "";
  let row_deviation = origin.row - end.row;
  let col_deviation = origin.col - end.col;

  for (let letter of path) {
    let value = LETTER_MAP[letter];

    if (ROW_LETTERS.indexOf(letter) != -1) {
      row_deviation += value;
    }
    else if (COL_LETTERS.indexOf(letter) != -1) {
      col_deviation += value;
    }
  }
  
  console.log(`Deviation from origin - row : ${row_deviation}`);
  console.log(`Deviation from origin - col : ${col_deviation}`);
  
  for (let letter of path) {
    if (letter != "?") { 
      solution += letter;
      continue;
    }

    if (row_deviation > 0) {
      solution += "u";
      row_deviation--;
    } else if (row_deviation < 0) {
      solution += "d";
      row_deviation++;
    } else if (col_deviation > 0) {
      solution += "l";
      col_deviation--;
    } else if (col_deviation < 0) {
      solution += "r";
      col_deviation++;
    } else {
      // If already at (0,0), we need to do a +1 move, then a -1 move.
      solution += "d";
      row_deviation++;
    }
  }
  
  console.log(`Solution : ${solution}`);
  return solution
}

app.listen(SERVER_PORT);

