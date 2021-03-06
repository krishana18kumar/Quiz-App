const startbtn = document.querySelector("#startBtn");
const playAgainbtn = document.querySelector("#playAgainBtn");
const tryAgainbtn = document.querySelector("#tryAgainBtn");
const homebtn = document.querySelector("#homeBtn");
const nextBtn = document.querySelector("#nextBtn");
const question = document.getElementById("question");
const choices = Array.from(document.querySelectorAll("li"));
const startPage = document.querySelector("#select_area");
const loader = document.querySelector("#load_area");
const quizPage = document.querySelector("#quiz_area");
const resultPage = document.querySelector("#result_area");
const errorPage = document.querySelector("#error_area");
let questionCounterText = document.querySelector("#question_counter_text")
let scoreText = document.querySelector("#score_text");

const amount = document.querySelector("#amount");
const category = document.querySelector("#Category");
const difficulty = document.querySelector("#Difficulty");

const CIRCLE = "fa-circle";
const CORRECT = "fa-check-circle";
const INCORRECT = "fa-times-circle";


let currentQuestion = {};
let acceptingAnswer = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// startbtn.disabled = true;
// for starting the quiz
startbtn.addEventListener("click", () => {
    startPage.classList.add("display");
    loader.classList.remove("display");
    fetchQuestions();
});
//try again if error any 
tryAgainbtn.addEventListener("click", () => {
    startPage.classList.remove("display");
    errorPage.classList.add("display");
})
// to play again the quiz
playAgainbtn.addEventListener("click", () => {
    startPage.classList.add("display");
    quizPage.classList.remove("display");
    resultPage.classList.add("display");
    startGame();
});


homebtn.addEventListener("click", () => {
    startPage.classList.remove("display");
    quizPage.classList.add("display");
    resultPage.classList.add("display");
});

let questions = [];

// fetching questiona for open trivia database  via API 
fetchQuestions = () => {
    fetch(`https://opentdb.com/api.php?amount=${amount.value}&category=${category.value}&difficulty=${difficulty.value}&type=multiple`)
        .then(res => {
            return res.json();
        })
        .then(loadedQuestions => {
            questions = loadedQuestions.results.map(loadedQuestion => {
                decodedQuestion = decodeQuestion(loadedQuestion.question);
                const formattedQuestion = {
                    question: decodedQuestion
                };
                const answerChoices = [...loadedQuestion.incorrect_answers];
                formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
                answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
                for (i = 0; i < answerChoices.length; i++) {
                    formattedQuestion["choice" + (i + 1)] = answerChoices[i];
                }
                return formattedQuestion;
            });

            maxQuestions = questions.length;
            if (maxQuestions < amount.value) {
                //DISPLAY ERROR MESSAGE 
                loader.classList.add("display");
                errorPage.classList.remove("display");
            } else {
                startGame();
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const correctBonus = 10;
let maxQuestions;

//function for starting the game 
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    quizPage.classList.remove("display");
    loader.classList.add("display");
};

// function to load questions 
getNewQuestion = () => {
    if (availableQuestions.length == 0 || questionCounter >= maxQuestions) {

        //Display Result
        startPage.classList.add("display");
        quizPage.classList.add("display");
        resultPage.classList.remove("display");
        scoreText.innerText = `${score} Out of ${maxQuestions*10}`;
        return;
    }
    questionCounter += 1;
    questionCounterText.innerText = `Question: ${questionCounter}/${maxQuestions}`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    // display the current question 
    question.innerText = currentQuestion.question;
    choices.forEach(choice => {
        const number = choice.dataset['number'];

        choice.innerHTML = `<p class="text" data-number="${number}"><i class="far fa-circle" data-number="${number}"></i>   ${currentQuestion["choice"+ number]} </p> `

    })
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswer = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", event => {
        if (!acceptingAnswer) return;
        acceptingAnswer = false;
        const firstchild = event.target.firstChild;
        const selectedChoice = event.target;
        const selectedAnswer = event.target.dataset["number"];
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        // console.log("first child", firstchild);
        // console.log("selected choice", selectedChoice);

        if (firstchild == null) {
            // console.log("selected choice is 'i' ");
            if (classToApply == "correct") {
                score += 10;
                selectedChoice.classList.add(CORRECT);
                selectedChoice.classList.remove(CIRCLE);
                selectedChoice.parentNode.classList.add(classToApply);

            } else {
                selectedChoice.classList.add(INCORRECT);
                selectedChoice.classList.remove(CIRCLE);
                selectedChoice.parentNode.classList.add(classToApply);

            }
        } else {
            // console.log("i", selectedChoice.firstChild);
            if (classToApply == "correct") {
                score += 10;
                selectedChoice.firstChild.classList.add(CORRECT);
                selectedChoice.firstChild.classList.remove(CIRCLE);
                selectedChoice.classList.add(classToApply);

            } else {
                selectedChoice.firstChild.classList.add(INCORRECT);
                selectedChoice.firstChild.classList.remove(CIRCLE);
                selectedChoice.classList.add(classToApply);
            }
        }
        // nextBtn.addEventListener("onclick", () => {

    });
});

// onclick function executing on next button
nextQuestion = () => {
    setTimeout(() => {
        // selectedChoice.classList.remove(classToApply);
        getNewQuestion();
        console.log(questionCounter);
    }, 500);
};
//decoding Question
decodeQuestion = html => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value
};