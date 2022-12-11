<template>
    <SudokuBase title="Input">
        <tbody v-for="i in 3">
            <tr v-for="j in 3" class="row">
                <td class="cell" v-for="k in 9" ref="cell_td">
                    <input class="cell_input" 
                        type="text" 
                        maxlength="1" 
                        @change="onInputChange($event, i - 1, j - 1, k - 1)"
                        ref="cell_input">
                </td>
            </tr>
        </tbody>
    </SudokuBase>
</template>

<script>
import SudokuBase from "./SudokuBase.vue"

export default {
    name: "SudokuInput",
    components: {
        SudokuBase
    },
    data() {
        return {
            input_values: []
        }
    },
    created: function() {
        for (let i = 0; i < 9; ++i) {
            this.input_values.push([])
            for (let j = 0; j < 9; ++j) {
                this.input_values[i].push(0)
            }
        }
    },
    methods: {
        onInputChange(event, i, j, k) {
            if ((isNaN(event.target.value) && event.target.value !== '') || event.target.value === '0') {
                event.target.value = 1
            }

            this.input_values[3 * i + j][k] = Number(event.target.value)
        },
        clear() {
            for (let i = 0; i < this.$refs.cell_input.length; ++i) {
                this.$refs.cell_input[i].value = ''
            }

            for (let i = 0; i < 9; ++i) {
                for (let j = 0; j < 9; ++j) {
                    this.input_values[i][j] = 0
                }
            }
        }
    }
}
</script>

<style scoped>
.cell_input {
    height: 30px;
    width: 30px;
    border: none;
    text-align: center;
    font-size: 20px;
}
</style>
