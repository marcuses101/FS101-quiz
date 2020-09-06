/**
 * Example store structure
 */
const root = document.querySelector("main");
const store = {
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
  currentScreen: "start",
  currentQuestion: {},
  userAnswer: "",
  isCorrect: false,
  currentQuestionIndex: 0,
  correctAnswers: 0
};

store.totalQuestions = store.questions.length;

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
function startScreen(storeObj) {
  return `<section id="start-screen">
  <h2>Welcome to the Figure Skating 101 Quiz Show!</h2>
  <button class="start">Begin!</button>
</section>`
}

function questionScreen(storeObj) {
  const questionNumber = storeObj.currentQuestionIndex + 1;
  const totalQuestions = storeObj.totalQuestions;
  const correctAnswers = storeObj.correctAnswers;

  return `
<section id="question">
  <span>Question: ${questionNumber} of ${totalQuestions}</span>
  <span>Current Score: ${correctAnswers}/${questionNumber}</span>
  <h2>What is the color of a Watermelon?</h2>
  <form action="">
      <label for="1">Red</label>
      <input type="radio" name="multi-answer" id="1" value="red">
      <label for="2">Blue</label>
      <input type="radio" name="multi-answer" id="2" value="blue">
      <label for="3">Purple</label>
      <input type="radio" name="multi-answer" id="3" value="purple">
      <label for="4">Green</label>
      <input type="radio" name="multi-answer" id="4" value="green">
      <input type="submit">
  </form>
</section>`
  // return html string of qestion interface
}

function incorrectAnswerScreen(storeObj) {
  // return html string of answer screen
  return `    <section id="answer">
  <h2>Answer</h2>
  <h3>You answered:</h3>
  <h4>Blue</h4>
  <h3>The correct answer was:</h3>
  <h4>green</h4>
  <h3>Your current score is 2/4. Don't give up!</h3>
  <button class="next">Next</button>
</section>`
}

function correctAnswerScreen(storeObj) {
  return `    <section id="answer">
  <h2>Answer</h2>
  <h3>You answered:</h3>
  <h4>Blue</h4>
  <h3>The correct answer was:</h3>
  <h4>green</h4>
  <h3>Your current score is 2/4. Don't give up!</h3>
  <button class="next">Next</button>
</section>`
}

function resultScreen(storeObj) {
  return `<section id="results">
          <h2>Results:</h2>
          <h3>Your final score is:</h3>
          <h4>2/5 better luck next time!</h4>
        </section> `
  // return html string of answer screen
}
// These functions return HTML templates

/********** RENDER FUNCTION(S) **********/
function render(element, storeObj) {
  console.log("rendering")
  const screens = {
    start: startScreen,
    question: questionScreen,
    correctAnswer: correctAnswerScreen,
    incorrectAnswer: incorrectAnswerScreen,
    result: resultScreen
  }
  console.log(storeObj.currentScreen)
  const html = screens[storeObj.currentScreen](storeObj);
  $(element).html(html)
  // choose which screen to run
}

function chooseNextScreen(storeObj) {
  console.log("choosing")
  console.log(storeObj.currentScreen)
  if (storeObj.currentScreen === "start") {
    storeObj.currentScreen = "question";
    console.log("screen changed")
  } else if (storeObj.currentScreen == 'question') {
    storeObj.currentScreen = storeObj.isCorrect ? "correctAnswer" : "incorrectAnswer";
  } else if (storeObj.currentScreen.includes("Answer")) {
    storeObj.currentScreen = 'question';
  }
}

function answerQuestion(storeObj, answer) {
  if (storeObj.currentQuestion.correctAnswer === answer) {
    storeObj.isCorrect = true;
    console.log('correct!')
  } else {
    storeObj.isCorrect = false;
    console.log("not correct :(")
  }
}
function loadQuestion(storeObj) {
  storeObj.currentQuestion = storeObj.questions[storeObj.currentQuestionIndex]
}

/********** EVENT HANDLER FUNCTIONS **********/

function addSubmitHandler(element, storeObj) {
  $(element).on("submit", "form", function (event) {
    event.preventDefault();
    const answer = $(this).children("input[name='multi-answer']:checked").val();
    answerQuestion(storeObj, answer)
    chooseNextScreen(storeObj)
    render(element, storeObj)
    loadQuestion(storeObj)
  })
  console.log('submit handling')
}



function addStartHandler(element, storeObj) {
  $(element).on("click", ".start", function (event) {
    loadQuestion(storeObj);
    chooseNextScreen(storeObj);
    render(element, storeObj)
    console.log(event)
    console.log("start clicked")
  })
  console.log('start handling')
}

function addNextHandler(element, storeObj) {
  $(element).on("click", ".next", function (event) {
    storeObj.currentQuestionIndex++;
    chooseNextScreen(storeObj);
    render(element, storeObj)
  })
}


function startApp(element, storeObj) {
  addStartHandler(element, storeObj)
  addSubmitHandler(element, storeObj)
  addNextHandler(element, storeObj)
  render(element, storeObj);
}
// These functions handle events (submit, click, etc)


//initialize on page load

$(() => {
  startApp(root, store)
})