import AnglesFormingAlgebraic from 'Question/AnglesFormingAlgebraic';
import LinExpr from 'Utilities/LinExpr';
import {randBetween, randMultBetween, randElem} from 'Utilities/Utilities';

export default class AnglesFormingWorded extends AnglesFormingAlgebraic{
    // No idea if this is the best approach...
    constructor(anglesum,expressions) {
        super(anglesum,expressions);
        this.subtype="worded";
    }

    static random(anglesum, options) {
        function comparator(number,operator) {
            switch (operator) {
                case "*":
                    switch (number) {
                        case 1:  return "the same as";
                        case 2:  return "double";
                        default: return number + " times larger than";
                    }
                case "+":
                    switch (number) {
                        case 0:  return "the same as";
                        default: return Math.abs(number).toString() + "° " + ((number<0)?"less than":"more than");
                    }
            }
        }

        const defaults = {
            min_n: 2,
            max_n: 2,
            min_angle: 10,
            min_addend: -90,
            max_addend: 90,
            min_multiplier: 1,
            max_multiplier: 5,
            types: ["add", "multiply", "percent", "ratio"]
        }

        const settings = Object.assign({},defaults,options);
        const n = settings.n?
            settings.n :
            randBetween(settings.min_n, settings.max_n);
        
        let expressions = [new LinExpr(1,0)];
        let instructions = [];

        // Loop til we get one that works
        // Probably really inefficient!!

        let success = false;
        let attemptcount = 0;
        while (!success) {
            if (attemptcount > 20) {
                expressions.push(new LinExpr(1,0));
                console.log("Gave up after " + attemptcount + " attempts");
                success = true;
            }
            for (let i=1; i<n; i++) {
                const type = randElem(settings.types);
                switch(type) {
                    case "add": {
                        const addend = randBetween(settings.min_addend,settings.max_addend);
                        expressions.push(expressions[i-1].add(addend));
                        instructions.push(`Angle ${String.fromCharCode(65+i)} is ${comparator(addend,"+")} angle ${String.fromCharCode(64+i)}`);
                        break;
                    }
                    case "multiply": {
                        const multiplier = randBetween(settings.min_multiplier,settings.max_multiplier);
                        expressions.push(expressions[i-1].times(multiplier));
                        instructions.push(`Angle ${String.fromCharCode(65+i)} is ${comparator(multiplier,"*")} angle ${String.fromCharCode(64+i)}`);
                        break;
                    }
                    case "percent": {
                        const percentage = randMultBetween(5,100,5);
                        const increase = Math.random()<0.5 ? true : false;
                        const multiplier = increase ? 1 + percentage/100 : 1 - percentage/100;
                        expressions.push(expressions[i-1].times(multiplier));
                        instructions.push(
                            `Angle ${String.fromCharCode(65+i)} is ${percentage}% ${increase? "bigger" : "smaller"} than angle ${String.fromCharCode(64+i)}`
                        );
                        break;
                    }
                    case "ratio": {
                    	const a = randBetween(1,10);
                        const b = randBetween(1,10);
                        const multiplier = b/a;
                        expressions.push(expressions[i-1].times(multiplier));
                        instructions.push(
                            `The ratio of angle ${String.fromCharCode(64+i)} to angle ${String.fromCharCode(65+i)} is ${a}:${b}`
                        );
                    }
                }
            }
            // check it makes sense
            success = true;
            let expressionsum = expressions.reduce( (exp1,exp2) => exp1.add(exp2) );
            let x = LinExpr.solve(expressionsum,new LinExpr(0,anglesum));

            expressions.forEach(function(expr) {
                if (!success || expr.eval(x) < settings.min_angle) {
                    success = false;
                    instructions = [];
                    expressions = [expressions[0]];
                }
            });

            attemptcount++;
        }
        console.log("Attempts: " + attemptcount);

        let question = new AnglesFormingWorded(anglesum,expressions);
        question.instructions = instructions;
        return question;
    }
}
