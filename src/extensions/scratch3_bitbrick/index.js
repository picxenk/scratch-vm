const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';


class ScratchLinkMock {
    constructor () {

    }

    getSensorValues() {

    }

    sendCommand(cmd) {
        console.log(cmd);
    }
}
// TODO : best way to connect ScratchLink??
ScratchLink = new ScratchLinkMock();

class BitBrick {

    get MotorPorts () {
        return ['A', 'B', 'C', 'D'];
    }

    get SensorPorts () {
        return ['1', '2', '3', '4'];
    }

    constructor (runtime) {
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));

        this.sensors = [0, 0, 0, 0];
        this.cmd = {
            'buzzer' : '00',
            'A' : '00',
            'B' : '00',
            'C' : '00',
            'D' : '00',
            'red' : '00',
            'green' : '00',
            'blue' : '00'
        };
    }

    stopAll () {
        this.cmd['buzzer'] = '00';
        this.cmd['A'] = '00';
        this.cmd['B'] = '00';
        this.cmd['C'] = '00';
        this.cmd['D'] = '00';
        this.cmd['red'] = '00';
        this.cmd['green'] = '00';
        this.cmd['blue'] = '00';
        this.makeCommand();
    }

    makeCommand() {
        let command = "FFFF"
            + "00" + this.cmd['buzzer']
            + "00" + this.cmd['A']
            + "00" + this.cmd['B']
            + "00" + this.cmd['C']
            + "00" + this.cmd['D']
            + "00" + this.cmd['red']
            + "00" + this.cmd['green']
            + "00" + this.cmd['blue']
            + "FEFE";
        ScratchLink.sendCommand(command);
    }

    turnOffLED() {
        this.cmd['red'] = "00";
        this.cmd['green'] = "00";
        this.cmd['blue'] = "00";
        this.makeCommand();
    }

    setLEDColor(r, g, b) {
        // FFFF 0000 | 0000 0000 0000 0000 | 0000 0000 0000 FEFE
        this.cmd['red'] = (Math.max(Math.min(255, r), 0)).toString(16).padStart(2, '0');
        this.cmd['green'] = Math.max(Math.min(255, g), 0).toString(16).padStart(2, '0');
        this.cmd['blue'] = Math.max(Math.min(255, b), 0).toString(16).padStart(2, '0');
        this.makeCommand();

        // let command = "FFFF00000000000000000000"+"00"+red+"00"+green+"00"+blue+"FEFE";
        // ScratchLink.sendCommand(command);
    }

    turnOffMotor() {
        this.cmd['A'] = "00";
        this.cmd['B'] = "00";
        this.cmd['C'] = "00";
        this.cmd['D'] = "00";
        this.makeCommand();
    }

    setMotorPower(port, power) {
        let nPower = (Math.round(power) + 128).toString(16).padStart(2, '0');
        this.cmd[this.MotorPorts[port]] = nPower;
        this.makeCommand();
    }

    setServoDegree(port, degree) {
        let nDegree = (Math.round(degree)).toString(16).padStart(2, '0');
        this.cmd[this.MotorPorts[port]] = nDegree;
        this.makeCommand();
    }

    parseHex(string) {
        // remove all non-hex characters, and then separate them into an array in groups of 2 characters
        var arr = string.replace(/[^0-9a-fA-F]/g, '').match(/[0-9a-fA-F]{2}/g);

        // mutate the array in-place with the correct decimal values
        for(var i = 0; i<arr.length; i++) {
          arr[i] = parseInt(arr[i], 16);
        }

        return arr;
    }
    hex2bin(hex){
        return (parseInt(hex, 16).toString(2)).padStart(16, '0');
    }

    getSensorValues() {
        let valueString = ScratchLink.getSensorValues();
        let port1 = valueString.substr(4, 4);
        this.sensors[0] = parseInt(this.hex2bin(port1).substr(6, 10), 2);
        let port2 = valueString.substr(8, 4);
        this.sensors[1] = parseInt(this.hex2bin(port2).substr(6, 10), 2);
        let port3 = valueString.substr(12, 4);
        this.sensors[2] = parseInt(this.hex2bin(port3).substr(6, 10), 2);
        let port4 = valueString.substr(16, 4);
        this.sensors[3] = parseInt(this.hex2bin(port4).substr(6, 10), 2);

    }

    getSensorValue(port) {
        this.getSensorValues();
        // let randomValue = Math.floor(Math.random()*100);
        // let diff = Math.floor(Math.random()*10);
        // let values = [randomValue, randomValue+diff, randomValue-diff, randomValue];
        return this.sensors[port];
    }

}

