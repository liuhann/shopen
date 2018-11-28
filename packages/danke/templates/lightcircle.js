module.exports = {
  'id': 'lightcircle',
  'name': '淡圆',
  'coordinate': 'center',
  'desc': '素雅专注，平淡是一种习惯',
  'cover': '000/travel.jpg',
  'scenes': [0, 0],
  'templates': [{
    'template': 'designed',
    'display': '',
    'style': 'background-color: #F5FBFF',
    'hideDelay': 2000,
    'triggerClose': 3000,
    'elements': [{
      'type': 'circle',
      'x': '18vw',
      'y': '-32vw',
      'radius': '32vw',
      'style': 'background-color: #E7F3FC; box-shadow: inset 0px 0px 0px 5px rgb(222, 239, 251);',
      'in': {'duration': '1000ms', 'delay': '200ms', 'animation': 'bounce-in-bck'},
      'out': {'duration': '1000ms', 'animation': 'bounce-out-bck'}
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '-25vw',
      'height': '50vw',
      'width': '50vw',
      'style': 'border-radius: 25vw',
      'in': {'duration': '600ms', 'animation': 'slide-in-br'},
      'out': {'duration': '600ms', 'delay': '200ms', 'animation': 'slide-out-bl'}
    }]
  }]
}
