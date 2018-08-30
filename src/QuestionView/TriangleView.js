import Point from 'Utilities/Point';
import Triangle from 'Question/Triangle';
import QuestionView from 'QuestionView/QuestionView';
import {sinDeg, dashedLine} from 'Utilities/Utilities';

export default class TriangleView extends QuestionView {
    constructor(question, width, height,rotation) {
        super(question, width, height,rotation);

        // generate with longest side 1
        this.A = new Point(0,0);
        this.B = Point.fromPolarDeg(1, question.angles[0]);
        this.C = new Point(
            sinDeg(question.angles[1])/sinDeg(question.angles[2]),0
        );

        this.centroid = Point.mean([this.A,this.B,this.C]);

        this.unknown = "?";
        this.labels = [];
        for(let i=0; i<3; i++) {
            let p = [this.A,this.B,this.C][i];
            this.labels[i] = {
                pos: Point.mean([p,p,this.centroid]), //weighted mean
                text: question.missing[i] == true ? this.unknown : question.angles[i].toString() + "°",
                style: "normal"
            }
        }

        this.rotation = (rotation !== undefined) ? this.rotate(rotation) : this.randomRotate();

        // scale to size
        const margin = 60;
        let topleft = Point.min([this.A,this.B,this.C]);
        let bottomright = Point.max([this.A,this.B,this.C]);
        let t_width = bottomright.x - topleft.x;
        let t_height = bottomright.y - topleft.y;
        this.scale(Math.min((width-margin)/t_width,(height-margin)/t_height)) // 15px margin

        // move to centre
        topleft = Point.min([this.A,this.B,this.C]);
        bottomright = Point.max([this.A,this.B,this.C]);
        const center = Point.mean([topleft,bottomright]);
        this.translate(width/2-center.x,height/2-center.y); //centre

    }

    get allpoints () {
        let allpoints = [this.A,this.B,this.C,this.centroid];
        this.labels.forEach( l => {allpoints.push(l.pos)} );
        return allpoints;
    }

    drawIn(canvas) {
        const ctx = canvas.getContext("2d");
        const vertices = [this.A,this.B,this.C];
        const apex = this.question.apex;

        ctx.clearRect(0,0,canvas.width,canvas.height); // clear

        ctx.beginPath();
        ctx.moveTo(this.A.x,this.A.y);

        for (let i = 0; i<3; i++) {
            const p = vertices[i];
            const next = vertices[(i+1)%3];
            if (apex === i || apex === (i+1)%3) { // to/from apex - draw dashed line
                dashedLine(ctx, p.x, p.y, next.x, next.y);
            } else {
                ctx.lineTo(next.x,next.y)
            }
        }
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


