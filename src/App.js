//import logo from './logo.svg';
import './App.css';
import {useState,useRef} from 'react';
import {GroupBy} from './GroupBy';
import {WordOutput} from './WordOutput'

function App() {
  const [savearray, setarray] = useState(new Set());
  const [description, setdesc] = useState('');
  const [output, setoutput] = useState('');
  const inputword = useRef();
  function saveword(word){
    // save new word into array
    console.log(word);
    setarray(oarray => new Set(oarray).add(word));
  }

  async function updaterhyme(){
    // update words rhyme with
    let rhymeurl='https://api.datamuse.com/words?rel_rhy='+inputword.current.value;
    setdesc(`Words that rhyme with ${inputword.current.value}:`);
    setoutput(<span>...loading</span>); // while loading page
    const rhymes = await fetch(rhymeurl);
    const result = await rhymes.json(); // parse the result
    setoutput('');
    if(result.length){
        const groupresult=GroupBy(result, 'numSyllables');
        //console.log(groupresult)
        const wordlist=[] // list for syllables
        for(let wordkey in groupresult){
            wordlist.push(<h3 key={wordkey}>{`Syllables: ${wordkey}`}</h3>);
            const onesyllable=(groupresult[wordkey].map((item) => 
            <WordOutput onSave={()=>saveword(item.word)} // save button added
            word={item.word} // display the word
            key={item.word}/>)); // give a key
            wordlist.push(<ul key={wordkey+"list"}>{onesyllable}</ul>);
        }
        setoutput(wordlist);
    } else {
      setoutput(<span>(no results)</span>);
    }
  }

  async function updatesyn(){
    let synurl = 'https://api.datamuse.com/words?ml='+inputword.current.value;
    setdesc(`Words with a similar meaning to ${inputword.current.value}:`);
    setoutput(<span>...loading</span>);
    const syn = await fetch(synurl);
    const result = await syn.json();
    setoutput('');
    //console.log(result)
    if(result.length){
      const syn=result.map((item) => 
      <WordOutput onSave={()=>saveword(item.word)} 
      word={item.word}
      key={item.word}/>);
      setoutput(<ul>{syn}</ul>);
    } else {
      setoutput(<span>(no results)</span>);
    }
  }

  function keydown(event) {
    // enter function
    if(event.keyCode===13) {
        updaterhyme();
    }
  }

  return (
    <main className="container">
    <h1 className="row">Rhyme Finder (579 Problem Set 6)</h1>
    <div className="row">
            <div className="col"><a href='https://github.com/KiLiG-fcx/SI579-hw6/tree/main'>my source code</a></div>
        </div>
    <div className="row">
        <div className="col">Saved words: <span>{savearray.size ? Array.from(savearray).join(', ') : '(none)'}</span></div>
    </div>
    <div className="row">
        <div className="input-group col">
            <input className="form-control" 
            type="text" 
            placeholder="Enter a word" 
            onKeyDown={keydown} 
            ref={inputword} />
            <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => updaterhyme()}>Show rhyming words</button>
            <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => updatesyn()}>Show synonyms</button>
        </div>
    </div>
    <div className="row">
        <h2 className="col">{description}</h2>
    </div>
    <div className="output row">
        <output className="col">{output}</output>
    </div>
    </main>
  );
}

export default App;
