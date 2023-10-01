// import { db } from "../Firebase.js"

let addQuack = false;


function fetchQuacks(){
  return fetch(`http://localhost:3000/quacks`)
  .then(res=>res.json())
  .then(data=>renderQuacks(data))
};



function renderQuacks(quacks){
  const quackCollection = document.getElementById('quack-collection');
  quacks.forEach(quack=>{
    const quackDiv = document.createElement('div');
    const quackH2 = document.createElement('h2');
    const quackContent = document.createElement('p');
    const quackButton = document.createElement('button');
    quackButton.addEventListener('click',(e)=>{
      fetch(`http://localhost:3000/quacks/${quack.id}`,{
        method: 'PATCH',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({likes: quack.likes+1})
      })
      .then((data)=>data.json())
      .then(res => {
        quack.likes = res.likes
        quackLikes.textContent = res.likes
   })   
    })
    const quackLikes = document.createElement('p');
    quackLikes.textContent = quack.likes;
    quackButton.textContent = 'Like';
    quackButton.classList.add('like-btn');
    quackButton.setAttribute('id',quack.id);
    quackH2.textContent = quack.name;
    quackDiv.appendChild(quackH2);
    quackContent.textContent = quack.postContent
    quackDiv.appendChild(quackContent);
    quackDiv.appendChild(quackButton);
    quackDiv.appendChild(quackLikes);
    quackDiv.classList.add('card');
    quackCollection.appendChild(quackDiv);
  })
}


document.addEventListener("DOMContentLoaded", () => {
  fetchQuacks();
  const addBtn = document.querySelector("#new-quack-btn");
  const quackFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addQuack = !addQuack;
    if (addQuack) {
      quackFormContainer.style.display = "block";
    } else {
      quackFormContainer.style.display = "none";
    }
  });
});


let createQuack = document.getElementsByClassName('add-quack-form')[0];
createQuack.addEventListener('submit',(e)=>{
  e.preventDefault()  
  let quackObject = {
    name: document.getElementsByClassName('add-quack-form')[0].childNodes[3].value,
    postContent: document.getElementsByClassName('add-quack-form')[0].childNodes[7].value,
    likes: 0,
  }
  addNewQuack(quackObject);
});


function addNewQuack(quackObject){
  return fetch(`http://localhost:3000/quacks`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quackObject)
  })
  .then(res=>res.json())
  .then(quack=>renderQuacks([quack]))
}
