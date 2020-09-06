
/**
 * Example store structure
 */
const root = document.querySelector("main");
const store = {
  name: "Figure Skating 101",
  // 5 or more questions are required
  questions: [
    {
      question: 'What is the take-ff edge of an Axel jump element?',
      answers: [
        'Forward Outside',
        'Forward Inside',
        'Backward Outside',
        'Backward Inside'
      ],
      correctAnswer: 'Forward Outside'
    },
    {
      question: `What is the exit edge of a Left Forward Outside Rocker turn`,
      answers: [
        'Left Backward Outside',
        'Left Backward Inside',
        'Right Backward Outside',
        'Right Backward Outside'
      ],
      correctAnswer: 'Left Backward Outside'
    },
    {
      question: `What is the basic position of this spin element?`,
      imgURL: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Sit_spin.jpg",
      answers: [
        'Sit',
        'Camel',
        'Upright',
        'Non-basic'
      ],
      correctAnswer: "Sit"
    },
    {
      question: "What is the name of this field movement?",
      imgURL: "https://i.pinimg.com/originals/70/b3/d7/70b3d72afe1681035fbcc270b36bd7c5.jpg",
      answers: [
        'Spiral',
        'Death Spiral',
        'Ina Bauer',
        'Spread Eagle'
      ],
      correctAnswer: "Spread Eagle"
    },
    {
      question: "What jump is this?",
      imgURL: "https://cdn.theatlantic.com/thumbor/El2KuNVfAZzI8xf2Ndc9xPNWPRk=/media/img/posts/2014/02/kimyunatum/original.gif",
      answers: [
        "Triple Axel",
        "Double Toe",
        "Double Axel",
        "Quadruple Lutz"
      ],
      correctAnswer: "Double Axel"
    }

  ],
};

class QuizModel {
  constructor(quizStore) {
    this.name = quizStore.name;
    this.questions = quizStore.questions.map((question, index) => {
      question.userAnswer = ""
      question.index = index;
      question.answerIsCorrect = null;
      return question;
    });
    this.quizLength = this.questions.length;
    this.currentQuestion = this.questions[0];
    this.quizComplete = false;
  }
  nextQuestion() {
    if (this.currentQuestion.index < this.quizLength -1) {
      this.currentQuestion = this.questions[this.currentQuestion.index + 1];
      console.log(this.currentQuestion)
    } else {
      this.quizComplete = true;
      this.returnResults();
    }
  }
  answerQuestion(answerString) {
    this.currentQuestion.userAnswer = answerString;
    this.currentQuestion.answerIsCorrect = (this.currentQuestion.correctAnswer == answerString) ? true : false;
    return this.currentQuestion.answerIsCorrect;
  }
  returnResults() {
    console.log("results:")
    const results = this.questions.reduce((resultObj, currentQuestion) => {
      resultObj.questionsCorrect += currentQuestion.answerIsCorrect ? 1 : 0
      resultObj.questionsAnswered += (currentQuestion.answerIsCorrect !== null) ? 1 : 0;
      return resultObj;
    }, {
      totalQuestions: this.quizLength,
      questionsAnswered: 0,
      questionsCorrect: 0
    })

    return results;
  }
  resetQuiz() {
    this.questions.forEach(question => question.answerIsCorrect = null)
    this.quizComplete = false;
    this.currentQuestion = this.questions[0];
  }
}


function resultScreen(storeObj) {
  return 
  // return html string of answer screen
}
// These functions return HTML templates

/********** RENDER FUNCTION(S) **********/
class QuizView {
  constructor(rootElement) {
    this.target = rootElement;
    this.currentView = "<h2>Hello World</h2>";
  }
  start(quizName) {
    this.currentView = `<section id="start-screen">
    <h2>Welcome to the ${quizName} Quiz Show!</h2>
    <button class="start">Begin!</button>
    </section>`
  }
  question(question, results) {
    let htmlString = `<section id="question">
                          <p>Question ${results.questionsAnswered + 1} of ${results.totalQuestions}</p>
                          <p>Current Score: ${results.questionsCorrect}/${results.questionsAnswered}</p>
                          <h2>${question.question}</h2>
                          <form action="">
                          <input type="radio" name="multi-answer" id="1" value="${question.answers[0]}">
                          <label for="1">${question.answers[0]}</label>
                          <input type="radio" name="multi-answer" id="2" value="${question.answers[1]}">
                          <label for="2">${question.answers[1]}</label>
                          <input type="radio" name="multi-answer" id="3" value="${question.answers[2]}">
                          <label for="3">${question.answers[2]}</label>
                          <input type="radio" name="multi-answer" id="4" value="${question.answers[3]}">
                          <label for="4">${question.answers[3]}</label>
                              <input type="submit">
                          </form>
                        </section>`

  if (question.imgURL) {
    let tree = $(`<div>${htmlString}</div>`)
    tree.find("h2").after(`<img src="${question.imgURL}">`)
    htmlString = tree.html();
  }
  this.currentView = htmlString;
  }
  answer(question, results) {
    this.currentView = `<section id="answer">
                          <h2>Answer</h2>
                          <h3>You answered:</h3>
                          <h4>${question.userAnswer}</h4>
                          <h3>The correct answer was:</h3>
                          <h4>${question.correctAnswer}</h4>
                          <h3>Your current score is ${results.questionsCorrect}/${results.questionsAnswered}. Good Job!</h3>
                          <button class="next">Next</button>
                        </section>`;
  }
  results(results) {
    this.currentView = `<section id="results">
                          <h2>Results:</h2>
                          <h3>Your final score is:</h3>
                          <h4>${results.questionsCorrect}/${results.questionsAnswered} better luck next time!</h4>
                          <button class="start">Play again?</button>
                        </section> `;
  }
  render() {
    $(this.target).html(this.currentView)
  }
}

// choose which screen to run


/********** EVENT HANDLER FUNCTIONS **********/

class QuizController {
  constructor(rootElement, quizModel, quizView) {
    this.root = rootElement;
    this.model = quizModel;
    this.view = quizView;
  }
  handleStart() {
    this.model.resetQuiz()
    this.view.question(this.model.currentQuestion, this.model.returnResults());
    this.view.render();
    console.log("start")
  }

  handleSubmit(event) {
    event.preventDefault();
    const answer = $(event.target).find("input:checked").val();
    this.model.answerQuestion(answer);
    this.view.answer(this.model.currentQuestion, this.model.returnResults())
    this.view.render();
  }

  handleNext() {
    console.log("next")
    this.model.nextQuestion();
    this.model.quizComplete 
    ? this.view.results(this.model.returnResults())
    : this.view.question(this.model.currentQuestion,this.model.returnResults());
    this.view.render();
  }
  setEventListeners() {
    $(this.root).on("click", ".start", $.proxy(this.handleStart, this));
    $(this.root).on("click", ".next", $.proxy(this.handleNext, this));
    $(this.root).on("submit", "form", $.proxy(this.handleSubmit, this));
  }
  startApp() {
    this.setEventListeners();
    this.view.start(this.model.name);
    this.view.render();
  }
}

const testQuizModel = new QuizModel(store);
const testQuizView = new QuizView(root);
const testQuizController = new QuizController(root, testQuizModel, testQuizView);
// These functions handle events (submit, click, etc)


//initialize on page load
$(() => {
  testQuizController.startApp();
})