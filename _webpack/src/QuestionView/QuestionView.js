import Point from 'Utilities/Point';

export default class QuestionView {
    constructor(question,radius,width,height) {
        this.question = question;
        this.radius = radius;
        this.answered = false;
    }

/* * * Abstract methods   * * */
/**/                        /**/
/**/  get allpoints () {    /**/
/**/      return []         /**/
/**/  }                     /**/
/**/                        /**/
/**/  drawIn(canvas) {}     /**/
/**/                        /**/
/**/  showAnswer() {}       /**/
/**/                        /**/
/**/  hideAnswer() {}       /**/
/**/                        /**/
/**/  toggleAnswer() {}     /**/
/**/                        /**/
/* * * * * * * * * * * * * *  */

    scale(sf) {
        this.allpoints.forEach(function(p){
            p.scale(sf)
        });
    }

    rotate(angle) {
        this.allpoints.forEach(function(p){
            p.rotate(angle)
        });
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
