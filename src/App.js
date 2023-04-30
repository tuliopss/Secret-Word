//REACT
import {useCallback, useEffect, useState} from 'react';

//data
import {wordsList} from './data/words'


//CSS
import './App.css';

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}
]

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
  
  const pickWordAndCategory = useCallback(() => {
    //Pega as keys do array wordsList
    const categories = Object.keys(words);

    //Pega uma key aleatoria apartir do indice
    const category = categories[ Math.floor(Math.random() * Object.keys(categories).length )];
    console.log(category);

    //Pega uma palavra aleatoria da categoria sorteada
    const word = words[category][Math.floor(Math.random() * words[category].length )]
    console.log(word);

    return {word, category}
      
  }, [words])

  const startGame = useCallback(() => {
    clearLettersStates();
    
    const {word, category} = pickWordAndCategory()
    console.log(word, category);

    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    console.log(wordLetters);

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = (letter) => {
      const normalizedLetter = letter.toLowerCase();

      //Check if letter has already been utilized
      if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
        return;
      }

      if(letters.includes(normalizedLetter)) {
        setGuessedLetters( (actualGuessedLetters) => [ ...actualGuessedLetters, normalizedLetter ])
      } else {
        setWrongLetters((actualWrongLetters) => [  ...actualWrongLetters, normalizedLetter ])

        setGuesses((actualGuesses) => actualGuesses -1)
      }
  }

  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //Check if guesses ended
  useEffect( () => {
    if(guesses <=0) {
        clearLettersStates()
        setGameStage(stages[2].name)
    }
  }, [guesses]  )

  //Check win condition
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];
    console.log(uniqueLetters);

    if (guessedLetters.length === uniqueLetters.length) {
        setScore((actualScore) => actualScore += 100);

        startGame();

    }
  }, [guessedLetters, letters, startGame])


  const restartGame = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
        {gameStage === 'start' && <StartScreen startGame = {startGame}/>}
        {gameStage === 'game' && <Game verifyLetter = {verifyLetter}
         pickedWord = {pickedWord} 
         pickedCategory = {pickedCategory}
         letters = {letters}
         guessedLetters = {guessedLetters}
         wrongLetters = {wrongLetters} 
         guesses = {guesses}
         score = {score}           />}
        {gameStage === 'end' && <GameOver restartGame={restartGame} score={score}/>}
    </div>
  );
}

export default App;
