<template>
    <SudokuBase title="Result">
        <tbody v-for="i in 3">
            <tr v-for="j in 3" class="row">
                <td class="cell" v-for="k in 9" ref="cell_td">
                </td>
            </tr>
        </tbody>
    </SudokuBase>
</template>

<script>
import SudokuBase from "./SudokuBase.vue"

export default {
    components: {
        SudokuBase
    },
    methods: {
        fillBoardValues(resultBoard) {
            for (let i = 0; i < this.$refs.cell_td.length; ++i) {
                this.$refs.cell_td[i].textContent = resultBoard[Math.floor(i / 9)][i % 9]
            }
        }
    }
}
</script>
