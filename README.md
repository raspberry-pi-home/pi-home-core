# pi-home-core

![Node.js CI](https://github.com/raspberry-pi-home/pi-home-core/workflows/Node.js%20CI/badge.svg)

## Usage

```
npm install --save https://github.com/raspberry-pi-home/pi-home-core.git
```

```
import { Board } from 'pi-home-core'

const board = new Board()

board.addDevice({
  pin: 2,
  type: 'led',
  label: 'Led 2',
})

board.changeDeviceStatus(2)
```

## Documentation

### Board()
Creates a new Board component which will handle all the interactions between the inputs and outputs

#### getAvailableDevices(): list
Returns a list of available pins per device type

#### getDevices(): devices
Returns all the configured devices

#### getDevice(pin): device
Returns a device

#### addDevice(device): device
Adds a new device

#### editDevice(pin, options): device
Edits a new device
Only available option: label

#### deleteDevice(pin)
Deletes a device

#### changeDeviceStatus(pin): 0 | 1
Toggle the status of the device

#### linkDevices(dependency): void
Links two devices

#### unlinkDevices(dependency): void
Unlinks two devices

#### isAccessible
Returns if board is running on a raspberry-pi or not

---

### Concepts

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
