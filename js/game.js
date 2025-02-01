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
    if (!gGame.isOn) return
    if (elCell.classList.contains('flagged')) return

    var cell = gBoard[i][j]

    //Changing classname after clicking on cell:
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
            updateLivesCount(1)

            console.log('Game Over')
            //When lives === 0 gameOver()

            //Updating the Dom
            elCell.innerText = MINE
            gGame.isOn = false
            document.querySelector('img').src = LOSE_IMG
        } else {
            // console.log('count:', count)
            openNeighbourCells(i, j)
        }

    }
}

function onRightClick(ev, elCell) {
    if (!gGame.isOn) return
    document.addEventListener('contextmenu', ev => {
        ev.preventDefault()
    })
    // console.log(ev);
    var rightClick
    if (!ev) var ev = window.Event
    if (ev.which) {
        rightClick = (ev.which === 3)
        //true
    } else if (ev.button) {
        rightClick = (ev.which === 2)
        //false
    }
    if (rightClick) {

        if (!elCell.classList.contains('hidden')) return

        if (elCell.classList.contains('flagged')) {
            removeFlag(elCell)
        } else {
            onPlantFlag(elCell)
        }
    }
  
}

function onPlantFlag(elCell) {
    // var rightClick = onRightClick(elCell)
    const cellCoord = getCellCoord(elCell)

    if (elCell.classList.contains('hidden') && !elCell.classList.contains('flagged')) {
        //Model
        gGame.markedCount += 1
        updateMineCount(-1)
        //DOM
        elCell.classList.add('flagged')
        elCell.innerText = FLAG
        console.log('Flag planted');
        gBoard[cellCoord.i][cellCoord.j].isMarked = true

    }

}

function removeFlag(elCell) {
    const cellCoord = getCellCoord(elCell)

    if (elCell.classList.contains('flagged')) {
        elCell.classList.remove('flagged')
        elCell.innerText = ''
        gGame.markedCount -= 1
        updateMineCount(+1)
        console.log('Flag removed');
        gBoard[cellCoord.i][cellCoord.j].isMarked = false
    }
}

function openNeighbourCells(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            //Model
            if (!gBoard[i][j].isMine) {
                var count = countNeighborMines(i, j, gBoard)
                gBoard[i][j].isShown = true
                gBoard[i][j].minesAroundCount = count

                //Dom
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                if (elCell.classList.contains('flagged')) return
                elCell.innerText = (count > 0) ? count : ''
                if (count === 1) elCell.classList.add(`one`)
                if (count === 2) elCell.classList.add(`two`)
                if (count === 3) elCell.classList.add(`three`)
                getClassName(elCell, gBoard[i][j])

            }
        }
    }
    console.log(gBoard);
}

function updateMineCount(diff) {
    // if()
    gMineCount += diff
    document.querySelector('.mines').innerText = gMineCount
}

function updateLivesCount(diff) {
    gLivesCount -= diff
    document.querySelector('.lives').innerText = gLivesCount

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
