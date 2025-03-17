document.addEventListener("DOMContentLoaded", () => {
   const userPanel = document.querySelector(".user-main-container");
   const adminPanel = document.querySelector(".admin-main-container");
   const pageTitle = document.getElementById("pageTitle");
   const userIcon = document.querySelector(".fa-user");
   const adminIcon = document.querySelector(".fa-user-shield");
   const toggleModeButton = document.getElementById("toggleMode");

   const addQuestionButton = document.querySelector(".btn-add");
   const saveQuizButton = document.querySelector(".btn-save");
   const downloadButton = document.querySelector(".btn-download");
   const resetQuizButton = document.querySelector(".btn-reset");
   const choseQuestionType = document.querySelector(".chose-question-type");
   const addTextQuestion = document.getElementById("addTextQuestion");
   const addSingleChoice = document.getElementById("addSingleChoice");
   const addMultipleChoice = document.getElementById("addMultipleChoice");
   const questionsContainer = document.querySelector(".questions-container");
   const noQuestionsContainer = document.querySelector(".no-questions-container");

   const startQuizBtn = document.querySelector(".start");
   const quizTitleDisplay = document.querySelector(".quiz-title-display");
   const quizQuestion = document.querySelector(".quiz-question-title");
   const quizAnswersContainer = document.querySelector(".answers-container");
   const quizTracker = document.querySelector(".quiz-question-tracker");
   const submitAnswerBtn = document.querySelector(".submit-btn");
   const nextBtn = document.querySelector(".next-btn");
   const correctAnswer = document.querySelector(".correct");
   const wrongAnswer = document.querySelector(".wrong");
   const progressionBar = document.querySelector(".done");
   const endQuizContainer = document.querySelector(".final-score-body");
   const restartQuizBtn = document.querySelector(".restart");
   const editQuizBtn = document.querySelector(".edit");

   let isAdmin = false;
   let quizTitle = "";
   
   let questionCounter = 0;
   let userScore = 0;
   let maximumScore = 0;

   // Mode Admin/User
   function updateDisplay() {
      pageTitle.textContent = isAdmin ? "Admin Mode" : "User Mode";
      userIcon.classList.toggle("current-user", !isAdmin);
      adminIcon.classList.toggle("current-user", isAdmin);

      userPanel.classList.toggle("hidden", isAdmin);
      adminPanel.classList.toggle("hidden", !isAdmin);

      if (isAdmin) {
         noQuestionsContainer.classList.toggle("hidden", questionCounter !== 0);
      }

      toggleModeButton.classList.toggle("active-toggle", isAdmin);
   };

   updateDisplay();

   toggleModeButton.addEventListener("click", () => {
      isAdmin = !isAdmin;
      updateDisplay();
   });
   
   function displayQuestionsAdmin() {
      noQuestionsContainer.classList.toggle("hidden", questionCounter !== 0);
   };

   function updatequestionCounter() {
      questionCounter = document.querySelectorAll(".question-item").length;
      noQuestionsContainer.classList.toggle("hidden", questionCounter !== 0);
   }

   // Afficher le div pour choisir le type de question
   addQuestionButton.addEventListener("click", (event) => {
      event.stopPropagation();
      choseQuestionType.classList.toggle("hidden")
   });

   // Permettre de cacher le div précédent en cliquant n'importe où sur la page
   document.addEventListener("click", (event) => {
      if (event.target !== addQuestionButton) {
         choseQuestionType.classList.add("hidden")
      }
   });

   // Choix du type de question
   addTextQuestion.addEventListener("click", () => {
      choseQuestionType.classList.toggle("hidden")
      createNewQuestion("text")
   });
   addSingleChoice.addEventListener("click", () => {
      choseQuestionType.classList.toggle("hidden")
      createNewQuestion("single")
   });
   addMultipleChoice.addEventListener("click", () => {
      choseQuestionType.classList.toggle("hidden")
      createNewQuestion("multiple")
   });

   // Créer une question
   function createNewQuestion(type) {
      let questionIndex = questionCounter + 1;
      let questionItem = document.createElement("div");
      questionItem.classList.add("question-item");

      questionItem.innerHTML = `
         <div class="question-title">
            <h2 class="question-index">${questionIndex}.</h2>
            <input type="text" class="admin-question-input" placeholder="Enter question...">
            <div class="weighting-container">
               <p>/</p>
               <input type="number" class="weighting-input" placeholder="5">
            </div>
         </div>
         <div class="question-actions">
            <button class="question-up"><i class="fa-solid fa-arrow-up"></i></button>
            <button class="question-down"><i class="fa-solid fa-arrow-down"></i></button>
            <button class="question-delete"><i class="fa-solid fa-xmark"></i></button>
         </div>
      `;

      let answerItem = document.createElement("div");
      answerItem.classList.add("answer-item");

      if (type === "text") {
         answerItem.innerHTML = `<textarea class="answer-text-content" placeholder="Enter answer..."></textarea>`;
      } else {
         let answerOptionsContainer = document.createElement("div");
         answerOptionsContainer.classList.add("answer-options-container");

         createAnswerOption(type === "single" ? "radio" : "checkbox", answerOptionsContainer, questionIndex);

         let addAnswerButton = document.createElement("button");
         addAnswerButton.classList.add("add-answer-option");
         addAnswerButton.innerHTML = `<i class="fa-solid fa-plus"></i>Add option`;
         addAnswerButton.addEventListener("click", () => {
            createAnswerOption(type === "single" ? "radio" : "checkbox", answerOptionsContainer, questionIndex);
         });

         answerItem.append(answerOptionsContainer, addAnswerButton);
      }

      questionItem.append(answerItem);
      addEventListenersQuestions(questionItem);
      questionsContainer.appendChild(questionItem);

      updatequestionCounter(); // Met à jour le nombre total de questions
   }

   function createAnswerOption(type, answerOptionsContainer, questionIndex) {
      let newAnswerOption = document.createElement("div")
      newAnswerOption.classList.add("answer-option")

      let answerId = `answer-option-${Date.now()}`;
      let inputName = `question-${questionIndex}`; // Nom unique pour chaque question

      newAnswerOption.innerHTML = `
         <input type="${type}" id="${answerId}" name="${inputName}">
         <label for="${answerId}" class="custom-answer-select">
            <i class="fa-solid fa-check"></i>
         </label>
         <input type="text" class="answer-option-input" placeholder="Enter answer...">
         <button class="delete-answer-btn"><i class="fa-solid fa-xmark"></i></button>
      `;

      newAnswerOption.querySelector(".delete-answer-btn").addEventListener("click", () => {
         newAnswerOption.remove();
      });

      answerOptionsContainer.append(newAnswerOption)
   };

   function addEventListenersQuestions(questionItem) {
      const questionUpButton = questionItem.querySelector(".question-up");
      const questionDownButton = questionItem.querySelector(".question-down");
      const questionDeleteButton = questionItem.querySelector(".question-delete");

      questionUpButton.addEventListener("click", () => moveQuestionUp(questionItem));
      questionDownButton.addEventListener("click", () => moveQuestionDown(questionItem));
      questionDeleteButton.addEventListener("click", () => deleteQuestionItem(questionItem));
   };

   function moveQuestionUp(questionItem) {
      let prevItem = questionItem.previousElementSibling;
      if (prevItem) {
         questionsContainer.insertBefore(questionItem, prevItem);
         updateQuestionIndexes();
      }
   }

   function moveQuestionDown(questionItem) {
      let nextItem = questionItem.nextElementSibling;
      if (nextItem) {
         questionsContainer.insertBefore(nextItem, questionItem);
         updateQuestionIndexes();
      }
   }

   function deleteQuestionItem(questionItem) {
      questionItem.remove();
      updatequestionCounter();
      updateQuestionIndexes();
   }

   function updateQuestionIndexes() {
      document.querySelectorAll(".question-item").forEach((question, index) => {
         let indexElement = question.querySelector(".question-index")
         indexElement.textContent = `${index + 1}.`;
      })
   }

   function saveQuiz() {
      // Supprimer les erreurs visuelles précédentes
      document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error"));

      let questions = [];
      let quizTitleInput = document.querySelector(".admin-quiz-title");
      quizTitle = quizTitleInput ? quizTitleInput.value.trim() : "";

      // Vérification du titre du quiz
      if (!quizTitle) {
         setTimeout(() => {
            alert("Quiz title is empty.");
            }, 100);
         quizTitleInput.classList.add("input-error");
         return;
      }

      let isValid = true;

      document.querySelectorAll(".question-item").forEach((questionItem, index) => {
         let questionInput = questionItem.querySelector(".admin-question-input");
         let questionText = questionInput.value.trim();

         // Vérification de la question
         if (!questionText) {
            questionInput.classList.add("input-error");
            alert(`Question ${index + 1}: question is empty.`);
            isValid = false;
            return;
         }

         let questionWeightInput = questionItem.querySelector(".weighting-input");
         let questionWeight = questionWeightInput.value.trim();

         // Vérification de la pondération
         if (!questionWeight) {
            questionWeightInput.classList.add("input-error")
            alert(`Question ${index + 1}: Must have a wighting.`);
            isValid = false;
            return;
         }

         let answerElement = questionItem.querySelector(".answer-item");
         let questionType = answerElement.querySelector("textarea") ? "text" :
                            answerElement.querySelector("input[type='radio']") ? "single" :
                            answerElement.querySelector("input[type='checkbox']") ? "multiple" :
                            null;

         let answers = [];
         let hasValidAnswer = false;

         if (questionType === "text") {
            let answerTextArea = answerElement.querySelector(".answer-text-content");
            let answerValue = answerTextArea.value.trim().toLowerCase();
            if (!answerValue) {
               answerTextArea.classList.add("input-error");
               alert(`Question ${index + 1}: answers can't be empty.`);
               isValid = false;
               return;
            }
            answers.push({ type: "text", value: answerValue });
            hasValidAnswer = true;
         } else {
            answerElement.querySelectorAll(".answer-option").forEach(option => {
               let answerInput = option.querySelector(".answer-option-input");
               let answerText = answerInput.value.trim();
               let isCorrect = option.querySelector("input").checked;

               if (answerText) {
                     answers.push({
                        type: questionType,
                        value: answerText,
                        correct: isCorrect
                     });
                     hasValidAnswer = true;
               } else {
                     answerInput.classList.add("input-error");
               }
            });

            // Vérifier si au moins une réponse est sélectionnée
            if (questionType !== "text") {
               let hasCorrectAnswer = false;
            
               for (let i = 0; i < answers.length; i++) {
                  if (answers[i].correct) {
                     hasCorrectAnswer = true;
                     break;
                  }
               }
            
               if (!hasCorrectAnswer) {
                  alert(`No answers selected on question ${index + 1}.`);
                  isValid = false;
                  return;
               }
            }
         }

         questions.push({
            index: index + 1,
            text: questionText,
            type: questionType,
            answers: answers,
            weighting: questionWeight
         });
      });

      if (!isValid) return;

      let quizData = {
            title: quizTitle,
            questions: questions
      };

      let quizName = quizTitle;
      
      localStorage.setItem(quizName, JSON.stringify(quizData));
      document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error"));
      alert("Quiz saved.");
   }

   function generatePDF() {
      let quizTitle = document.querySelector(".admin-quiz-title")?.value.trim() || "Quiz - No Name";

      let questions = [];
      document.querySelectorAll(".question-item").forEach((questionItem, index) => {
         let questionText = questionItem.querySelector(".admin-question-input").value.trim();
         let questionWeight = questionItem.querySelector(".weighting-input").value.trim();
         let questionType = questionItem.querySelector("textarea") ? "Text" :
                           questionItem.querySelector("input[type='radio']") ? "Single" :
                           questionItem.querySelector("input[type='checkbox']") ? "Multiple" : "Unknown";

         let answers = [];
         if (questionType === "Text") {
            let answerText = questionItem.querySelector(".answer-text-content").value.trim();
            answers.push(answerText);
         } else {
            questionItem.querySelectorAll(".answer-option").forEach(option => {
               let answerText = option.querySelector(".answer-option-input").value.trim();
               let isCorrect = option.querySelector("input").checked;
               answers.push(`${answerText}${isCorrect ? "   [ x ]" : "   [    ]"}`);
            });
         }

         questions.push({
            index: index + 1,
            text: questionText,
            type: questionType,
            weighting: questionWeight,
            answers: answers
         });
      });

      if (questions.length === 0) {
         alert("Quiz is empty.");
         return;
      }

      // Construire le contenu du document PDF
      let docDefinition = {
         content: [
            { text: quizTitle, style: "header" },
            { text: "\n" },
            {
               table: {
                  headerRows: 1,
                  widths: ["auto", "*", "auto", "auto", "*"],
                  body: [
                     [
                        { text: "#", style: "tableHeader" },
                        { text: "Question", style: "tableHeader" },
                        { text: "Type", style: "tableHeader" },
                        { text: "Weighting", style: "tableHeader" },
                        { text: "Answers", style: "tableHeader" }
                     ],
                     ...questions.map(q => [
                        q.index,
                        q.text,
                        q.type,
                        q.weighting,
                        q.answers.length ? q.answers.join("\n") : "No answers"
                     ])
                  ]
               },
               layout: "lightHorizontalLines"
            }
         ],
         styles: {
            header: { fontSize: 18, bold: true, alignment: "center" },
            tableHeader: { bold: true, fontSize: 12, fillColor: "#eeeeee" }
         }
      };

      // Générer et télécharger le PDF
      pdfMake.createPdf(docDefinition).download(`${quizTitle}.pdf`);
   }

   saveQuizButton.addEventListener("click", saveQuiz)
   downloadButton.addEventListener("click", generatePDF)
   resetQuizButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all questions?")) {
         localStorage.clear();
         questionsContainer.innerHTML = "";
         questionCounter = 0;
         displayQuestionsAdmin();
      }
   })

   startQuizBtn.addEventListener("click", startQuiz)

   function startQuiz() {
      let quizData = null;

      // Parcourir le localStorage pour trouver un quiz
      for (let i = 0; i < localStorage.length; i++) {
         let key = localStorage.key(i);
         let storedData = localStorage.getItem(key);

         try {
               let parsedData = JSON.parse(storedData);
               if (parsedData && parsedData.questions && parsedData.questions.length > 0) {
                  quizData = parsedData;
                  break; // On prend le premier quiz trouvé
               }
         } catch (e) {
               console.warn(`Impossible de lire les données de ${key}`);
         }
      }

      if (!quizData) {
         alert("Quiz not found. Please save the quiz before starting.");
         return;
      }

      let quizTitle = quizData.title;
      let totalQuestions = quizData.questions.length;
      maximumScore = calculateQuizScore(quizData);
      userScore = 0; // Réinitialisation du score utilisateur
      questionCounter = 0; // Réinitialisation du compteur de questions

      if (!quizData.questions || totalQuestions === 0) {
         alert("No questions in this quiz.");
         return;
      }

      startQuizBtn.classList.toggle("hidden");
      document.querySelector(".quiz-game-container").classList.toggle("hidden");

      quizTitleDisplay.textContent = quizTitle;
      let currentQuestionIndex = 0;
      displayQuestion(quizData.questions, currentQuestionIndex);

      submitAnswerBtn.addEventListener("click", () => {
         let question = quizData.questions[currentQuestionIndex];
         if (validateAnswerInput(question)) {
            validateAnswer(question);
            nextBtn.classList.remove("hidden");
            submitAnswerBtn.classList.add("hidden");
         }
      });

      nextBtn.addEventListener("click", () => {
         currentQuestionIndex++;
         if (currentQuestionIndex < totalQuestions) {
            displayQuestion(quizData.questions, currentQuestionIndex);
            resetQuestionUI();
            renderProgressionBar(currentQuestionIndex, totalQuestions);
         } else {
            renderProgressionBar(currentQuestionIndex, totalQuestions);
            endQuiz();
         }
      });
   }

   function calculateQuizScore(quizData) {
      let totalScore = 0;
      quizData.questions.forEach(question => {
         totalScore += Number(question.weighting);
      });
      return totalScore;
   }

   function displayQuestion(questions, index) {
      let questionData = questions[index];

      quizTracker.textContent = `Question ${index + 1} of ${questions.length}`;

      quizQuestion.textContent = `${index + 1}. ${questionData.text}`;
      quizAnswersContainer.innerHTML = "";

      if (questionData.type === "text") {
         let textInput = document.createElement("textarea");
         textInput.classList.add("user-answer-text");
         quizAnswersContainer.appendChild(textInput);
      } else {
         questionData.answers.forEach((answer, i) => {
            let answerOption = document.createElement("div");
            answerOption.classList.add("quiz-answer-option");

            let answerId = `answer-option-${index}-${i}`;
            let type = questionData.type === "single" ? "radio" : "checkbox";
            let name = "quiz-answer";

            answerOption.innerHTML = `
               <input type="${type}" id="${answerId}" name="${name}">
               <label for="${answerId}" class="custom-answer-select">
                  <i class="fa-solid fa-check"></i>
               </label>
               <label>${answer.value}</label>
            `;

            quizAnswersContainer.appendChild(answerOption);
         });
      }
   }

   function renderProgressionBar(currentQuestionIndex, totalQuestions) {
      let width = Math.round((currentQuestionIndex / totalQuestions) * 100);
      progressionBar.style.width = `${width}%`;
   }

   function validateAnswerInput(question) {
      let isValid = false;

      if (question.type === "text") {
         let userAnswer = document.querySelector(".user-answer-text").value.trim();
         if (userAnswer) {
            isValid = true;
         } else {
            alert("Please enter an answer.");
         }
      } else {
         let selectedAnswers = Array.from(quizAnswersContainer.querySelectorAll("input:checked"));
         if (selectedAnswers.length > 0) {
            isValid = true;
         } else {
            alert("Please select at least one answer.");
         }
      }

      return isValid;
   }

   function validateAnswer (question) {
      let questionScore = Number(question.weighting);

      if (question.type === "text") {
         let userAnswer = document.querySelector(".user-answer-text").value.trim().toLowerCase();
         let validAnswer = question.answers[0].value;

         if (userAnswer === validAnswer) {
            userScore += questionScore;
            document.querySelector(".user-answer-text").classList.add("correct-border")
            correctAnswer.classList.remove("hidden")
         } else {
            document.querySelector(".user-answer-text").classList.add("wrong-border")
            wrongAnswer.classList.remove("hidden")
         }
      } else {
         let selectedAnswers = Array.from(quizAnswersContainer.querySelectorAll("input:checked"));
         let correctAnswers = question.answers.filter(answer => answer.correct);
         let correctValues = correctAnswers.map(answer => answer.value);

         let userSelectedValues = selectedAnswers.map(input => 
            input.parentElement.querySelector("label:last-of-type").textContent.trim()
         );

         let isCorrect = correctValues.length === userSelectedValues.length && 
                           userSelectedValues.every(value => correctValues.includes(value));

         // Ajout des classes aux réponses correctes
         quizAnswersContainer.querySelectorAll(".quiz-answer-option").forEach(option => {
            let label = option.querySelector("label:last-of-type");
            let answerText = label.textContent.trim();

            if (correctValues.includes(answerText)) {
               option.classList.add("correct-border");
            }

            if (userSelectedValues.includes(answerText) && !correctValues.includes(answerText)) {
               option.classList.add("wrong-border");
            }
         });

         if (isCorrect) {
            userScore += questionScore;
            correctAnswer.classList.remove("hidden");
         } else {
            wrongAnswer.classList.remove("hidden");
         }
      }
   }

   function resetQuestionUI() {
      correctAnswer.classList.add("hidden");
      wrongAnswer.classList.add("hidden");
      nextBtn.classList.add("hidden");
      submitAnswerBtn.classList.remove("hidden");
   }

   function endQuiz() {
      let scoreContainer = document.querySelector(".final-score");
      scoreContainer.textContent = `Your score: ${userScore} / ${maximumScore}`;
      endQuizContainer.classList.remove("hidden");
      restartQuizBtn.addEventListener("click", () => {
         endQuizContainer.classList.add("hidden");
         startQuiz();
      });
      editQuizBtn.addEventListener("click", () => {
         endQuizContainer.classList.add("hidden")
         isAdmin = !isAdmin;
         updateDisplay();
      })
   }
});