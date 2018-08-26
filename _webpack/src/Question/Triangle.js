import {randBetween} from 'Utilities/Utilities';
import AnglesForming from 'Question/AnglesForming'

export default class Triangle extends AnglesForming {
    constructor(angles, missing) {
        super(180, angles, missing)

        this.type = "triangle";
        this.subtype = "simple";
    }

    static random() {
        let triangle = super.random(180,3);
        triangle.type = "triangle";
        return triangle;
    }

    static randomrep() {
        let triangle = super.randomrep(180,3,2);
        triangle.missing = [false,false,false];
        triangle.missing[randBetween(0,2)] = true;
        triangle.type = "triangle";
        return triangle;
    }
}
