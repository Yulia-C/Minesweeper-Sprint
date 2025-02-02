'use strict'

var gDifficulties = [8, 12, 16]

const MINE = '💣'
const FLAG = '🏴‍☠️'
const LIFE = '💖'

var gLivesCount
var gMineCount

// timer
var gInterval = null
var gStartTime
var gTimerStarted = false

var gLevel = {
    SIZE: gDifficulties[0],
    MINES: 16,
}

var gBoard
var gGame

const START_IMG = 'img/start.png'
const LOSE_IMG = 'img/lose.png'
const WIN_IMG = 'img/win.png'


function onInit() {
    // console.log('Hi');
    resetTimer()
    gLivesCount = 3
    gMineCount = 0
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    updateMineCount(gLevel.MINES)

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
    updateLivesCount(0)

    return board

}

function placeMines(board) {
    var randCell = getRandEmptyCell(board)
    board[randCell.i][randCell.j].isMine = true

}


function getClassName(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var className = cell.isMine ? 'mined' : 'safe'
            var elCell = document.querySelector(`.cell-${i}-${j}`)

            elCell.classList.add(`${className}`)
        }
    }
}


function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (elCell.classList.contains('flagged')) return

    var cell = gBoard[i][j]

    //Starting the timer:
    startTimer()

    // opening the cells
    if (!cell.isShown) {
        //Changing classname after clicking on cell:
        elCell.classList.remove('hidden')
        cell.isShown = true
        if (cell.isMine && cell.isShown) {
            updateLivesCount(1)
            if (gLivesCount !== 0) {

                setTimeout(() => {
                    elCell.classList.add('hidden'), cell.isShown = false
                    if (elCell.classList.contains('hidden')) elCell.innerText = ''
                }, 1000)
            }
            if (gLivesCount === 0) {
                revealAllMines()
                console.log('Game Over')
                clearTimeout(gInterval)
                //When lives === 0 gameOver()
                gGame.isOn = false

                document.querySelector('img').src = LOSE_IMG

            }

            //Updating the Dom
            elCell.innerText = MINE
        } else {
            getClassName(gBoard)
            openNeighbourCells(i, j)
        }

    }
    checkVictory()
}

function onRightClick(ev, elCell) {
    document.addEventListener('contextmenu', ev => {
        ev.preventDefault(elCell)
    })
    if (!gGame.isOn) return
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
    checkVictory()

}

function onPlantFlag(elCell) {
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
    console.log(gGame);

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
    console.log(gGame);

}




function openNeighbourCells(cellI, cellJ) {

    for (var i = cellI - 2; i <= cellI + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 2; j <= cellJ + 2; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            //Model
            if (!gBoard[i][j].isMine) {
                var count = countNeighborMines(i, j, gBoard)

                gBoard[i][j].isShown = true

                gBoard[i][j].minesAroundCount = count

                gGame.shownCount += 1
                // console.log(gBoard[i][j]);

                //Dom
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                if (elCell.classList.contains('flagged')) return
                elCell.innerText = (count > 0) ? count : ''
                if (count === 1) elCell.classList.add(`one`)
                if (count === 2) elCell.classList.add(`two`)
                if (count === 3) elCell.classList.add(`three`)
                if (count === 4) elCell.classList.add(`four`)
                if (count === 5) elCell.classList.add(`five`)
                elCell.classList.remove('hidden')
            }
        }
    }
    console.log(gBoard);
    console.log(gGame);

}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine && !cell.isShown) {
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.innerText = MINE// Display the mine
                elCell.classList.remove('hidden')// Make the cell visible
                cell.isShown = true// Mark the cell as revealed
            }
        }
    }
}
function updateMineCount(diff) {
    gMineCount += diff
    document.querySelector('.mines').innerText = gMineCount
}

function updateLivesCount(diff) {
    // var lives = []
    // for (var i = 0; i < gLivesCount; i++) {
    //     lives.push(LIFE)
    // }
    gLivesCount -= diff
    document.querySelector('.lives').innerText = gLivesCount
    // lives.pop(LIFE)

    // return gLivesCount
}

function checkVictory() {
    var allNonMinesRevealed = true
    // var allMinesFlagged = true

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]

            // // If the cell is a mine, check if it's flagged
            // if (cell.isMine && !cell.isMarked) {
            //     allMinesFlagged = false
            // }

            // If the cell is not a mine, check if it's revealed
            if (!cell.isMine && !cell.isShown) {
                allNonMinesRevealed = false
            }
        }
    }
    if (gMineCount === 0 && allNonMinesRevealed && gLivesCount !== 0) {
        console.log('Victory!')
        clearTimeout(gInterval)
        //When lives === 0 gameOver()
        gGame.isOn = false

        document.querySelector('img').src = WIN_IMG
    }

    console.log(gMineCount);
}

function onDifficultyClick(elBtn) {
    var difficulty = gDifficulties[elBtn.dataset.idx]
    elBtn.classList.add('clicked')
    gLevel.SIZE = difficulty
    gLevel.MINES = (difficulty * 2)
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

    onInit()
}


