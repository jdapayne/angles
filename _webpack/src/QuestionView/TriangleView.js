import Point from 'Utilities/Point';
import Triangle from 'Question/Triangle';
import QuestionView from 'QuestionView/QuestionView';
import {sinDeg} from 'Utilities/Utilities';

export default class TriangleView extends QuestionView {
    constructor(question, radius, width, height) {
        super(question, radius, width, height);

        question.angles.sort((a,b) => a-b);

        this.A = new Point(0,0);
        this.B = Point.fromPolarDeg(2*radius, question.angles[0]);
        this.C = new Point(
            2*radius*sinDeg(question.angles[1])/sinDeg(question.angles[2]),0
        );

        this.labels = [
            {pos: this.A.clone(), text: "A:" + this.question.angles[0] + "°", style: "answer"},
            {pos: this.B.clone(), text: "B:" + this.question.angles[1] + "°", style: "normal"},
            {pos: this.C.clone(), text: "C:" + this.question.angles[2] + "°", style: "normal"}
        ];

        this.rotation = this.randomRotate();

        let centroid = Point.mean([this.A,this.B,this.C]);
        let center = Point.center([this.A,this.B,this.C]);

        this.translate(width/2-center.x,height/2-center.y); //centre
    }

    get allpoints () {
        let allpoints = [this.A,this.B,this.C];
        this.labels.forEach( l => {allpoints.push(l.pos)} );
        return allpoints;
    }

    drawIn(canvas) {
        var ctx = canvas.getContext("2d");

        ctx.clearRect(0,0,canvas.width,canvas.height); // clear

        ctx.beginPath();
        ctx.moveTo(this.A.x,this.A.y); // draw lines
        ctx.lineTo(this.B.x,this.B.y);
        ctx.lineTo(this.C.x,this.C.y);
        ctx.lineTo(this.A.x,this.A.y);
        ctx.stroke();
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
}


