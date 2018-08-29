import {randBetween} from 'Utilities/Utilities';
import AnglesForming from 'Question/AnglesForming'

export default class Triangle extends AnglesForming {
    constructor(angles, missing) {
        super(180, angles, missing)

        this.type = "triangle";
        this.subtype = "simple";
    }

    static random(options) {
        let triangle = super.random(180,{
            n:3,
            minangle: options.minangle? options.minangle : 20
        });
        triangle.type = "triangle";
        return triangle;
    }

    static randomrep(options) {
        let triangle = super.randomrep(180, {
            n:3,
            nmissing: 2,
            minangle: options.minangle? options.minangle : 20
        });
        triangle.missing = [false,false,false];
        triangle.missing[randBetween(0,2)] = true;
        triangle.type = "triangle";
        return triangle;
    }
}
