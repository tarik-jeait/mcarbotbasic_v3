namespace MCarBotBasic {

    export enum Dir {
        Forward = 1,
        Backward = 2
    };
    export enum Led {
        Right = 1,
        Left = 2,
        All = 3
    };
    export enum Motor {
        Right = 1,
        Left = 2,
        All = 3
    };

    //% blockId=mcarbot_init
    //% block="McarBot Init"
    //% group="General"
    export function McarBotInit() {
        i2cWriteCommand(1, 1, 0, 0, 0, 0, 0, 0);
    }
    //% block='McarBot Reset'
    //% group='General'
    export function McarBotReset() {
        // i2cWriteCommand(1, 2, 0, 0, 0, 0, 0, 0);
        pins.digitalWritePin(DigitalPin.P0, 0)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P0, 1)

    }
    //% block='LED:$led R:$red G:$green B:$blue'
    //% inlineInputMode=inline
    //% red.defl=1
    //% red.min=0 red.max=1
    //% green.defl=1
    //% green.min=0 green.max=1
    //% blue.defl=1
    //% blue.min=0 blue.max=1
    //% group='RGB LED'
    export function setLed(led: Led, red: number, green: number, blue: number) {
        i2cWriteCommand(10, led as number, red, green, blue, 0, 0, 0);
        // let i2cReadBuffer = i2cReadCommand();
        // return i2cReadBuffer.getNumber(NumberFormat.UInt8LE, 2);
    }
    let LF_Sensor_Left = 0;
    let LF_Sensor_Right = 0;
    //% block="LF Left"
    //% group='Line Follower'
    export function getLfLeft() {
        return LF_Sensor_Left
    }
    //% block="LF Right"
    //% group='Line Follower'
    export function getLfRight() {
        return LF_Sensor_Right
    }
    //% block="Calibrate LF Sensors"
    //% group='Line Follower'
    export function calibrateLfSensors() {
        i2cWriteCommand(30, 1, 0, 0, 0, 0, 0, 0);
        let i2cReadBuffer2 = i2cReadCommand();
        // i2cReadCommand();
    }
    //% block="Read LF Sensors"
    //% group='Line Follower'
    export function readLfSensors() {
        i2cWriteCommand(30, 2, 0, 0, 0, 0, 0, 0);
        let i2cReadBuffer_sensors = i2cReadCommand();
        LF_Sensor_Left = i2cReadBuffer_sensors.getNumber(NumberFormat.UInt8LE, 0);
        LF_Sensor_Right = i2cReadBuffer_sensors.getNumber(NumberFormat.UInt8LE, 1);
        // return i2cReadBuffer[2];
    }
    //% block='Set Motor:$motor Dir:$dir Speed:$speed'
    //% speed.defl=100
    //% speed.min=0 speed.max=100
    //% group='Moves'
    export function setMotor(motor: Motor, dir: Dir, speed: number): void {
        i2cWriteCommand(20, motor as number, speed, dir as number, 0, 0, 0, 0);
        // let i2cReadBuffer_motors_start = i2cReadCommand();
    }
    //% block = "Stop Motors"
    //% group='Moves'
    export function StopMotors() {
        i2cWriteCommand(20, 4, 0, 0, 0, 0, 0, 0);
        //let i2cReadBuffer_motors_stop = i2cReadCommand();
    }
    //% block='Set Left Wheel Speed:$leftSpeed Right Wheel Speed:$rightSpeed'
    //% leftSpeed.defl=100
    //% leftSpeed.min=-100 leftSpeed.max=100
    //% rightSpeed.defl=100
    //% rightSpeed.min=-100 rightSpeed.max=100    
    //% group='Moves'
    export function setSpeed(leftSpeed: number, rightSpeed: number): void {
        let left_direction = Dir.Forward
        let right_direction = Dir.Forward

        let left_speed = 0
        let right_speed = 0

        if (leftSpeed >= 0) {
            left_direction = Dir.Forward
            left_speed = leftSpeed
        } else {
            left_direction = Dir.Backward
            left_speed = leftSpeed * -1
        }
        if (rightSpeed >= 0) {
            right_direction = Dir.Forward
            right_speed = rightSpeed
        } else {
            right_direction = Dir.Backward
            right_speed = rightSpeed * -1
        }
        i2cWriteCommand(20, 5, left_speed, left_direction as number, right_speed, right_direction as number, 0, 0);
        //let i2cReadBuffer_speed_start = i2cReadCommand();
    }
    // note that Caml casing yields lower case
    // block text with spaces
    export function getRpAddress() {
        let rp_address = 0x13;
        return rp_address;
    }
    function i2cWriteCommand(commandId: number, subCommandId: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number, arg6: number) {
        let writeCommandBuffer = pins.createBuffer(6);
        writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 0, commandId);
        writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 1, subCommandId);
        writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 2, arg1);
        writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 3, arg2);
        writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 4, arg3);
        writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 5, arg4);
        //writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 6, arg5);
        //writeCommandBuffer.setNumber(NumberFormat.UInt8LE, 7, arg6);
        pins.i2cWriteBuffer(getRpAddress(), writeCommandBuffer, false);
    }
    function i2cReadCommand() {
        return pins.i2cReadBuffer(getRpAddress(), 2, false);
    }
}