/**
 * Class for the makey makey blocks in Scratch 3.0
 * @constructor
 */
class Scratch3bitBrickBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.bitBrick = new BitBrick(this.runtime);
      }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'bitbrick',
            name: 'bitBrick',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'getSensorValue',
                    text: formatMessage({
                        id: 'bitbrick.getSensorValue',
                        default: 'sensor [PORT]',
                        description: 'get value from port'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                      PORT: {
                          type: ArgumentType.STRING,
                          menu: 'sensorPorts',
                          defaultValue: 0
                      }
                    }
                },
                {
                    opcode: 'turnOffLED',
                    text: formatMessage({
                        id: 'bitbrick.turnOffLED',
                        default: 'turn off LED',
                        description: 'turn off LED'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'setLEDColor',
                    text: formatMessage({
                        id: 'bitbrick.setLEDColor',
                        default: 'LED R [RED] G [GREEN] B [BLUE]',
                        description: 'set LED color'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                      RED: {
                          type: ArgumentType.NUMBER,
                          defaultValue: 255
                      },
                      GREEN: {
                          type: ArgumentType.NUMBER,
                          defaultValue: 255
                      },
                      BLUE: {
                          type: ArgumentType.NUMBER,
                          defaultValue: 255
                      }
                    }
                },
                {
                    opcode: 'turnOffMotor',
                    text: formatMessage({
                        id: 'bitbrick.turnOffMotor',
                        default: 'turn off Motor',
                        description: 'turn off Motor'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'motorSetPower',
                    text: formatMessage({
                        id: 'bitbrick.motorSetPower',
                        default: 'motor [PORT] set power [POWER] %',
                        description: 'set a motor\'s power to some value'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'motorPorts',
                            defaultValue: 0
                        },
                        POWER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'servoSetDegree',
                    text: formatMessage({
                        id: 'bitbrick.servoSetDegree',
                        default: 'servo [PORT] set degree [DEGREE]',
                        description: 'set a servo\'s degree to some value'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'motorPorts',
                            defaultValue: 0
                        },
                        DEGREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                motorPorts: this._formatMenu(this.bitBrick.MotorPorts),
                sensorPorts: this._formatMenu(this.bitBrick.SensorPorts)
            }
        };
    }

    _formatMenu (menu) {
        const m = [];
        for (let i = 0; i < menu.length; i++) {
            const obj = {};
            obj.text = menu[i];
            obj.value = i.toString();
            m.push(obj);
        }
        return m;
    }

    getSensorValue (args) {
        const port = Cast.toNumber(args.PORT);
        if (![0, 1, 2, 3].includes(port)) {
            return;
        }
        return this.bitBrick.getSensorValue(port);
    }

    turnOffLED () {
        this.bitBrick.turnOffLED();
    }

    turnOffMotor () {
        this.bitBrick.turnOffMotor();
    }

    setLEDColor (args) {
        const red = Cast.toNumber(args.RED);
        const green = Cast.toNumber(args.GREEN);
        const blue = Cast.toNumber(args.BLUE);

        this.bitBrick.setLEDColor(red, green, blue);
    }

    motorSetPower (args) {
        const port = Cast.toNumber(args.PORT);
        const power = MathUtil.clamp(Cast.toNumber(args.POWER), -100, 100);
        //
        // this._forEachMotor(port, motorIndex => {
        //     const motor = this._peripheral.motor(motorIndex);
        //     if (motor) {
        //         motor.power = power;
        //     }
        // });
        this.bitBrick.setMotorPower(port, power);
    }

    servoSetDegree (args) {
        const port = Cast.toNumber(args.PORT);
        const degree = MathUtil.clamp(Cast.toNumber(args.DEGREE), 0, 180);
        this.bitBrick.setServoDegree(port, degree);
    }


}
module.exports = Scratch3bitBrickBlocks;
