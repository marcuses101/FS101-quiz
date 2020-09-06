/**
 * Example store structure
 */
const root = document.querySelector("main");
const store = {
  name: "Test Quiz",
  // 5 or more questions are required
  questions: [
    {
      question: 'What color is broccoli?',
      answers: [
        'red',
        'orange',
        'pink',
        'green'
      ],
      correctAnswer: 'green'
    },
    {
      question: 'What is the current year?',
      answers: [
        '1970',
        '2015',
        '2019',
        '2005'
      ],
      correctAnswer: '2019'
    }
  ],
};

class QuizModel {
  constructor(quizStore) {
    this.name = quizStore.name;
    this.questions = quizStore.questions.map((question, index) => {
      question.userAnswer = ""
      question.index = index;
      question.correct = null;
      return question;
    });
    this.quizLength = this.questions.length;
    this.currentQuestion = this.questions[0];
    this.quizComplete = false;
  }
  nextQuestion() {
    if (this.currentQuestion.index + 1 < this.quizLength) {
      this.currentQuestion = this.questions[this.currentQuestion.index + 1];
      return this.currentQuestion
    } else {
      this.quizComplete = true;
      this.returnResults();
    }
  }
  answerQuestion(answerString) {
    this.currentQuestion.userAnswer = answerString;
    this.currentQuestion.correct = (this.currentQuestion.correctAnswer == answerString) ? true : false;
    return this.currentQuestion.correct;
  }
  returnResults() {
    console.log("results:")
    const results = this.questions.reduce((resultObj, currentQuestion) => {
      resultObj.questionsCorrect += currentQuestion.correct ? 1 : 0
      resultObj.questionsAnswered += (currentQuestion.correct !== null) ? 1 : 0;
      return resultObj;
    }, {
      totalQuestions: this.quizLength,
      questionsAnswered: 0,
      questionsCorrect: 0
    })

    return results;
  }
  resetQuiz() {
    this.questions.forEach(question => question.correct = null)
    this.quizComplete = false;
  }
}



/**
 * 
 * Technical requirements:
 * 
 * Your app should include a render() function, that regenerates the view each time the store is updated. 
 * See your course material and access support for more details.
 *
 * NO additional HTML elements should be added to the index.html file.
 *
 * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary
 *
 * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING 👇
 * 
 */

/********** TEMPLATE GENERATION FUNCTIONS **********/




function correctAnswerScreen(storeObj) {
  return `    <section id="answer">
  <h2>Answer</h2>
  <h3>You answered:</h3>
  <h4>${storeObj.userAnswer}</h4>
  <h3>The correct answer was:</h3>
  <h4>${storeObj.currentQuestion.correctAnswer}</h4>
  <h3>Your current score is ${storeObj.correctAnswers}/${storeObj.currentQuestionIndex}. Good Job!</h3>
  <button class="next">Next</button>
</section>`
}

function resultScreen(storeObj) {
  return `<section id="results">
          <h2>Results:</h2>
          <h3>Your final score is:</h3>
          <h4>${storeObj.correctAnswers}/${storeObj.totalQuestions} better luck next time!</h4>
        </section> `
  // return html string of answer screen
}
// These functions return HTML templates

/********** RENDER FUNCTION(S) **********/
class QuizView {
  constructor(rootElement) {
    this.target = rootElement;
    this.currentView = "<h2>Hello World</h2>";
  }
  start() {
    this.currentView = `<section id="start-screen">
    <h2>Welcome to the Figure Skating 101 Quiz Show!</h2>
    <button class="start">Begin!</button>
    </section>`
  }
  question(question, results) {
    this.currentView = `<section id="question">
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
  }
  answer(question, result) {
    this.currentView = ``;
  }
  results(results) {
    this.currentView = ``;
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
    this.view.question(this.model.currentQuestion,this.model.returnResults());
    this.view.render();
    console.log("start")
  }

  handleSubmit(event) {
    event.preventDefault();
    const answer = $(event.target).find("input:checked").val();
    this.model.answerQuestion(answerString);
    
    console.log(answer);
  }

  handleNext() {
    console.log("next")
  }
  setEventListeners() {
    $(this.root).on("click", ".start", $.proxy(this.handleStart,this));
    $(this.root).on("click", ".next", $.proxy(this.handleNext,this));
    $(this.root).on("submit", "form", $.proxy(this.handleSubmit,this));
  }
  startApp() {
    this.setEventListeners();
    this.view.start();
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