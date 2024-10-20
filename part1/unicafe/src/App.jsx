import { useState } from "react";

const StatisticLine = ({text, value}) =>(
  <div>
    {text}: {value}
  </div>

)

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  return (
    <div>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="total" value={total} />
      <StatisticLine text="average" value={average.toFixed(2)} />
      <StatisticLine text="positive" value={positive.toFixed(2) + "%"} />
    </div>
  )
}

const Button = ({handleClick, text}) =>(
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const total = good + neutral + bad

  const calculateAverage = () => {
    return total > 0 ? (good - bad) / total : 0
  };

  const calculatePositivePercentage = () => {
    return total > 0 ? (good / total) * 100 : 0
  };

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  };

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  };

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)

  };

  return (
    <div>
      <h1>give feedback </h1>
      <Button handleClick={handleGood} text = 'good' />
      <Button handleClick={handleNeutral} text = 'neutral' />
      <Button handleClick={handleBad} text = 'bad' />
      

      <h1>statistics</h1>
      {total === 0 ? (
        <div>No feedback given</div>
      ) : (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          average={calculateAverage()}
          positive={calculatePositivePercentage()}
        />
      )}
    </div>
  )
}

export default App
