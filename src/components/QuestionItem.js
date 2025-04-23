function QuestionItem({ question, onDelete, onUpdate }) {
  function handleDelete() {
    onDelete(question.id);
  }

  function handleCorrectAnswerChange(e) {
    const newCorrectIndex = parseInt(e.target.value);

    fetch(`http://localhost:4000/questions/${question.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correctIndex: newCorrectIndex,
      }),
    })
      .then((res) => res.json())
      .then((updatedQuestion) => onUpdate(updatedQuestion));
  }

  return (
    <li>
      <h3>{question.prompt}</h3>
      <ul>
        {question.answers.map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
      <div>
        <span>Correct Answer: </span>
        <select
          value={question.correctIndex}
          onChange={handleCorrectAnswerChange}
        >
          {question.answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default QuestionItem;
