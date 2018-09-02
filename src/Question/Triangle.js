import {randBetween, sortTogether, firstUniqueIndex} from 'Utilities/Utilities';
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
            min_angle: options.min_angle? options.min_angle : 25
        });
        triangle.type = "triangle";

        // Sort arrays and missing together
        sortTogether(triangle.angles,triangle.missing, (x,y) => x - y);

        return triangle;
    }

    static randomrep(options) { //isosceles
        if (!options) options = {};
        options.n = 3;
        options.nmissing = 2;
        if (options.minangle === undefined) options.minangle = 20;
        if (options.iso_given === undefined) options.iso_given = Math.random()<0.5? 'base' : 'apex';

        let triangle = super.randomrep(180, options);
        triangle.type = "triangle";

        sortTogether(triangle.angles,triangle.missing, (x,y) => x - y);

        triangle.apex = firstUniqueIndex(triangle.angles);

        triangle.missing = [true, true, true]
        if (options.iso_given === 'apex') {
            triangle.missing[triangle.apex] = false;
        } else {
            triangle.missing[(triangle.apex + 1)%3] = false;
        }

        return triangle;
    }
}
