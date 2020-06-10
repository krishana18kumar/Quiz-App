const startbtn = document.querySelector("#startBtn");
const playAgainbtn = document.querySelector("#playAgainBtn");
const homebtn = document.querySelector("#homeBtn");
const question = document.getElementById("question");
const choices = Array.from(document.querySelectorAll("li"));
const startPage = document.querySelector("#select_area");
const loader = document.querySelector("#load_area");
const quizPage = document.querySelector("#quiz_area");
const resultPage = document.querySelector("#result_area");
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

// for starting the quiz
startbtn.addEventListener("click", () => {
    // console.log("start btn clicked");
    console.log(amount.value);
    startPage.classList.add("display");
    loader.classList.remove("display");
    fetchQuestions();
});

// to play again the quiz
playAgainbtn.addEventListener("click", () => {
    // console.log("PlayAgain btn clicked");
    startPage.classList.add("display");
    quizPage.classList.remove("display");
    resultPage.classList.add("display");
    startGame();
});


homebtn.addEventListener("click", () => {
    fetchQuestions();
    // console.log("home btn clicked");
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
                const formattedQuestion = {
                    question: loadedQuestion.question
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
            startGame();
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
    questionCounter++;
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
        setTimeout(() => {
            selectedChoice.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);

    });
});