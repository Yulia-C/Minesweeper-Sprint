'use strict'

var gDifficulties = [4, 8, 12]

const MINE = '💣'
const FLAG = '🏴‍☠️'
const LIFE = '💖'

var gLivesCount
var gMineCount

// timer
var gInterval
var gStartTime
var gIsRun

var gLevel = {
    SIZE: gDifficulties[0],
    MINES: 2,
}

var gBoard
var gGame
const START_IMG = 'img/start.png'
const LOSE_IMG = 'img/lose.png'
const WIN_IMG = 'img/win.png'

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
    // console.log('Hi');
    gLivesCount = 3
    clearInterval(gInterval)
    gMineCount = 0
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

    console.log('gBoard:', gBoard)

    resetTimer()
}

// function onRestartGame() {
//     // gLevel = {
//     //     SIZE: gDifficulties[0],
//     //     MINES: 2,
//     // }
//     gGame = {
//         isOn: true,
//         shownCount: 0,
//         markedCount: 0,
//         secsPassed: 0
//     }
//     gBoard = buildBoard(gLevel.SIZE)
//     renderBoard(gBoard)

//     console.log('gBoard:', gBoard)

//     resetTimer()
// }

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
    for (var i = 0; i < gLevel.MINES; i++) {
        // setTimeout((onCellClicked)=> placeMines(board)
        // ,100)

        placeMines(board)
        updateMineCount(1)
        
        
    }
    updateLivesCount(0)

    return board
}

function placeMines(board) {
    var randCell = getRandEmptyCell(board)

    board[randCell.i][randCell.j].isMine = true
    // board[0][0].isMine = true
}


function onCellClicked(elCell, i, j) {
    // console.log('elCell:', elCell)
    if (!gGame.isOn) return

    var cell = gBoard[i][j]
    var count = countNeighborMines(i, j, gBoard)

    //Changing classname after clicking on cell:
    // var className = cell.isMine ? 'mined' : 'safe'
    // elCell.classList.remove('hidden')
    // elCell.classList.add(className)
    getClassName(elCell, cell)

    //Starting the timer:
    gIsRun = true
    if (gIsRun) {
        startTimer()
    } else {
        gIsRun = false
        clearTimeout(gInterval)
    }

    if (!cell.isShown) {
        cell.isShown = true
        if (cell.isMine) {
            updateLivesCount(-1)
            console.log('gLivesCount',gLivesCount);
            
            console.log('Game Over')
            //Updating the Dom
            elCell.innerText = MINE
            gGame.isOn = false
            document.querySelector('img').src = LOSE_IMG
        } else {
            console.log('count:', count)
            elCell.innerText = (count > 0) ? count : ''
            openNeighbourCells(i, j)
            // renderBoard(gBoard)
        }

    }

}

function onPlantFlag(ev) {
    //     // console.log('ev:', ev)
    // }

    // function updateTimer() {

}


function openNeighbourCells(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            //Model
            if (!gBoard[i][j].isMine) {

                gBoard[i][j].isShown = true

                //Dom
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                getClassName(elCell, gBoard[i][j])

            }
        }
    }
}

function updateMineCount(diff) {
    // if()
    gMineCount += diff
    document.querySelector('.mines').innerText = gMineCount
}

function updateLivesCount(diff) {
    for (var i = 0; i < gLivesCount; i++) {
        document.querySelector('.lives').innerText += LIFE
        
    }
    gLivesCount += diff
    // return gLivesCount
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
    var difficulty = gDifficulties[elBtn.dataset.idx]
    elBtn.classList.add('clicked')
    gLevel.SIZE = difficulty
    gLevel.MINES = difficulty / 2
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

    onInit()
}

function getClassName(elCell, cell) {
    var className = cell.isMine ? 'mined' : 'safe'
    elCell.classList.remove('hidden')
    elCell.classList.add(className)
}
