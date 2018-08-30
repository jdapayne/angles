import AnglesFormingAlgebraic from 'Question/AnglesFormingAlgebraic.js'
import {sortTogether} from 'Utilities/Utilities';

export default class TriangleAlgebraic extends AnglesFormingAlgebraic {
    constructor(expressions) {
        super(180, expressions)

        this.type = "triangle";
        this.subtype = "algebraic";
    }

    static random(options) {
        options.n = 3;
        if (!options.min_angle) options.min_angle = 25;
        let triangle = super.random(180,options);
        triangle.type = "triangle";

        sortTogether(triangle.angles,triangle.expressions, (x,y) => x - y);

        return triangle;
    }
}

