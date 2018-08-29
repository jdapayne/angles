import {randBetween} from 'Utilities/Utilities';
import AnglesForming from 'Question/AnglesForming';
import AnglesFormingView from 'QuestionView/AnglesFormingView';
import AnglesFormingAlgebraic from 'Question/AnglesFormingAlgebraic';
import AnglesFormingViewAlgebraic from 'QuestionView/AnglesFormingViewAlgebraic';
import AnglesFormingWorded from 'Question/AnglesFormingWorded';
import AnglesFormingViewWorded from 'QuestionView/AnglesFormingViewWorded';
import Triangle from 'Question/Triangle';
import TriangleView from 'QuestionView/TriangleView';
import './style.css';

window.addEventListener("DOMContentLoaded", function () {
        App.init();
});

export default function App () {}

/* Initialisation: Sets up click handlers etc */
App.init = function () {
    App.getSettings();

    document.getElementById("generate").addEventListener("click", function(e) {
        e.preventDefault();
        App.generateAll();
    });

    document.getElementById("showoptions").addEventListener("click",App.toggleOptions);

    document.getElementById("display-box").addEventListener("click", function(e) {
        let elem = e.target;
        if (elem.classList.contains("refresh")) {
            let q_container = elem.closest(".question-container");
            let q_index = q_container.dataset.question_index;
            App.generate(q_index);
        } else if (elem.classList.contains("answer-toggle")) {
            let q_container = elem.closest(".question-container");
            let q_index = q_container.dataset.question_index;
            App.toggleAnswer(q_index,elem);
        }
    });

    document.getElementById("show-answers").addEventListener("click",App.toggleAllAnswers);

    document.getElementById("options").addEventListener("change",App.getSettings);
};
/* * * * * * * * * * * * * * * * * * * * * * * */

/* UI control */
App.toggleOptions = function (e) {
    let showoptions = document.getElementById("showoptions");
    let is_hidden = document.getElementById("options").classList.toggle("hidden");

    if (is_hidden) {
        showoptions.innerHTML = "Show options";
    } else {
        showoptions.innerHTML = "Hide options";
    }

    if (e) {e.preventDefault()}
}

App.toggleAnswer = function (i,e) {
    let answered = App.questions[i].viewobject.toggleAnswer();
    App.draw(i);
    let container = App.questions[i].container;
    container.classList.toggle("answer");
    let toggle = container.querySelector(".answer-toggle");
    if (answered) toggle.innerHTML = "Hide answer";
    else toggle.innerHTML = "Show answer";
};

App.showAnswer = function (i) {
    App.questions[i].viewobject.showAnswer();
    App.draw(i);
    let container = App.questions[i].container;
    container.classList.add("answer");
    container.querySelector(".answer-toggle").innerHTML = "Hide answer";
};

App.hideAnswer = function (i,e) {
    App.questions[i].viewobject.hideAnswer();
    App.draw(i);
    let container = App.questions[i].container;
    container.classList.remove("answer");
    container.querySelector(".answer-toggle").innerHTML = "Show answer";
};

App.hideAllAnswers = function () {
    App.questions.forEach( function(q,i) { App.hideAnswer(i) });
    document.getElementById("show-answers").innerHTML = "Show answers";
    App.answered = false;
}

App.showAllAnswers = function () {
    App.questions.forEach( function(q,i) { App.showAnswer(i) });
    document.getElementById("show-answers").innerHTML = "Hide answers";
    App.answered = true;
}

App.toggleAllAnswers = function (e) {
    if (App.answered) App.hideAllAnswers();
    else App.showAllAnswers();
    if (e) {e.preventDefault()}
}

App.answered = false;
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * Question selection/object creation * * */
App.chooseQDifficulty = function (difficulty) {
    // choose question at random - given type options, with given difficulty.
    // Aim - avoid and DOM interaction with these.
    const type = App.randomType();
    switch(difficulty) {
        case 1:
            return App.chooseQ(type,"simple",{n: 2});
        case 2:
            return App.chooseQ(type,"simple",{n: 3});
        case 3:
            return App.chooseQ(type,"repeated", {n:3});
        case 4:
            return App.chooseQ(type,"algebra", {types: ['mult'], constants: false, ensure_x: false, min_n:3, max_n: 6});
        default:
            return App.chooseQ(type,"simple",{n: 2});
            // code
    }
}

