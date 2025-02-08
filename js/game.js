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


var gBoard
var gGame
var gIsDark = false

var gLevel = {
    SIZE: gDifficulties[0],
    MINES: 8,
}

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
        isFirstClicked: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    updateMineCount(gLevel.MINES)
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

    console.log('gBoard:', gBoard)
    console.log('gGame:', gGame)
}


function renderBoard(board) {
    document.querySelector('img').src = START_IMG
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            // const className = `cell cell-${i}-${j}`
            // var className = cell.isMine ? 'mined' : 'safe'
            var cellContent = !cell.isShown ? '' : (cell.isMine ? MINE : cell.minesAroundCount)
            var location = `cell-${i}-${j}`
            strHTML += `<td oncontextmenu="onRightClick(event,this)" class="${location} hidden" onClick="onCellClicked(this,${i}, ${j})">${cellContent}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.playing-board')
    elContainer.innerHTML = strHTML
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

function placeMines(board, firstClickedI, firstClickedJ) {
    var mineCount = 0
    while (mineCount < gLevel.MINES) {
        var randCell = getRandEmptyCell(board)
        // Make sure this cell is not the first clicked cell and is not already a mine
        if (!(randCell.i === firstClickedI && randCell.j === firstClickedJ) && !board[randCell.i][randCell.j].isMine) {
            board[randCell.i][randCell.j].isMine = true
            mineCount++
        }
    }
}

function firstClicked(i, j) {
    if (gGame.isFirstClicked) return
    gGame.isFirstClicked = true
    placeMines(gBoard, i, j)
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (elCell.classList.contains('flagged')) return

    var cell = gBoard[i][j]
    firstClicked(i, j)
    console.log('gGame:', gGame)

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
                gGame.isOn = false

                document.querySelector('img').src = LOSE_IMG

            }

            //Updating the Dom
            elCell.innerText = cell.isMine ? MINE : minesAroundCount
        } else {
            getClassName(gBoard)
            openNeighbourCells(i, j)
        }
    }
    checkVictory()
}

function onRightClick(ev, elCell) {
    ev.preventDefault()

    if (!gGame.isOn) return

    const cellCoord = getCellCoord(elCell)
    const cell = gBoard[cellCoord.i][cellCoord.j]
    if (!cell.isMarked) {
        cell.isMarked = true
        gGame.markedCount += 1
        updateMineCount(-1)
        elCell.innerText = FLAG
        elCell.classList.add('flagged')
    } else {
        cell.isMarked = !cell.isMarked
        gGame.markedCount -= 1
        updateMineCount(1)
        elCell.innerText = ''
        elCell.classList.remove('flagged')
    }

    checkVictory()
}


function openNeighbourCells(cellI, cellJ) {
    // if (gBoard[cellI][cellJ].minesAroundCount !== 0) return

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue

            const currCell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            var count = countNeighborMines(i, j, gBoard)

            if (!currCell.isShown && !currCell.isMine) {
                currCell.isShown = true
                gGame.shownCount += 1
                elCell.classList.remove('hidden')
                elCell.innerText = (count > 0) ? count : ''
                currCell.minesAroundCount = count

                if (count === 0) {
                    openNeighbourCells(i, j)
                }
            }

        }
    }
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


// function openNeighbourCells(cellI, cellJ) {

//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= gBoard[i].length) continue
//             //Model
//             if (!gBoard[i][j].isMine) {
//                 var count = countNeighborMines(i, j, gBoard)

//                 gBoard[i][j].isShown = true

//                 gBoard[i][j].minesAroundCount = count

//                 gGame.shownCount += 1
//                 // console.log(gBoard[i][j]);

//                 //Dom
//                 var elCell = document.querySelector(`.cell-${i}-${j}`)
//                 if (elCell.classList.contains('flagged')) return
//                 elCell.innerHTML = (count > 0) ? count : ''
//                 // if (count === 1) elCell.classList.add(`one`)
//                 // if (count === 2) elCell.classList.add(`two`)
//                 // if (count === 3) elCell.classList.add(`three`)
//                 // if (count === 4) elCell.classList.add(`four`)
//                 // if (count === 5) elCell.classList.add(`five`)
//                 elCell.classList.remove('hidden')
//                 if (gBoard[i][j].minesAroundCount === 0) {
//                     openNeighbourCells(i,j)
//                 }
//             }
//         }
//     }
//     console.log(gBoard);
//     console.log(gGame);

// }

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
    gLivesCount -= diff
    const elLives = document.querySelector('.lives')
    elLives.innerHTML = LIFE.repeat(gLivesCount)
}

function checkVictory() {
    var allNonMinesRevealed = true
    var allMinesFlagged = true
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            // If the cell is a mine, check if it's flagged
            if (cell.isMine && !cell.isMarked) {
                allMinesFlagged = false
            }
            // If the cell is not a mine, check if it's revealed
            if (!cell.isMine && !cell.isShown) {
                allNonMinesRevealed = false
            }
        }
    }
    if (gMineCount === 0 && allNonMinesRevealed && allMinesFlagged && gLivesCount !== 0) {
        console.log('Victory!')
        clearTimeout(gInterval)
        gGame.isOn = false
        document.querySelector('img').src = WIN_IMG
    }
}

function onLevelClick(elBtn) {
    var difficulty = gDifficulties[elBtn.dataset.idx]
    elBtn.classList.add('clicked')
    gLevel.SIZE = difficulty
    gLevel.MINES = (difficulty * 2)
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)

    onInit()
}


function onDarkMode() {
    console.log('Toggling Dark Mode')

    if (!gIsDark) {
        addDark()
        gIsDark = true
    } else {
        removeDark()
        gIsDark = false
    }
}

function addDark() {

    var body = document.body  // Select the body element
    var buttons = document.querySelectorAll('button')  // Select all buttons
    var gameBorders = document.querySelectorAll('.game-border') // Select all game borders
    var tables = document.querySelectorAll('table')  // Select all tables
    var tds = document.querySelectorAll('td')  // Select all td elements
    var hiddenCells = document.querySelectorAll('.hidden')  // Select all hidden cells

    body.classList.add('dark-mode')

    buttons.forEach(function (button) {
        button.classList.add('dark-mode')
    })
    gameBorders.forEach(function (gameBorder) {
        gameBorder.classList.add('dark-mode')
    })

    tables.forEach(function (table) {
        table.classList.add('dark-mode')
    })

    tds.forEach(function (td) {
        td.classList.add('dark-mode')
    })
    hiddenCells.forEach(function (cell) {
        cell.classList.add('dark-mode')
    })
}

function removeDark() {
    var body = document.body  // Select the body element
    var buttons = document.querySelectorAll('button')  // Select all buttons
    var gameBorders = document.querySelectorAll('.game-border') // Select all game borders
    var tables = document.querySelectorAll('table')  // Select all tables
    var tds = document.querySelectorAll('td')  // Select all td elements
    var hiddenCells = document.querySelectorAll('.hidden')  // Select all hidden cells

    body.classList.remove('dark-mode')
    buttons.forEach(function (button) {
        button.classList.remove('dark-mode')
    })
    gameBorders.forEach(function (gameBorder) {
        gameBorder.classList.remove('dark-mode')
    })
    tables.forEach(function (table) {
        table.classList.remove('dark-mode')
    })
    tds.forEach(function (td) {
        td.classList.remove('dark-mode')
    })
    hiddenCells.forEach(function (cell) {
        cell.classList.remove('dark-mode')
    })
}