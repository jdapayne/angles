import Point from 'Utilities/Point';

export default class QuestionView {
    constructor(question,width,height,rotation) {
        this.question = question;
        this.answered = false;
        this.rotation = rotation;
        this.unknown = "x°";
    }

/* * * Abstract methods   * * */
/**/                        /**/
/**/  get allpoints () {    /**/
/**/      return []         /**/
/**/  }                     /**/
/**/                        /**/
/**/  drawIn(canvas) {}     /**/
/**/                        /**/
/* * * * * * * * * * * * * *  */
    showAnswer() {
        if (this.answered) return; //nothing to do
        this.labels.forEach( (l,i) => {
            if (this.question.missing[i]) {
                l.text = this.question.angles[i].toString() + "°";
                l.style = "answer";
            }
        });
        return this.answered = true;
    }

    hideAnswer() {
        if (!this.answered) return; //nothing to do
        this.labels.forEach( (l,i) => {
            if (this.question.missing[i]) {
                l.text = this.unknown;
                l.style = "normal";
            }
        });
        return this.answered = false;
    }

    toggleAnswer() {
        if (this.answered) return this.hideAnswer();
        else return this.showAnswer();
    }

    scale(sf) {
        this.allpoints.forEach(function(p){
            p.scale(sf)
        });
    }

    rotate(angle) {
        this.allpoints.forEach(function(p){
            p.rotate(angle)
        });
        return angle;
    }

    translate(x,y) {
        this.allpoints.forEach(function(p){
            p.translate(x,y)
        });
    }

    randomRotate() {
        var angle=2*Math.PI*Math.random();
        this.rotate(angle);
        return angle;
    }
}

QuestionView.styles = new Map([
    ["normal" , {font: "16px Arial", colour: "Black", align: "center", baseline: "middle"}],
    ["answer" , {font: "16px Arial", colour: "Red", align: "center", baseline: "middle"}],
    ["extra-answer", {font: "16px Arial", colour: "Red", align: "left", baseline: "bottom"}],
    ["extra-info", {font: "12px Arial", colour: "Black", align: "left", baseline: "bottom"}]
]);
