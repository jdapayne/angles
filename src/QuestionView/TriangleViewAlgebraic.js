import TriangleView from 'QuestionView/TriangleView';
import Point from 'Utilities/Point';

export default class TriangleViewAlgebraic extends TriangleView {
    constructor(question, width, height,rotation) {
        super(question, width, height,rotation);

        this.labels.forEach(function(l,idx) {
            l.text = question.expressions[idx].toStringP() + "°";
        });

        this.labels.push(
            {
                text: "x = " + question.solution,
                pos: new Point(10, height - 10),
                style: "extra-answer",
                hidden: true
            }
        )
    }

    showAnswer() {
        if (this.answered) return; //nothing to do
        for (let i=0; i<this.labels.length-1; i++) {
            this.labels[i].text = this.question.angles[i].toString() + "°";
            this.labels[i].style = "answer";
        }
        this.labels[this.labels.length - 1].hidden = false;

        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        for (let i=0; i<this.labels.length-1; i++) {
            this.labels[i].text = this.question.expressions[i].toStringP() + "°";
            this.labels[i].style = "normal";
        }
        this.labels[this.labels.length - 1].hidden = true;
        return this.answered = false;
    }
}
