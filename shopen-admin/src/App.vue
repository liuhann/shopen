<template>
  <div id="app" class="ui-app-frame">
    <header>
        <div class="brand">
          <img src="./assets/shopen.svg"/> <span>SHOPEN</span>
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
      background-color: #fff;
      //background-color: #1B5299;
      box-shadow: rgba(31,53,78,.11) 0 1px;
      color:@wk;
      position: fixed;
      z-index: 502;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      align-items: center;
      height: 5.6rem;

      .brand {
        line-height: 5rem;
        font-size: 2.5rem;
        img {
          width: 3.8rem;
          vertical-align: middle;
          padding-left: 1rem;
        }
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