App.chooseQRandom = function () {
    // choose based on options for type and subtupes available
    const type = App.randomType();
    const subtype = App.randomSubType();
    return App.chooseQ(type,subtype);
}

App.chooseQ = function (type, subtype, options) {
    switch(type) {
        case 'aosl':
        case 'aaap':
            let anglesum = type === 'aosl' ? 180 : 360;
            switch(subtype) {
                case 'simple':
                    return AnglesForming.random(anglesum,options);
                case 'repeated':
                    return AnglesForming.randomrep(anglesum,options);
                case 'algebra':
                    return AnglesFormingAlgebraic.random2(anglesum,options);
                case 'worded':
                    return AnglesFormingWorded.random(anglesum,options);
                default:
                    throw "no_subtype";
            }
        case 'triangle':
            switch(subtype) {
                case 'simple':
                    return Triangle.random(options);
                case 'repeated':
                    return Triangle.randomrep(options);
                case 'algebra':
                case 'worded':
                default:
                    throw "no_subtype";
            }
        default:
            throw "no_type";
    }
}

App.randomType = function () {
    const diceroll = randBetween(0,App.settings.types.length - 1);
    const type = App.settings.types[diceroll];
    return type;
}

App.randomSubType = function () {
    const diceroll = randBetween(0,App.settings.subtypes.length - 1);
    const subtype = App.settings.subtypes[diceroll];
    return subtype;
}

/* To be replaced */
/**/ App.chooseQuestion = function () {
/**/     let selected_types = document.querySelectorAll(".type:checked");
/**/     let diceroll = randBetween(0,selected_types.length-1);
/**/     let type = selected_types[diceroll].id;
/**/     switch(type) {
/**/         case "aaap":
/**/             return App.chooseAnglesForming(360);
/**/         case "triangle":
/**/             return App.chooseTriangle();
/**/         case "aosl":
/**/         default:
/**/             return App.chooseAnglesForming(180);
/**/     }
/**/ };
/**/ 
/**/ App.chooseAnglesForming = function (anglesum) {
/**/     let selected_subtypes = document.querySelectorAll(".subtype:checked");
/**/     if (selected_subtypes.length === 0) throw "no_subtype";
/**/     let diceroll = randBetween(0,selected_subtypes.length-1);
/**/     let subtype = selected_subtypes[diceroll].id;
/**/     let question;
/**/     switch(subtype) {
/**/         case "simple":{
/**/             let n = randBetween(2,4);
/**/             question = AnglesForming.random(anglesum,n);
/**/             break;
/**/         }
/**/         case "repeated":{
/**/             if (Math.random() < 0.15) {
/**/                 let n = randBetween(2,5);
/**/                 question = AnglesForming.randomrep(anglesum,n,n);
/**/             } else {
/**/                 let n = randBetween(3,4);
/**/                 let m = randBetween(2,n-1);
/**/                 question = AnglesForming.randomrep(anglesum,n,m);
/**/             }
/**/             break;
/**/         }
/**/         case "algebra":{
/**/             let n = randBetween(2,3);
/**/             question = AnglesFormingAlgebraic.random(anglesum,n);
/**/             break;
/**/         }
/**/         case "worded":{
/**/             let n = randBetween(2,3)
/**/             question = AnglesFormingWorded.random(anglesum,n);
/**/             break;
/**/         }
/**/         default:{
/**/             throw new Error("This shouldn't happen!!")
/**/         }
/**/     }
/**/     return question;
/**/ };
/**/ 
/**/ App.chooseTriangle = function () {
/**/     return Triangle.random();
/**/ }
/**/ 
/**/ App.makeView = function (question) {
/**/     // at some point, this needs to branch with different types as well
/**/     let view;
/**/     switch (question.type) {
/**/     	case "anglesforming":
/**/         case "aosl":
/**/         case "aaap":
/**/             switch (question.subtype) {
/**/                 case "simple":
/**/                 case "repeated":
/**/                     view = new AnglesFormingView(question,App.defaults.radius,App.defaults.canvas_width,App.defaults.canvas_height);
/**/                     break;
/**/                 case "algebra":
/**/                     view = new AnglesFormingViewAlgebraic(question,App.defaults.radius,App.defaults.canvas_width,App.defaults.canvas_height);
/**/                     break;
/**/                 case "worded":
/**/                     view = new AnglesFormingViewWorded(question,App.defaults.radius,App.defaults.canvas_width,App.defaults.canvas_height);
/**/                     break;
/**/                 default:
/**/                     throw new Error("No appropriate subtype of question");
/**/             }
/**/             break;
/**/         case "triangle":
/**/             view = new TriangleView(question,App.defaults.radius,App.defaults.canvas_width,App.defaults.canvas_height);
/**/             break;
/**/         default:
/**/             throw "no_type";
/**/     }
/**/     return view;
/**/ };
/* * * * * * * * * * * * * * * * * * * * */

