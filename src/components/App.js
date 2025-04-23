import React from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";
import { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // Add this line to debug
        setQuestions(data);
      });
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  return (
    <div>
      <h1>Quiz Questions</h1>
      <QuestionForm onAddQuestion={handleAddQuestion} />
      <QuestionList questions={questions} setQuestions={setQuestions} />
    </div>
  );
}

export default App;
