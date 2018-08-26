import AnglesFormingView from 'QuestionView/AnglesFormingView';
import Point from 'Utilities/Point';
import {roundDP} from 'Utilities/Utilities';

export default class AnglesFormingViewWorded extends AnglesFormingView{
    constructor(question, radius, width, height) {
        super(question,radius, width, height);

        super.translate(0,-15);

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
