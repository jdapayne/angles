import AnglesForming from 'Question/AnglesForming';
import LinExpr from 'Utilities/LinExpr';
import {randBetween, randMultBetween, randElem, shuffle} from 'Utilities/Utilities';

export default class AnglesFormingAlgebraic extends AnglesForming{
    constructor(anglesum,expressions) {
        // find the angles by solving
        let expressionsum = expressions.reduce( (exp1,exp2) => exp1.add(exp2) );
        let x = LinExpr.solve(expressionsum,new LinExpr(0,anglesum));

        let angles = [];
        expressions.forEach(function(expr) {
            let angle = expr.eval(x);
            if (angle <= 0) {
                throw "negative angle";
            } else {
                angles.push(expr.eval(x))
            }
        });

        let missing = [];
        missing.length = angles.length;
        missing.fill(false);

        super(anglesum,angles,missing);
        this.expressions = expressions;
        this.solution = x;
        this.subtype = "algebra";
    }

    static random(anglesum,options) {
        // generates random
        const defaults = {
            min_x_coeff: 0,
            max_x_coeff: 4,
            max_const: anglesum/2,
            min_angle: 10,
            min_x: 1,
            max_x: 30,
            multiple_of: 5,
            n : 3
        }

        const settings = Object.assign({},defaults,options);
        const n = settings.n;

        let x = randBetween(settings.min_x,settings.max_x);
        let expressions = [];
        let angles = [];
        let aosl;
        let allconstant = true;

        let left=anglesum;
        for (let i=0; i<n-1;i++) {
            let a = randBetween(settings.min_x_coeff,settings.max_x_coeff);
            left -= a*x;
            let maxb = Math.min(left - settings.min_angle*(n-i-1),settings.max_const);
            let minb = settings.min_angle - a*x;
            let b = randMultBetween(minb,maxb,settings.multiple_of);
            if (a !== 0) {allconstant = false};
            left -= b;
            expressions.push(new LinExpr(a,b));
            angles.push(a*x+b);
        }

        let last_min_x_coeff = allconstant? 1 : settings.min_x_coeff;
        //let a = randBetween(last_min_x_coeff,Math.min(settings.max_x_coeff,Math.floor(left/x)));
        let a = randBetween(last_min_x_coeff,settings.max_x_coeff);
        let b = left-a*x;
        let lastexpression = new LinExpr(a,b);
        expressions.splice(randBetween(0,n-1),0,lastexpression);

        console.log(lastexpression.toString());
        //console.log(`x = ${x}, expressions = ${expressions.map((e) => e.toString())}, angles = ${angles}`);

        return new AnglesFormingAlgebraic(anglesum,expressions); 
    }

    static random2(anglesum,options) {
        const defaults = {
            types: ["add", "mult", "mixed"],
                // add: e.g. x, x+4, x-10
                // mult: e.g. x, 3x, 2x
                // mixed: e.g. x, 2x-10, 3x+40
            ensure_x: true, // makes one of the expressions x 
            constants: true, // have some angles be constants
            max_coeff: 4,
            max_const: anglesum/2,
            min_angle: 10,
            min_x: 4,
            max_x: anglesum/4,
            min_n: 2,
            max_n: 4
        }
        const settings = Object.assign({},defaults,options);

        // Randomise/set up main features
        let n;
        if (settings.n) {
            n = settings.n; 
        } else {
            n = randBetween(settings.min_n, settings.max_n);
        }

        // if there is x and a constant, we need at least three angles, so override
        if (n === 2 && settings.ensure_x && settings.constants) n = 3;

        const type = randElem(settings.types);

        // Generate expressions/angles
        let expressions = [];
        let angles = [];
        let question;

        switch(type) {
            case 'mult': {
                // choose a total of coefficients
                // pick x based on that
                
                let anglesleft = n;
                const total_coeff = settings.constants?
                    randBetween(n,12) :
                    randElem([3,4,5,6,8,9,10,12].filter(x => x >= n));
                let coeffleft = total_coeff;
                let left = anglesum;

                // first 0/1/2
                if (settings.constants) {
                    // reduce to make what's left a multiple of total_coeff
                    anglesleft--;
                    let newleft = randMultBetween(anglesleft*settings.min_angle, anglesum - settings.min_angle,total_coeff);
                    let c = anglesum - newleft;
                    expressions.push(new LinExpr(0,c));
                    left -= newleft;
                }

                let x = left/total_coeff;
                debugger; // check - x should be an integer!

                if (settings.ensure_x) {
                    anglesleft--;
                    expressions.push(new LinExpr(1,0));
                    coeffleft -= 1;
                }

                //middle
                while (anglesleft > 1) {
                    anglesleft --;
                    let mina = 1;
                    let maxa = coeffleft - anglesleft; // leave enough for others TODO: add max_coeff
                    let a = randBetween(mina, maxa);
                    expressions.push(new LinExpr(a,0));
                    coeffleft -= a;
                }

                //last
                expressions.push(new LinExpr(coeffleft,0));
                break;
            }
            case 'add': 
            default: {
                const x = randBetween(settings.min_x, settings.max_x);
                let left = anglesum;
                let anglesleft = n;

                // first do the expressions ensured by ensure_x and constants
                if (settings.ensure_x) {
                    anglesleft--;
                    expressions.push(new LinExpr(1,0));
                    angles.push(x);
                    left -= x;
                }

                if (settings.constants) {
                    anglesleft--;
                    let c = randBetween(
                        settings.min_angle,
                        left - settings.min_angle*anglesleft
                    );
                    expressions.push(new LinExpr(0,c));
                    angles.push(c);
                    left -= c;
                }

                // middle angles
                while (anglesleft > 1) {
                    // add 'x+b' as an expression. Make sure b gives space
                    anglesleft--;
                    left -= x;
                    let maxb = Math.min(
                        left - settings.min_angle*anglesleft,
                        settings.max_const
                    );
                    let minb = Math.max(
                        settings.min_angle - x,
                        -settings.max_const
                    );
                    let b = randBetween(minb,maxb);
                    expressions.push(new LinExpr(1,b));
                    angles.push(x+b);
                    left -= b;
                }

                // last angle
                expressions.push(new LinExpr(1,left-x));
                angles.push(left);
                break;
            }
        }

        expressions = shuffle(expressions);

        return new AnglesFormingAlgebraic(anglesum,expressions);
    }
        

}
