<template>
    <div class="theme-setting theme-setting--text" v-if="setting.type==='text'">
        <label class="next-label" >{{setting.label}}</label>
        <input type="text" :value="value[setting.field]" @input="">
    </div>
</template>

<script>
    export default {
        name: "field-text"
    }
</script>

<style scoped>

</style>