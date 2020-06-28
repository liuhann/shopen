const puppeteer = require('puppeteer');
const { record } = require('puppeteer-recorder');

puppeteer.launch({headless : true}).then(async browser => {
  const page = await browser.newPage();

  await page.goto('http://localhost/slide/9FzyAc2G0z', {waitUntil : 'networkidle2'});

  await record({
    ffmpeg: "c:\\ffmpeg\\bin\\ffmpeg.exe", // <-- provide full path to ffmpeg binary
    browser: browser, // Optional: a puppeteer Browser instance,
    page: page, // Optional: a puppeteer Page instance,
    output: 'output.webm',
    fps: 10,
    frames: 10 * 5, // desired seconds of recording multiplied by fps
    prepare: function (browser, page) { /* you could click on a button */ },
    render: function (browser, page, frame) { /* executed before each capture */ }
  });

  await browser.close();
});
