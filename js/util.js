'use strict'



function renderBoard(board) {
    document.querySelector('img').src = START_IMG
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            // const className = `cell cell-${i}-${j}`
            var className = cell.isMine ? 'mined' : 'safe'
            var cellContent = !cell.isShown ? '' : (cell.isMine ? MINE : cell.minesAroundCount)
            var location = `cell-${i}-${j}`
            strHTML += `<td onmousedown="onRightClick(event,this)" class="${location} hidden ${className}" onClick="onCellClicked(this,${i}, ${j})">${cellContent}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.playing-board')
    elContainer.innerHTML = strHTML
}

function getRandEmptyCell(board) {

    const emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            var cell = board[i][j]
            if (!cell.isMine) {
                emptyCells.push({ i, j })
            }
        }
    }
    // if (!emptyCells.length) return null
    var randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
    var randomCell = emptyCells[randIdx]

    return randomCell
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getCellCoord(strCell) {
    const coord = {}
    var trimmedClass = strCell.className.split(' ')[0]
    const parts = trimmedClass.split('-') // ['cell', '2', '7']
    if (parts.length === 3 && parts[0] === 'cell') {

        coord.i = +parts[1]
        coord.j = +parts[2]
    } else {
        coord.i = NaN;
        coord.j = NaN;
    }
    // console.log('coord:', coord) // {i: 2, j: 7}
    return coord
}

function countNeighborMines(cellI, cellJ, board) {
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) mineCount++
        }
    }
    return mineCount
}

// function updateClassName(board) {
//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board[i].length; j++) {
//             const cell = board[i][j]
//             const elCell = document.querySelector(`.cell-${i}-${j}`)
//             if (cell.isMine) {
//                 elCell.classList.remove('.safe')
//                 elCell.classList.add('mined')
//             }
//         }
//     }
//     renderBoard(board)

// }

function startTimer() {
    if (!gTimerStarted) {
        gStartTime = Date.now()
        gInterval = setInterval(updateTimer, 1)
        gTimerStarted = true
        for (var i = 0; i < gLevel.MINES; i++) {
            placeMines(gBoard)
            // updateClassName(gBoard)
        }
        
        // renderBoard(gBoard)
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
