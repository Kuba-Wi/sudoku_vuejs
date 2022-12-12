<template>
  <SudokuInput ref="inputBoard"/>
  <div id="buttons_container">
    <input id="solve_btn" class="btn" type="button" value="Solve" @click="solve">
    <input id="scan_btn" class="btn" type="button" value="Scan photo" @click="scan">
    <input id="file_input" type="file" style="display:none">
    <input id="clear_btn" class="btn" type="button" value="Clear" @click="clear">
  </div>
  <SudokuResult ref="resultBoard" v-show="showResult"/>
  <img id="imageSrc" src="../classes/sudoku1.jpg" v-show="false">
  <canvas id="canvasOutput"></canvas>
</template>

<script>
import SudokuInput from '../components/SudokuInput.vue'
import SudokuResult from '../components/SudokuResult.vue'

import Solver from '../classes/sudokuSolver.js'
import getDigitsFromImg from '../classes/imageprocessing.js'

export default {
  name: 'HomeView',
  components: {
    SudokuInput,
    SudokuResult
  },
  data() {
    return {
      showResult: false
    }
  },
  methods: {
    clear() {
      this.$refs.inputBoard.clear()
      this.showResult = false
    },
    solve() {
      this.showResult = false
      let solver = new Solver(this.$refs.inputBoard.input_values)
      if (solver.solve()) {
        this.showResult = true
        this.$refs.resultBoard.fillBoardValues(solver.sudokuBoard)
      } else {
        window.alert("Wrong input. Can't solve")
      }
    },
    scan() {
      getDigitsFromImg("imageSrc")
    }
  }
}
</script>

<style scoped>
.btn {
  height: 50px;
  width: 100px;
  text-align: center;
  font-size: 30px;
  display: inline-block;
}

#solve_btn {
  margin: 20px 10px 0 0;
}

#scan_btn {
  width: 180px;
  margin: 20px 0 0 0;
}

#clear_btn {
  margin: 20px 0 0 10px;
}

#buttons_container {
  text-align: center;
  margin-bottom: 10px;
}
</style>
