import QuestionView from 'QuestionView/QuestionView';
import AnglesForming from 'Question/AnglesForming';
import Point from 'Utilities/Point';
import {degToRad} from 'Utilities/Utilities';

export default class AnglesFormingView extends QuestionView {
    constructor(question,radius,width,height,norotate) {
        // question :: AnglesForming
        // radius :: Number 
        
        super(question,radius);
        
        this.O = new Point(0,0);
        this.A = new Point(radius,0);

        this.C = [];
        var totalangle = 0; // nb in radians
        for (var i=0;i<question.angles.length;i++) {
            totalangle += question.angles[i]*Math.PI/180;
            this.C[i] = Point.fromPolar(radius,totalangle);
        }

        this.labels = [];
        totalangle = 0;
        for (var i=0;i<question.angles.length;i++) {
            let theta = question.angles[i]
            this.labels[i] = {
                pos: Point.fromPolarDeg(radius*(0.4+6/theta),totalangle+theta/2),
                text: question.missing[i] == true ? "x°" : question.angles[i].toString() + "°",
                style: "normal"
            }
            totalangle+=theta;
        }

        /* Labels are objects with:
         *  pos:: Point
         *  text:: String
         *  style:: String
         *  hidden:: Boolean
         */

        if (!norotate) this.rotation = this.randomRotate();
        else this.rotation = 0;

        this.translate(width/2-this.O.x,height/2-this.O.y); //centre
    }

    get allpoints () {
        let allpoints = [this.A,this.O];
        allpoints = allpoints.concat(this.C);
        this.labels.forEach(function(l) {
            allpoints.push(l.pos)
        });
        return allpoints;
    }

    drawIn(canvas) {
        var ctx = canvas.getContext("2d");

        ctx.clearRect(0,0,canvas.width,canvas.height); // clear

        ctx.beginPath();
        ctx.moveTo(this.O.x,this.O.y); // draw lines
        ctx.lineTo(this.A.x,this.A.y);
        for (var i=0;i<this.C.length;i++) {
            ctx.moveTo(this.O.x,this.O.y);
            ctx.lineTo(this.C[i].x,this.C[i].y);
        }
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        let totalangle = this.rotation;
        for (let i=0;i<this.question.angles.length;i++) {
            let theta = degToRad(this.question.angles[i]);
            ctx.arc(this.O.x, this.O.y, this.radius*(0.2+0.07/theta), totalangle, totalangle+theta);
            ctx.stroke();
            totalangle+=theta;
        }
        ctx.closePath();

        // labels
        ctx.beginPath();
        this.labels.forEach(function(l){
            if (!l.hidden) {
                ctx.font = QuestionView.styles.get(l.style).font;
                ctx.fillStyle = QuestionView.styles.get(l.style).colour;
                ctx.textAlign = QuestionView.styles.get(l.style).align;
                ctx.textBaseline = QuestionView.styles.get(l.style).baseline;
                ctx.fillText(l.text,l.pos.x,l.pos.y);
            }
        });
        ctx.closePath();
    }

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
                l.text = "x°"
                l.style = "normal";
            }
        });
        return this.answered = false;
    }

    toggleAnswer() {
        if (this.answered) return this.hideAnswer();
        else return this.showAnswer();
    }
}
