module.exports = {
  'id': 'travel',
  'name': '旅行',
  'coordinate': 'center',
  'desc': '一次色彩纷呈之旅',
  'cover': '000/travel.jpg',
  'scenes': [0, 1],
  'templates': [{
    'index': 0,
    'template': 'designed',
    'display': '',
    'hideDelay': 1000,
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
      'y': '25vw',
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
      'in': {'duration': '400ms', 'delay': '800ms', 'animation': 'flip-in-hor-top'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-top'}
    }]
  }, {
    'index': 1,
    'template': 'designed',
    'display': '',
    'hideDelay': 1000,
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
      'y': '-60vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '500ms', 'delay': '700ms', 'animation': 'flip-in-hor-top'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-top'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '-70vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '500ms', 'delay': '900ms', 'animation': 'flip-in-hor-top'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-top'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '-45vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '500ms', 'delay': '700ms', 'animation': 'flip-in-hor-top'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-top'}
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '25vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '500ms', 'delay': '700ms', 'animation': 'flip-in-hor-bottom'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-bottom'}
    }]
  }, {
    'template': 'designed',
    'display': '',
    'hideDelay': 1000,
    'triggerClose': 3000,
    'elements': [{
      'type': 'image',
      'x': '2vw',
      'y': '-48vw',
      'height': '96vw',
      'width': '96vw',
      'in': {'duration': '400ms', 'delay': '300ms', 'animation': 'slide-in-right'},
      'out': {'duration': '400ms', 'delay': '300ms', 'animation': 'slide-out-left'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '-60vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '400ms', 'delay': '700ms', 'animation': 'flip-in-hor-top'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-top'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '3vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'delay': '400ms', 'duration': '600ms', 'animation': 'flip-in-hor-bottom'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-bottom'}
    }, {
      'type': 'image',
      'x': '50vw',
      'y': '28vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'duration': '400ms', 'delay': '800ms', 'animation': 'flip-in-hor-bottom'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-bottom'}
    }, {
      'type': 'image',
      'x': '25vw',
      'y': '28vw',
      'height': '25vw',
      'width': '25vw',
      'style': 'border: 1px solid #fff',
      'in': {'delay': '400ms', 'duration': '600ms', 'animation': 'flip-in-hor-bottom'},
      'out': {'duration': '400ms', 'animation': 'flip-out-hor-bottom'}
    }]
  }]
}
