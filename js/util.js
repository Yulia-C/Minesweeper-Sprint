'use strict'


function renderBoard(board) {

    var strHTML = '<table><tbody>'
        for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = cell.isMine ? 'mined' : 'safe'
            var cellContent = !cell.isShown ? '' : (cell.isMine ? MINE : cell.minesAroundCount)
            strHTML += `<td data-i="${i}"data-j="${j}"onClick="onCellClicked(this,${i}, ${j})" class =" hidden ${className}">${cellContent}</td>`
        }

        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    var elBoard = document.querySelector('.playing-board')
    elBoard.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerText = value
    return elCell
} 

// function getSelector(coord) {
//     return `#cell-${coord.i}-${coord.j}`
// }


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

function startTimer() {
    // if (!gIsRun) {
    gStartTime = Date.now()
    // gIsRun = true
    gInterval = setInterval(updateTimer, 1)
    
}

function resetTimer() {
    clearInterval(gInterval)
    var elTimer = document.querySelector('.timer')
    elTimer.innerHTML = '00:00 '
    gStartTime = 0
    gInterval = 0

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

}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
