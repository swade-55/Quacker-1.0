import { db } from "../Firebase.js"

let addToy = false;


function fetchToys(){
  return fetch(` http://localhost:3000/toys`)
  .then(res=>res.json())
  .then(data=>renderToys(data))
};



function renderToys(toys){
  const toyCollection = document.getElementById('toy-collection');
  toys.forEach(toy=>{
    const toyDiv = document.createElement('div');
    const toyH2 = document.createElement('h2');
    const toyImage = document.createElement('img');
    const toyButton = document.createElement('button');
    toyButton.addEventListener('click',(e)=>{
      fetch(`http://localhost:3000/toys/${toy.id}`,{
        method: 'PATCH',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({likes: toy.likes+1})
      })
      .then((data)=>data.json())
      .then(res => {
        toy.likes = res.likes
        toyLikes.textContent = res.likes
   })   
    })
    const toyLikes = document.createElement('p');
    toyLikes.textContent = toy.likes;
    toyButton.textContent = 'like';
    toyButton.classList.add('like-btn');
    toyButton.setAttribute('id',toy.id);
    toyImage.src = toy.image;
    toyImage.classList.add('toy-avatar');
    toyDiv.appendChild(toyImage);
    toyH2.textContent = toy.name;
    toyDiv.appendChild(toyH2);
    toyDiv.appendChild(toyButton);
    toyDiv.appendChild(toyLikes);
    toyDiv.classList.add('card');
    toyCollection.appendChild(toyDiv);
  })
}


document.addEventListener("DOMContentLoaded", () => {
  fetchToys();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


let createToy = document.getElementsByClassName('add-toy-form')[0];
createToy.addEventListener('submit',(e)=>{
  e.preventDefault()  
  let toyObject = {
    name: document.getElementsByClassName('add-toy-form')[0].childNodes[3].value,
    image: document.getElementsByClassName('add-toy-form')[0].childNodes[7].value,
    likes: 0,
  }
  addNewToy(toyObject);
});


function addNewToy(toyObject){
  return fetch(`http://localhost:3000/toys`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toyObject)
  })
  .then(res=>res.json())
  .then(toy=>renderToys([toy]))
}
