# Device

```ts
/**
 * Return the list of devices available on the system.
 */
export function getDevices(): Device[]
export function getKeyboardDevices(): KeyboardDevice[]
export function getMouseDevices(): MouseDevice[]
export function getTouchDevices(): TouchDevice[]
export function getGamepadDevices(): GamepadDevice[]
export function getHIDDevices(): HIDDevice[]
export function getJoystickDevices(): JoystickDevice[]
export function getAccelerometerDevices(): AccelerometerDevice[]
export function getGyroscopeDevices(): GyroscopeDevice[]
export function getMagnetometerDevices(): MagnetometerDevice[]
export function getOrientationSensorDevices(): OrientationSensorDevice[]
export function getProximitySensorDevices(): ProximitySensorDevice[]
export function getAmbientLightSensorDevices(): AmbientLightSensorDevice[]
export function getThermometerDevices(): ThermometerDevice[]
export function getBatteryDevices(): BatteryDevice[]
export function getSpeakerDevices(): SpeakerDevice[]
export function getMicrophoneDevices(): MicrophoneDevice[]
export function getCameraDevices(): CameraDevice[]
export function getDisplayDevices(): DisplayDevice[]
export function getPrinterDevices(): PrinterDevice[]
```

```ts
// Handle keyboard events
const keyboard = getKeyboardDevices()[0];
keyboard.on("keydown", (event) => {
  console.log(event);
});
```