/* * * Question drawing control * * */
App.clear = function () {
    document.getElementById("display-box").innerHTML = "";
    App.questions = []; // cross fingers that no memory leaks occur
    //dunno if this should go here or somewhere else...
    document.getElementById("show-answers").removeAttribute("disabled");
    App.hideAllAnswers();
};

App.draw = function (i) {
    // redraws ith question
    let view = App.questions[i].viewobject;
    let canvas = App.questions[i].container.querySelector("canvas");
    view.drawIn(canvas);
};

App.drawAll = function () {
    App.questions.forEach( function (q) {
        let view = q.viewobject;
        let canvas = q.container.querySelector("canvas");
        view.drawIn(canvas);
    });
}

App.generate = function (i) {
    // Generates a question and represents it at the given index
    let question;
    if (App.settings.options_mode === 'basic') {
        let difffloat = App.settings.mindiff + i * (App.settings.maxdiff - App.settings.mindiff + 1)/App.settings.nquestions 
        let diff = Math.floor(difffloat); 
        console.log("difficulty for " + i + " : " + difffloat + " -> " + diff);
        question = App.chooseQDifficulty(diff);
    } else {
        question = App.chooseQRandom() 
    }

    let view = App.makeView(question);
    
    App.questions[i] = Object.assign({},App.questions[i], {
        viewobject: view,
        type: question.type,
        subtype: question.subtype
    });

    App.draw(i);
};

App.generateAll = function () {
    App.clear();
    // Create containers for questions and generate a question in each container
    let n = document.getElementById("n-questions").value;
    for (let i=0; i<n; i++) {
        // Make DOM elements
        let container = document.createElement("div");
        container.className = "question-container";
        container.dataset.question_index = i;

        let canvas = document.createElement("canvas");
        canvas.width = App.defaults.canvas_width;
        canvas.height = App.defaults.canvas_height;
        canvas.className = "question-view";
        container.append(canvas);

        let refresh = document.createElement("img");
        refresh.src = "refresh.png"; // might be better to do something clever with webpack
        refresh.className = "refresh";
        refresh.width = 15;
        refresh.height = 15;
        container.append(refresh);

        let answer_toggle = document.createElement("div");
        answer_toggle.innerHTML = "Show answer";
        answer_toggle.className = "answer-toggle";
        container.append(answer_toggle);

        document.getElementById("display-box").append(container);

        App.questions[i] = Object.assign({},App.questions[i], {
            container: container
        });

        // Make question and question view
        App.generate(i);
    }
};
/* * * * * * * * * * * * * * * * * * * * */

/* * * Data on generated questions * * */
/********************************************************************************************************
 * Example:
 * App.questions =
 *  [
 *      {type: "aosl", subtype: "simple", viewobject: [AoslView object], container: [Node]},
 *      {type: "aosl", subtype: "algebra", viewobject: [AoslViewAlgebraic object], container: [Node]}
 *  ]
 *
 ********************************************************************************************************/

App.questions = []; // An array of Aoslviews? Or maybe a bit more.

App.defaults = {
    canvas_width: 250,
    canvas_height: 250,
    radius: 100
};

App.settings = {
    canvas_width: 250,
    canvas_height: 250,
    types: [],
    subtypes: [],
    min_n: 2,
    max_n: 4,
    options_mode: "basic"
}
   
App.getSettings = function() {
    // update form elements on page with settings object
    App.settings.types = Array.from(document.querySelectorAll(".type:checked")).map(x=>x.id);
    App.settings.subtypes = Array.from(document.querySelectorAll(".subtype:checked")).map(x=>x.id);
    App.settings.mindiff = parseInt(document.getElementById("mindiff").value);
    App.settings.maxdiff = parseInt(document.getElementById("maxdiff").value);
    App.settings.nquestions = parseInt(document.getElementById("n-questions").value);
    console.log("settings updated:");
    console.log(App.settings);
    return App.settings;
}
