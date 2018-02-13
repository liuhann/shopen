<template>
  <div id="app" class="ui-app-frame">
    <header>
    </header>

    <aside>
    </aside>

    <main>
    </main>

    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style lang="less">

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    border: 0;
  }

  html {
    font-size: 62.5%;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 2rem;
    text-transform: initial;
    letter-spacing: initial;
    font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
    color: #212b35;
  }

  .ui-app-frame {
    width: 100%;
    min-height: 100%;

    header {
      position: fixed;
      z-index: 502;
      top: 0;
      right: 0;
      left: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      height: 5.6rem;
    }
  }
</style>
