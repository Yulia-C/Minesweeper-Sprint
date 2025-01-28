'use strict'

var gDifficulties = [4, 8, 12]

const MINE = '💣'
const FLAG = '🏴‍☠️'

var gCellCount

// timer
var gInterval
var gStartTime

var gLevel = {
    SIZE: gDifficulties[0],
    MINES: 2,
}

var gBoard
var gGame

// Todo's:
//need to find a boolean to define the startTimer
//  only once so i will be able to end it

// randomize the bombs
// stop the game when the mine is clicked
// add updateMineCount()
// implement blownegs() for opening cells that are not bombs
// on first click

// add lives icon for starters

function onInit() {
    resetTimer()
    console.log('Hi');
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

    console.log('gBoard:', gBoard)

}



function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    placeMines(board)
    // board[0][0].isMine = true
    // board[3][3].isMine = true
    return board
}

function placeMines(board) {
    board[0][0].isMine = true
    board[board.length - 1][board[0].length - 1].isMine = true
}

function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    var count = countNeighborMines(i, j, gBoard)

    if (cell !== MINE) {
        startTimer()
    } else if (cell === gCellCount) {
        // clearInterval(gInterval)
    }

    elCell.classList.remove('hidden')
    if (!cell.isShown) {
        cell.isShown = true
        if (cell.isMine) {
            console.log('Game Over')
            elCell.innerText = MINE
            gGame.isOn = false
            return
        } else {
            console.log('count:', count)
            elCell.innerText = (count > 0) ? count : ''
            // renderBoard(gBoard)
        }

    }



}

function onPlantFlag(ev) {
    //     // console.log('ev:', ev)
    // }

    // function updateTimer() {

}


function blowUpNeighbors(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            //Model
            gBoard[i][j] = ''

            //Dom
            var elCell = renderCell(i, j, '')
            elCell.classList.remove('.hidden')
        }
    }
}

// function onCellMarked(coords) {
//     // query select them one by one and add mark 
//     for (var i = 0; i < coords.length; i++) {
//         var coord = coords[i] // {i:,j}

//         var selector = getSelector(coord) // '#cell-i-j'
//         var elCell = document.querySelector(selector)
//         elCell.classList.add('mark')
//     }
// }

function onDifficultyClick(elBtn) {
    var cellCount = gDifficulties[elBtn.dataset.idx]
    elBtn.classList.add('clicked')
    gBoard = buildBoard(cellCount)
    renderBoard(gBoard)

    // onInit()
}


