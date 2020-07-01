# pi-home-core

![Node.js CI](https://github.com/raspberry-pi-home/pi-home-core/workflows/Node.js%20CI/badge.svg)

## Usage

```
npm install --save https://github.com/raspberry-pi-home/pi-home-core.git
```

```
import { Board } from 'pi-home-core'

const board = new Board({...})

board.run()
```

```
{
  pinSettings: {
    2: {
      pin: 2
    },
    3: {
      pin: 3
    },
    4: {
      pin: 4
    },
    5: {
      pin: 5
    },
    6: {
      pin: 6
    },
    7: {
      pin: 7
    },
    8: {
      pin: 8
    },
    9: {
      pin: 9
    },
    10: {
      pin: 10
    },
    11: {
      pin: 11
    },
    12: {
      pin: 12
    },
    13: {
      pin: 13
    },
    14: {
      pin: 14
    },
    15: {
      pin: 15
    },
    16: {
      pin: 16
    },
    17: {
      "label": "Led 17",
      pin: 17,
      type: "led"
    },
    18: {
      label: "Led 18",
      pin: 18,
      type: "led"
    },
    19: {
      pin: 19
    },
    20: {
      pin: 20
    },
    21: {
      pin: 21
    },
    22: {
      label: "Button 22",
      pin: 22,
      type: "onOffButton"
    },
    23: {
      pin: 23
    },
    24: {
      pin: 24
    },
    25: {
      pin: 25
    },
    26: {
      pin: 26
    },
    27: {
      label: "Push Button 27",
      pin: 27,
      type: "pushButton"
    }
  },
  pinDependencies: [
    {
      inputPin: 22,
      outputPin: 17
    },
    {
      inputPin: 27,
      outputPin: 18
    }
  ]
}
```

## Documentation

### Board(config)
Creates a new Board component which will handle all the interactions between the inputs and outputs
