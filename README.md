# pi-home-core

![Node.js CI](https://github.com/raspberry-pi-home/pi-home-core/workflows/Node.js%20CI/badge.svg)

## Usage

```
npm install --save https://github.com/raspberry-pi-home/pi-home-core.git
```

```
import { Board } from 'pi-home-core'

try {
  const board = new Board(config)
  board.run()
} catch(e) {
  // configuration invalid or error bootstrapping the app
  console.log(e)
}
```

```
import { validateDevice } from 'pi-home-core'

try {
  validateDevice(device, devices)
} catch(e) {
  // device invalid
  console.log(e)
}
```

## Documentation

### Board(config)
Creates a new Board component which will handle all the interactions between the inputs and outputs

#### run()
Runs the board

### validateDevice(device, devices)
Validates if the device is valid related to the other devices

---

### Concepts

#### - config
```
{
  devices: [
    ...device
  ],
  dependencies: [
    ...dependency
  ]
}
```

#### - device
```
{
  label: <label>,
  pin: <pin_number>,
  type: <device_type>
}
```

##### pin numbers
* *2*
* *3*
* *4*
* *5*
* *7*
* *6*
* *8*
* *9*
* *10*
* *11*
* *12*
* *13*
* *14*
* *15*
* *16*
* *17*
* *18*
* *19*
* *20*
* *21*
* *22*
* *23*
* *24*
* *25*
* *26*
* *27*

##### device types
* *led*
* *onOffButton*
* *pushButton*

#### - devices
array of *device*

#### - dependency
```
{
  inputPin: <pin_number>,
  outputPin: <pin_number>
}
```

#### - dependencies
array of *dependency*
