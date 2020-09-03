import { Board } from './board'
import type { DeviceType } from './board'

const ledDevice = {
  pin: 2,
  type: 'led' as DeviceType,
  label: 'Led 2',
}

const buttonDevice = {
  pin: 20,
  type: 'onOffButton' as DeviceType,
  label: 'Button 20',
}

test('basic instantiation', () => {
  expect(() => new Board()).not.toThrow()
})

test('addDevice', () => {
  const board = new Board()

  expect(() => board.addDevice(ledDevice)).not.toThrow()
  expect(() => board.addDevice(ledDevice)).toThrow('duplicated pin')
  expect(() => board.addDevice({ ...ledDevice, pin: 58 })).toThrow('invalid pin')
  expect(() => board.addDevice({ ...ledDevice, pin: 3 })).toThrow('duplicated label')
  expect(() => board.addDevice({ ...ledDevice, pin: 4, type: 'foo' as DeviceType })).toThrow('duplicated label')
})

test('getDevice', () => {
  const board = new Board()

  expect(board.addDevice(ledDevice)).toEqual(board.getDevice(2))
  expect(() => board.getDevice(3)).toThrow('device not found')
})

test('editDevice', () => {
  const board = new Board()

  board.addDevice(ledDevice)
  expect(board.editDevice(2, { label: 'Led 22' })).toEqual(board.getDevice(2))
  expect(() => board.editDevice(3, { label: 'foo' })).toThrow('device not found')
})

test('deleteDevice', () => {
  const board = new Board()

  board.addDevice(ledDevice)
  expect(() => board.deleteDevice(2)).not.toThrow()
  expect(() => board.getDevice(2)).toThrow('device not found')
})

test('changeDeviceStatus', () => {
  const board = new Board()

  board.addDevice(ledDevice)
  expect(board.changeDeviceStatus(2)).toEqual(1)
  expect(() => board.changeDeviceStatus(3)).toThrow('device not found')

  board.addDevice(buttonDevice)
  expect(() => board.changeDeviceStatus(20)).toThrow('cannot change the status in this type of device')
})

test('linkDevices', () => {
  const board = new Board()

  expect(() => board.linkDevices({ inputPin: 20, outputPin: 2 })).toThrow('input device not found')

  board.addDevice(buttonDevice)

  expect(() => board.linkDevices({ inputPin: 20, outputPin: 2 })).toThrow('output device not found')

  board.addDevice(ledDevice)

  expect(() => board.linkDevices({ inputPin: 2, outputPin: 2 })).toThrow('invalid input device type')

  expect(() => board.linkDevices({ inputPin: 20, outputPin: 20 })).toThrow('invalid output device type')

  expect(() => board.linkDevices({ inputPin: 20, outputPin: 2 })).not.toThrow()
  // safe check
  expect(() => board.linkDevices({ inputPin: 20, outputPin: 2 })).toThrow('the input pin is already linked to the output pin')

  expect(board.getDevice(2)).toEqual({ ...ledDevice, status: 0, dependencies: [{ pin: 20, type: 'onOffButton', label: 'Button 20' }] })
  expect(board.getDevice(20)).toEqual({ ...buttonDevice, dependencies: [{ pin: 2, type: 'led', label: 'Led 2' }] })
})

test('unlinkDevices', () => {
  const board = new Board()

  board.addDevice(buttonDevice)
  board.addDevice(ledDevice)
  board.linkDevices({ inputPin: 20, outputPin: 2 })

  expect(board.getDevice(2)).toEqual({ ...ledDevice, status: 0, dependencies: [{ pin: 20, type: 'onOffButton', label: 'Button 20' }] })
  expect(board.getDevice(20)).toEqual({ ...buttonDevice, dependencies: [{ pin: 2, type: 'led', label: 'Led 2' }] })

  expect(() => board.unlinkDevices({ inputPin: 22, outputPin: 2 })).toThrow('input device not found')
  expect(() => board.unlinkDevices({ inputPin: 2, outputPin: 2 })).toThrow('invalid input device type')

  expect(() => board.unlinkDevices({ inputPin: 20, outputPin: 22 })).toThrow('output device not found')
  expect(() => board.unlinkDevices({ inputPin: 20, outputPin: 20 })).toThrow('invalid output device type')

  expect(() => board.unlinkDevices({ inputPin: 20, outputPin: 2 })).not.toThrow()
  // safe check
  expect(() => board.unlinkDevices({ inputPin: 20, outputPin: 2 })).not.toThrow()

  expect(board.getDevice(2)).toEqual({ ...ledDevice, status: 0, dependencies: [] })
  expect(board.getDevice(20)).toEqual({ ...buttonDevice, dependencies: [] })
})

test('getAvailableDevices', () => {
  const board = new Board()

  board.addDevice(buttonDevice)
  board.addDevice(ledDevice)
  expect(board.getAvailableDevices()).toEqual({
    led: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27],
    onOffButton: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27],
    pushButton: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27],
  })
})

