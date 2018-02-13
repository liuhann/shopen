<template>
  <div id="app" class="ui-app-frame">
    <header>
        <div class="brand">
          <img src="./assets/shopen.svg"/> <span>shopen</span>
        </div>
        <div class="tools"></div>
    </header>
    <aside>

    </aside>

    <main>
      <router-view/>
    </main>

  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import "style/vars";

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
    text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    box-sizing: border-box;
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
      /*background-color: #212b35;*/
      box-shadow: rgba(31,53,78,.11) 0 1px;
      color: #f9f9f9;
      position: fixed;
      z-index: 502;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      align-items: center;
      height: 5.6rem;

      .brand {
        background-color: #1B5299;
        box-sizing: border-box;
        display: flex;
        font-size: 2rem;
        width: 24rem;
        align-items: center;
        height: 100%;
        min-width: 24rem;
        padding-right: 0.8rem;
        padding-left: 1.6rem;
        img {
          width: 3rem;
          vertical-align: middle;
        }
        span {
          font-weight: bold;
          font-size: 2.8rem;
          padding-left: 1rem;
        }
      }
      .tools {
        background-color: #1b5299de;
        height: 100%;
        display: flex;
        flex: 1;
      }
    }

    aside {
      z-index: 1;
      position: fixed;
      top: 5.6rem;
      width: 24rem;
      border-right: 1px solid #dfe4e8;
      bottom: 0;
      left: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding-left: 0px;
      background-color: #f4f6f8;
    }

    main {
      padding-left: 24rem;
      display: block;
      padding-top: 5.6rem;
      padding-right: 0px;
      padding-bottom: 0px;
    }
  }
</style>
