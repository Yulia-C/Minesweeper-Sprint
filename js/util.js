'use strict'


function getRandEmptyCell(board) {

    const emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            var cell = board[i][j]
            if (!cell.isMine && !cell.isShown) {
                emptyCells.push({ i, j })
            }
        }
    }
    if (!emptyCells.length) return null
    var randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
    var randomCell = emptyCells[randIdx]
    return randomCell
}

function renderCell(value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerHTML = value
}

function getCellCoord(elCell) {
    const coord = {}

    const str = elCell.className
    const classParts = str.split(' ')  
    const coordClass = classParts.find(cls => cls.startsWith('cell-'))
    if (coordClass) {
        const parts = coordClass.split('-')

        coord.i = +parts[1]
        coord.j = +parts[2]
    }

    return coord;
}

function countNeighborMines(cellI, cellJ, board) {
    var mineCount = 0;

    // Loop through all 8 surrounding cells (including diagonals)
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            // if (i === cellI && j === cellJ) continue // Skip the current cell

            const cell = board[i][j];
            if (cell.isMine) mineCount++; // Count if it's a mine
        }
    }
    return mineCount;
}

function startTimer() {
    if (!gTimerStarted) {
        gStartTime = Date.now()
        gInterval = setInterval(updateTimer, 1)
        gTimerStarted = true
    
    }

}

function resetTimer() {
    clearInterval(gInterval)
    gStartTime = 0
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '00:00'
    gInterval = null
    gTimerStarted = false

}

function updateTimer() {
    var now = Date.now()
    var elapsedTime = now - gStartTime

    var minutes = Math.floor(elapsedTime / (1000 * 60) % 60)
    var seconds = Math.floor(elapsedTime / 1000 % 60)
    var milliseconds = Math.floor(elapsedTime % 1000)

    var elTime = document.querySelector('.timer')
    // console.log('elTime:', elTime)
    var formattedMinutes = String(minutes).padStart(2, '0')
    var formattedSeconds = String(seconds).padStart(2, '0')

    elTime.innerText = `${formattedMinutes}:${formattedSeconds}`
    gGame.secsPassed = seconds
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
