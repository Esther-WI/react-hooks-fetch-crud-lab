import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });
  const [errors, setErrors] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name.startsWith("answer")) {
      const index = parseInt(name.replace("answer", ""));
      const updatedAnswers = [...formData.answers];
      updatedAnswers[index] = value;
      setFormData({ ...formData, answers: updatedAnswers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function validateForm() {
    const newErrors = [];

    if (!formData.prompt.trim()) {
      newErrors.push("Prompt cannot be empty");
    }

    if (formData.answers.some((answer) => !answer.trim())) {
      newErrors.push("All answer fields must be filled");
    }

    if (
      formData.answers.some(
        (answer, index) =>
          formData.answers.indexOf(answer) !== index && answer.trim()
      )
    ) {
      newErrors.push("Answers must be unique");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.prompt,
        answers: formData.answers,
        correctIndex: parseInt(formData.correctIndex),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create question");
        return res.json();
      })
      .then((newQuestion) => {
        onAddQuestion(newQuestion);
        // Reset form after successful submission
        setFormData({
          prompt: "",
          answers: ["", "", "", ""],
          correctIndex: 0,
        });
        setErrors([]);
      })
      .catch((error) => {
        setErrors([...errors, error.message]);
      });
  }

  return (
    <section>
      <h2>Add a New Question</h2>

      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {error}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
          />
        </label>

        {formData.answers.map((answer, index) => (
          <label key={index}>
            Answer {index + 1}:
            <input
              type="text"
              name={`answer${index}`}
              value={answer}
              onChange={handleChange}
              required
            />
          </label>
        ))}

        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {formData.answers.map((_, index) => (
              <option
                key={index}
                value={index}
                disabled={!formData.answers[index].trim()}
              >
                {formData.answers[index].trim() || `Answer ${index + 1}`}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
