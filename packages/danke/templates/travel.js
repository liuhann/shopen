module.exports = {
  'id': 'travel',
  'name': '旅行',
  'coordinate': 'center',
  'desc': '一次色彩纷呈之旅',
  'cover': '000/travel.jpg',
  'scenes': [0, 1],
  'templates': [{
    'template': 'designed',
    'display': '',
    'hideDelay': 3000,
    'triggerClose': 3000,
    'elements': [{
      'type': 'image',
      'x': '2vw',
      'y': '-48vw',
      'height': '96vw',
      'width': '96vw',
      'required': true,
      'in': {'duration': '500ms', 'delay': '300ms', 'animation': 'slide-in-right'},
      'out': {'duration': '500ms', 'delay': '300ms', 'animation': 'slide-out-left'}
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '28vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '400', 'delay': '400ms', 'animation': 'flip-in-hor-bottom'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-bottom'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '-60vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '500ms', 'delay': '800ms', 'animation': 'flip-in-hor-top'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-top'}
    }]
  }, {
    'template': 'designed',
    'state': '',
    'hideDelay': 4000,
    'triggerClose': 3000,
    'elements': [{
      'type': 'image',
      'x': '2vw',
      'y': '-48vw',
      'height': '96vw',
      'width': '96vw',
      'in': {'duration': '500ms', 'delay': '300ms', 'animation': 'slide-in-right'},
      'out': {'duration': '600ms', 'delay': '300ms', 'animation': 'slide-out-left'}
    }, {
      'type': 'typing',
      'x': '10vw',
      'y': '-20vw',
      'background': 'rgba(0, 0, 0, .7)',
      'color': '#fff',
      'fontSize': '5vw',
      'style': 'padding: 2px 8px',
      'in': {'duration': '600ms', 'delay': '1000ms', 'animation': 'slideFadeInUp'},
      'out': {'duration': '600ms', 'animation': 'slideFadeOutLeft'},
      'text': '层林尽染'
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '-60vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'duration': '600ms', 'delay': '700ms', 'animation': 'slideFadeInUp'},
      'out': {'duration': '600ms', 'animation': 'slideFadeOutUp'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '-70vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'duration': '600ms', 'delay': '1100ms', 'animation': 'slideFadeInUp'},
      'out': {'duration': '600ms', 'animation': 'slideFadeOutUp'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '-45vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'duration': '600ms', 'delay': '900ms', 'animation': 'slideFadeInUp'},
      'out': {'delay': '200ms', 'duration': '600ms', 'animation': 'slideFadeOutUp'}
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '28vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'duration': '600ms', 'delay': '1100ms', 'animation': 'slideFadeInDown'},
      'out': {'delay': '200ms', 'duration': '600ms', 'animation': 'slideFadeOutDown'}
    }]
  }, {
    'template': 'designed',
    'display': '',
    'hideDelay': 4000,
    'triggerClose': 3000,
    'elements': [{
      'type': 'image',
      'x': '2vw',
      'y': '-48vw',
      'height': '96vw',
      'width': '96vw',
      'in': {'duration': '500ms', 'delay': '300ms', 'animation': 'slide-in-right'},
      'out': {'duration': '500ms', 'delay': '300ms', 'animation': 'slide-out-left'}
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '-60vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'duration': '600ms', 'delay': '500ms', 'animation': 'slideFadeInUp'},
      'out': {'duration': '600ms', 'animation': 'slideFadeOutDown'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '3vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'delay': '500ms', 'duration': '600ms', 'animation': 'slideFadeInDown'},
      'out': {'duration': '600ms', 'animation': 'slideFadeOutUp'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '28vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'duration': '600ms', 'delay': '800ms', 'animation': 'slideFadeInDown'},
      'out': {'duration': '600ms', 'animation': 'slideFadeOutUp'}
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '28vw',
      'height': '25vw',
      'width': '25vw',
      'in': {'delay': '600ms', 'duration': '600ms', 'animation': 'slideFadeInDown'},
      'out': {'duration': '600ms', 'animation': 'slideFadeOutUp'}
    }]
  }]
}
