module.exports = {
  'id': 'lightcircle',
  'name': '滑动',
  'coordinate': 'tl',
  'desc': '横向切换',
  'cover': '000/slide.jpg',
  'scenes': [0, 0, 0],
  'templates': [{
    'template': 'designed',
    'display': '',
    'hideDelay': 2000,
    'triggerClose': 3000,
    'elements': [{
      'type': 'image',
      'x': '0vw',
      'y': '0vh',
      'width': '100vw',
      'height': '100vh',
      'in': {'duration': '500ms', 'animation': 'slide-in-right'},
      'out': {'duration': '500ms', 'animation': 'slide-out-left-hf'}
    }]
  }]
}
