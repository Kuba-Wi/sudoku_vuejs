<template>
    <table>
        <caption>{{title}}</caption>
        <colgroup><col><col><col></colgroup>
        <colgroup><col><col><col></colgroup>
        <colgroup><col><col><col></colgroup>
        <slot />
    </table>
</template>

<script>
export default {
    props: {
        title: String
    }
}
</script>

<style>
table {
    border-collapse: collapse;
    font-family: Calibri, sans-serif;
    font-size: 20px;
    margin: 0 auto;
}

colgroup, tbody {
    border: solid medium;
}

td {
    border: solid thin;
}

.cell {
    height: 30px;
    width: 30px;
    text-align: center;
}
</style>
