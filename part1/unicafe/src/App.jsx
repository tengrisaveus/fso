import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [sum, setSum] = useState(0)

  const calculateAverage = () => {
    return total > 0 ? sum / total : 0
  };

  const calculatePositivePercentage = () => {
    return total > 0 ? (good / total) * 100 : 0
  };

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad)
    setSum(sum + 1)
  };

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + updatedNeutral + bad)
  };

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(good + neutral + updatedBad)
    setSum(sum - 1)
  };

  return (
    <div>
      <h1>give feedback </h1>
      <button onClick={handleGood}>good</button>
      <button onClick={handleNeutral}>neutral</button>
      <button onClick={handleBad}>bad</button>

      <h1>statistics</h1>
      {total > 0 ? (
        <div>
          <p>good {good} </p>
          <p>neutral {neutral} </p>
          <p>bad {bad} </p>
          <p>all {total} </p>
          <p>average {calculateAverage()} </p>
          <p>positive {calculatePositivePercentage()}% </p>
        </div>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  )
}

export default App
