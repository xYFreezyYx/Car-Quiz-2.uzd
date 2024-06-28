import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';
import './App.css';

import image1 from './assets/ford-focus-2014.jpg';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const imageMap = {
  'image1.jpg': image1,
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    const loadQuestions = () => {
      const updatedQuestions = questionsData.map((question) => ({
        ...question,
        imgSrc: imageMap[question.imgSrc] || question.imgSrc,
      }));
      setQuestions(updatedQuestions);
      setShuffledAnswers(shuffleArray([...updatedQuestions[0].answerOptions]));
    };

    loadQuestions();

    const savedResults = JSON.parse(localStorage.getItem('quizResults'));
    if (savedResults) {
      setScore(savedResults.score);
      setShowScore(true);
    }
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setShuffledAnswers(shuffleArray([...questions[currentQuestion].answerOptions]));
    }
  }, [currentQuestion, questions]);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      const timeTaken = Date.now() - startTime;
      const quizResults = {
        score,
        maxScore: questions.length,
        timeTaken,
      };
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setStartTime(Date.now());
  };

  return (
    <div className="quiz">
      {showScore ? (
        <div className="score-section">
          <p>You scored {score} out of {questions.length}</p>
          <p>Time taken: {((Date.now() - startTime) / 1000).toFixed(2)} seconds</p>
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      ) : (
        questions.length > 0 && (
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">{questions[currentQuestion].questionText}</div>
            <img src={questions[currentQuestion].imgSrc} alt="Car" />
            <div className="answer-section">
              {shuffledAnswers.map((answerOption, index) => (
                <button onClick={() => handleAnswerOptionClick(answerOption.isCorrect)} key={index}>
                  {answerOption.answerText}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Quiz;