# pi-home-core

![Node.js CI](https://github.com/raspberry-pi-home/pi-home-core/workflows/Node.js%20CI/badge.svg)

## Usage

```
npm install --save https://github.com/raspberry-pi-home/pi-home-core.git
```

```
import { Board } from 'pi-home-core'

const board = new Board()

const [valid, error] = board.validateConfig(config)
if (!valid) {
  // config invalid
  console.log(error)
}

board.setConfig(config)

board.changeStatus(17)
```

## Documentation

### Board()
Creates a new Board component which will handle all the interactions between the inputs and outputs

#### validateConfig(config)
Validates the config is valid
Returns an array [valid, error] as [true/false, undefined/string]

#### setConfig(config)
Sets the configuration for the board
Throws an error if the config is invalid

#### devices()
Returns all the available devices
For the configured ones, it returns its properties

#### dependencies()
Returns all the configured dependencies

#### device(pin)
Returns a device
If is configured, it returns its properties

#### changeStatus(pin)
Toggle the status of the device tied to the pin

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
  pin: <pin_number>,
  type: <device_type>,
  label: <label>
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