test('deviceAdded', (done) => {
  const board = new Board()

  board.on('deviceAdded', ({ device }) => {
    expect(device).toEqual({ ...ledDevice, status: 0, dependencies: [] })
    done()
  })

  board.addDevice(ledDevice)
})

test('deviceEdited', (done) => {
  const board = new Board()

  board.on('deviceEdited', ({ device }) => {
    expect(device).toEqual({ ...ledDevice, label: 'Led 22', status: 0, dependencies: [] })
    done()
  })

  board.addDevice(ledDevice)
  board.editDevice(2, { label: 'Led 22' })
})

test('deviceDeleted', (done) => {
  const board = new Board()

  board.on('deviceDeleted', ({ device }) => {
    expect(device).toEqual({ ...ledDevice, status: 0, dependencies: [] })
    done()
  })

  board.addDevice(ledDevice)
  board.deleteDevice(2)
})

test('deviceStatusChanged', (done) => {
  const board = new Board()

  board.on('deviceStatusChanged', ({ device }) => {
    expect(device).toEqual({ ...ledDevice, status: 1, dependencies: [] })
    done()
  })

  board.addDevice(ledDevice)
  board.changeDeviceStatus(2)
})

test('devicesLinked', (done) => {
  const board = new Board()

  board.on('devicesLinked', ({ inputDevice, outputDevice }) => {
    expect(inputDevice.pin).toEqual(20)
    expect(outputDevice.pin).toEqual(2)
    done()
  })

  board.addDevice(ledDevice)
  board.addDevice(buttonDevice)
  board.linkDevices({ inputPin: 20, outputPin: 2 })
})

test('devicesUnlinked', (done) => {
  const board = new Board()

  board.on('devicesUnlinked', ({ inputDevice, outputDevice }) => {
    expect(inputDevice.pin).toEqual(20)
    expect(outputDevice.pin).toEqual(2)
    done()
  })

  board.addDevice(ledDevice)
  board.addDevice(buttonDevice)
  board.linkDevices({ inputPin: 20, outputPin: 2 })
  board.unlinkDevices({ inputPin: 20, outputPin: 2 })
})

test('all the things', () => {
  const board = new Board()

  // add and get
  let device = board.addDevice({
    pin: 2,
    type: 'led',
    label: 'Led 2',
  })
  expect(device).toEqual(board.getDevice(2))

  device = board.addDevice({
    pin: 3,
    type: 'led',
    label: 'Led 3',
  })
  expect(device).toEqual(board.getDevice(3))

  device = board.addDevice({
    pin: 4,
    type: 'led',
    label: 'Led 4',
  })
  expect(device).toEqual(board.getDevice(4))

  device = board.addDevice({
    pin: 20,
    type: 'onOffButton',
    label: 'Button 20',
  })
  expect(device).toEqual(board.getDevice(20))

  device = board.addDevice({
    pin: 21,
    type: 'pushButton',
    label: 'Button 21',
  })
  expect(device).toEqual(board.getDevice(21))

  device = board.addDevice({
    pin: 23,
    type: 'pushButton',
    label: 'Button 23',
  })
  expect(device).toEqual(board.getDevice(23))

  // link
  board.linkDevices({
    inputPin: 20,
    outputPin: 2,
  })

  board.linkDevices({
    inputPin: 20,
    outputPin: 3,
  })

  board.linkDevices({
    inputPin: 21,
    outputPin: 4,
  })

  // edit
  device = board.editDevice(2, { label: 'Led 22' })
  expect(device).toEqual(board.getDevice(2))

  // change status
  expect(board.changeDeviceStatus(2)).toEqual(1)

  // delete
  expect(() => board.deleteDevice(23)).not.toThrow()

  // get all
  expect(board.getDevices()).toEqual([
    {
      pin: 2,
      type: 'led',
      label: 'Led 22',
      status: 1,
      dependencies: [{ pin: 20, type: 'onOffButton', label: 'Button 20' }],
    },
    {
      pin: 3,
      type: 'led',
      label: 'Led 3',
      status: 0,
      dependencies: [{ pin: 20, type: 'onOffButton', label: 'Button 20' }],
    },
    {
      pin: 4,
      type: 'led',
      label: 'Led 4',
      status: 0,
      dependencies: [{ pin: 21, type: 'pushButton', label: 'Button 21' }],
    },
    {
      pin: 20,
      type: 'onOffButton',
      label: 'Button 20',
      dependencies: [{ pin: 2, type: 'led', label: 'Led 2' }, { pin: 3, type: 'led', label: 'Led 3' }],
    },
    {
      pin: 21,
      type: 'pushButton',
      label: 'Button 21',
      dependencies: [{ pin: 4, type: 'led', label: 'Led 4' }],
    },
  ])
})
