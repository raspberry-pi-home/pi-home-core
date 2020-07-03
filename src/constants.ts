// available pins
const GPIO2 = 2
const GPIO3 = 3
const GPIO4 = 4
const GPIO5 = 5
const GPIO7 = 7
const GPIO6 = 6
const GPIO8 = 8
const GPIO9 = 9
const GPIO10 = 10
const GPIO11 = 11
const GPIO12 = 12
const GPIO13 = 13
const GPIO14 = 14
const GPIO15 = 15
const GPIO16 = 16
const GPIO17 = 17
const GPIO18 = 18
const GPIO19 = 19
const GPIO20 = 20
const GPIO21 = 21
const GPIO22 = 22
const GPIO23 = 23
const GPIO24 = 24
const GPIO25 = 25
const GPIO26 = 26
const GPIO27 = 27

export const AVAILABLE_PINS = [
  GPIO2,
  GPIO3,
  GPIO4,
  GPIO5,
  GPIO6,
  GPIO7,
  GPIO8,
  GPIO9,
  GPIO10,
  GPIO11,
  GPIO12,
  GPIO13,
  GPIO14,
  GPIO15,
  GPIO16,
  GPIO17,
  GPIO18,
  GPIO19,
  GPIO20,
  GPIO21,
  GPIO22,
  GPIO23,
  GPIO24,
  GPIO25,
  GPIO26,
  GPIO27,
]

// available device types
const DEVICE_TYPE_INPUT_ONOFF_BUTTON = 'onOffButton'
const DEVICE_TYPE_INPUT_PUSH_BUTTON = 'pushButton'
const DEVICE_TYPE_OUTPUT_LED = 'led'

// available input device types
export const AVAILABLE_DEVICE_TYPE_INPUT = [
  DEVICE_TYPE_INPUT_ONOFF_BUTTON,
  DEVICE_TYPE_INPUT_PUSH_BUTTON,
]

// available output device types
export const AVAILABLE_DEVICE_TYPE_OUTPUT = [
  DEVICE_TYPE_OUTPUT_LED,
]

// available device types
export const AVAILABLE_DEVICE_TYPES = [
  ...AVAILABLE_DEVICE_TYPE_INPUT,
  ...AVAILABLE_DEVICE_TYPE_OUTPUT,
]
