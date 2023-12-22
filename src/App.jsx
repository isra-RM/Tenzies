import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem("records")) || []
  );
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const startTime = new Date();

  useEffect(() => {
    const allHeld = dice.every((item) => item.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((item) => item.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setRecords((prevRecords) => [...prevRecords, time]);
      localStorage.setItem("records", JSON.stringify(records));
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      const endTime = new Date();
      setTime((prevTime) =>
        Math.round(
          prevTime +
            Math.abs(endTime.getTime() - startTime.getTime()) / 1000 +
            Number.EPSILON
        )
      );
      setCount((oldCount) => oldCount + 1);
      setDice((oldDice) =>
        oldDice.map((item) => {
          return item.isHeld ? item : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setCount(0);
      setTime(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((item) => {
        return item.id === id ? { ...item, isHeld: !item.isHeld } : item;
      })
    );
  }

  const diceElements = dice.map((item) => (
    <Die
      key={item.id}
      value={item.value}
      isHeld={item.isHeld}
      holdDice={() => holdDice(item.id)}
    />
  ));

  return (
    <main>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <div className="stats-container">
        <h5>Total Rolls: {count}</h5>
        <h5>Time Elapsed: {time} s</h5>
        <h5>Best Time: {records ? records.sort()[0] : 0} s</h5>
      </div>
    </main>
  );
}
