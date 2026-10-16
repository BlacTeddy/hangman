import {CooldownQueue} from './models/shuffle.js';

const level = document.querySelectorAll<HTMLInputElement>("input[name='level']");   
const keys = document.querySelectorAll<HTMLButtonElement>('.key-btn');
const addWord = document.getElementById('word') as HTMLDivElement;
// const n = Math.floor(Math.random()*32)+1; 
let newWord:string;  
let hang:number = 0;
let count:number = 0;

const myWord = {   
    beginner: ['cat','dog','sun','hat','cup','red','big','map','fly','bed','arm','box','car','egg','fan','hot','ice','jar','key','leg','net','oak','pen','rug','saw','tea','van','web','zip','bug','dip','fog'],
    easy: ['duck','jazz','plum','folk','milk','quiz','chef','golf','bark','judo','wind','mask','crow','lung','yawn','cuba','wobbly','fluffy','cymbal','backup','puzzle','clutch','hiccup','vacuum','hockey','jumper','bucket','subway','galaxy','valley','pillow','hummus'],
    medium: ['elephant','kitchen','blanket','dolphin','captain','brother','chicken','diamond','evening','freedom','glacier','helpful','journey','kingdom','machine','nothing','painted','quickly','rainbow','shelter','teacher','uniform','village','welcome','battery','century','display','fifteen','gravity','harvest','inspect','justice'],
    hard: ['algorithm','anonymous','broccoli','chrysalis','democracy','eccentric','frequency','gymnasium','hemisphere','juggernaut','kidnapping','motorcycle','necessary','obsession','psychology','quarterly','rhinoceros','saxophone','technology','ubiquitous','vulnerable','xylophone','zigzagging','bureaucracy','citizenship','development','embarrassing','fluorescent','gingerbread','hieroglyphics','intelligence','jeopardizing']
} 

function rightWord(button:string, indexWord:string){
    const index:number = indexWord.indexOf(button)//number
    if(index === -1){
        // console.log(`nothing left in ${indexWord}`);
        return;
    } 
    // console.log(`user-press: ${button} w/ ${indexWord}`) 
    const spans = addWord.querySelectorAll('span');
    if (spans[index]) {
    spans[index].innerHTML = button;
}
    return(rightWord(button, indexWord.slice(index+1) )) 
}
function pickLetter(button:string){ 
    // for button in newWord;    
    if(newWord.includes(button)){
        count += 1;
        rightWord(button, newWord);
    }else{
        const manelement = document.getElementsByClassName("manbody")[hang] as HTMLElement;  
        // console.log(document.getElementsByClassName("manbody")[hang]); 
        // console.log(manelement);  
        manelement.style.visibility = "visible";
        hang += 1;
    } 
    console.log(`test-hang: ${hang}`) ; 
    for(let i=0;i<=hang;i++){  
        console.log(`i:${i}`) 
        // newMan[i]!.style.visibility = 'hidden'; 
    } 
    console.log(`count & ${count}`) 
}
function checkRadioButton(){
    const checkedDifficulty = document.querySelector("input[name='level']:checked") as HTMLInputElement; 
    if (checkedDifficulty) {    
        keys.forEach((btn) => {
            btn.removeAttribute('disabled')  ;  
        }) 
    hang = 0;
    count = 0;
    }
}
function reset(){
    const checkedDifficulty = document.querySelector("input[name='level']:checked") as HTMLInputElement;
    const newMan = document.querySelectorAll<HTMLSpanElement>('.manbody');
    const newMessage:string = 'new game?';

    // console.log(`check?: ${checkedDifficulty.checked}`) 
    if(checkedDifficulty){
        checkedDifficulty.checked = false;
    }
    keys.forEach((btn) => {
            btn.setAttribute('disabled','true')  ;  
        }) 
    addWord.innerHTML = '';
    for(let i=0;i< newMessage.length;i++){ 
        const span = document.createElement("span");
            span.className = "letter"; 
            span.innerHTML = newMessage[i] ?? '';
            addWord.appendChild(span); 
    }
    if(hang>0){
        count = 0; 
        console.log(`reset-count: ${count}`)
        console.log(`reset-hang:${hang}`) 
        for(let i=0;i<hang;i++){   
            console.log(`i:${i} & ${hang}`)
            console.log(newMan[i]); 
            newMan[i]!.style.visibility = 'hidden'; 
        }
        hang = 0;  
    }else{ 
        count = 0; 
        console.log(`not-reset-count: ${count}`)
        console.log(`not-reset-hang:${hang}`)
    } 

    const endPrompt = document.getElementById('alert') as HTMLElement;
    endPrompt.addEventListener('click',()=>{
        endPrompt.classList.add('vis'); 
    }) 
}
function winCheck(){
    const spans = addWord.querySelectorAll('span');
    spans.forEach((e)=>{
        if(e.textContent === '' && hang >= 7){ 
            // console.log(`span: ${e.textContent}`); 
            const loss = document.getElementById('alert') as HTMLElement;
            const head = loss.querySelector('h2') as HTMLHeadingElement; 
            head.innerHTML = "Try Again?";   
            loss.classList.remove('vis');
            console.log(`count: ${count}`);    
            console.log(`hang: ${hang}`);     
            reset();   
        }else if(e.textContent !== '' && count === spans.length){    
            const win = document.getElementById('alert') as HTMLElement; 
            const head = win.querySelector('h2') as HTMLHeadingElement;
            head.innerHTML = "Winner!";  
            win.classList.remove('vis'); 
            reset();  
            console.log(`count: ${count}`);      
            console.log("User WON"); 
        }
    })
    return;
}

// Disable Keyboard Keys 
keys.forEach((btn) => { 
    btn.addEventListener('click', ()=>{ 
        console.log(`user-press: ${btn.innerHTML}`); 
        btn.setAttribute('disabled','true');
        pickLetter(btn.innerHTML);  
        // console.log(`${btn.classList}`);   
        winCheck();   
    })  
});    

// Picking a Difficulty
level.forEach((radio)=>{
    radio.addEventListener('change', ()=>{
        const diff = radio.value;
        //Pick Guess Word
        const Pick = new CooldownQueue<string>(myWord[diff as keyof typeof myWord], 3); 
        newWord = Pick.getNext();
        // console.log(`new-word: ${newWord}`); 
        checkRadioButton();
 
        // Putting Guess Word on Page
        addWord.innerHTML = '';
        for(let i=0;i< newWord?.length;i++){ 
            const span = document.createElement("span");
            span.className = "letter"; 
            // span.classList.add("vis");     
            // span.textContent = newWord?.slice(i,i+1);    
            addWord.appendChild(span); 
        }        
    })
})


// addWord.style.backgroundColor = 'red';   
// addWord.innerHTML = '<span class="letter">b</span>';

/*---------------------------------------------------------------------------*/
// const Pick = new CooldownQueue<string>(myWord[diff as keyof typeof myWord], 3); 
// let newWord:string = easy[n] ?? '';
// let newWord:string = Pick.getNext();
/*
for(let i=0;i< newWord?.length;i++){
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = newWord?.slice(i,i+1);
    addWord.appendChild(span); 
}*/
/*---------------------------------------------------------------------------*/
