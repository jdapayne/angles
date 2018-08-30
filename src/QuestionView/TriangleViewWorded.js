import TriangleView from 'QuestionView/TriangleView';
import Point from 'Utilities/Point';
import {roundDP} from 'Utilities/Utilities';

export default class TriangleViewAlgebraic extends TriangleView {
    constructor(question, width, height,rotation) {
        super(question, width, height,rotation);

        super.translate(0,-10);

        this.labels.forEach(function(l,i) {
            l.text = String.fromCharCode(65+i);
        });

        let ninstructions = this.question.instructions.length;
        this.question.instructions.forEach( (instruction, i) => {
            this.labels.push(
                {
                    text: instruction,
                    pos: new Point(10, height - 10 - 15*(ninstructions-i-1)), //this is not idea - assumes fixed font height
                    style: "extra-info",
                    hidden: false
                }
            )
        });
    }

    showAnswer() {
        if (this.answered) return; //nothing to do
        for (let i=0; i<this.question.angles.length; i++) {
            this.labels[i].text = roundDP(this.question.angles[i],2).toString() + "°";
            this.labels[i].style = "answer";
        }

        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        for (let i=0; i<this.question.angles.length; i++) {
            this.labels[i].text = String.fromCharCode(65+i);
            this.labels[i].style = "normal";
        }

        return this.answered = false;
    }
}
