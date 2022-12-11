export default class Solver {
    DIMENSION = 9
    constructor(sudokuBoard) {
        this.sudokuBoard = []
        sudokuBoard.forEach(element => {
            this.sudokuBoard.push([...element])
        })
        this.sudokuCp = []
        sudokuBoard.forEach(element => {
            this.sudokuCp.push([...element])
        })
    }

    solve() {
        if (!this.checkTableCorrect()) {
            return false
        }

        let i = 0, j = 0
        while (i < this.DIMENSION) {
            j = 0
            while (j < this.DIMENSION) {
                while (this.sudokuBoard[i][j] === 0) {
                    this.setPositionValue(i, j)
                    while (this.sudokuBoard[i][j] === 0) {
                        [i, j] = this.getLastEmptyPosition(i, j)
                        if (i < 0 || j < 0) {
                            return false
                        }
                        this.setPositionValue(i, j)
                    }
                }
                ++j
            }
            ++i
        }
        return true
    }

    checkTableCorrect() {
        for (let i = 0; i < this.DIMENSION; ++i) {
            for (let j = 0; j < this.DIMENSION; ++j) {
                if (this.sudokuBoard[i][j] !== 0 && !this.isPositionCorrect(i, j)) {
                    return false
                }
            }
        }
        return true
    }

    checkRow(row, column) {
        let count = 0
        this.sudokuBoard[row].forEach(el => {
            if (el === this.sudokuBoard[row][column]) {
                ++count
            }
        });
        return count === 1
    }

    checkColumn(row, column) {
        let count = 0
        for (let i = 0; i < this.DIMENSION; ++i) {
            if (this.sudokuBoard[i][column] === this.sudokuBoard[row][column]) {
                ++count
            }
        }
        return count === 1
    }

    checkSquare(row, column) {
        let count = 0
        let row_begin = Math.floor(row / 3) * 3
        let column_begin = Math.floor(column / 3) * 3
        for (let i = row_begin; i < row_begin + 3; ++i) {
            for (let j = column_begin; j < column_begin + 3; ++j) {
                if (this.sudokuBoard[i][j] === this.sudokuBoard[row][column]) {
                    ++count
                }
            }
        }
        return count === 1
    }

    isPositionCorrect(row, column) {
        return this.checkRow(row, column) && 
               this.checkColumn(row, column) &&
               this.checkSquare(row, column)
    }

    setPositionValue(row, column) {
        for (let i = this.sudokuBoard[row][column] + 1; i <= this.DIMENSION; ++i) {
            this.sudokuBoard[row][column] = i
            if (this.isPositionCorrect(row, column)) {
                return
            }
        }
        this.sudokuBoard[row][column] = 0
    }

    getLastEmptyPosition(row, column) {
        --column
        while (row >= 0) {
            while (column >= 0) {
                if (this.sudokuCp[row][column] === 0) {
                    return [row, column]
                }
                --column
            }
            column = this.DIMENSION - 1
            --row
        }
        return [row, column]
    }
}
