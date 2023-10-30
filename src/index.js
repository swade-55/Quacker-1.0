//  import { db } from "../Firebase.js"
//  import { doc, addDoc, getDocs, collection,increment } from "firebase/firestore";

// let addQuack = false;

// function fetchQuacks(){
//   console.log("Fetching quacks")
//   return getDocs(collection(db, "Quacks"))
//   .then(res=>res.json())
//   .then(data=>renderQuacks(data))
// };



// function renderQuacks(quacks){
//   const quackCollection = document.getElementById('quack-collection');
//   quacks.forEach(quack=>{
//     const quackDiv = document.createElement('div');
//     const quackH2 = document.createElement('h2');
//     const quackContent = document.createElement('p');
//     const quackButton = document.createElement('button');
//     quackButton.addEventListener('click',(e)=>{
//       updateDoc(doc(db, "Quacks", quack.id), {
//         Likes: increment(1),
//       })
//       .then((data)=>data.json())
//       .then(res => {
//         quack.likes = res.likes
//         quackLikes.textContent = res.likes
//    })   
//     })
//     const quackLikes = document.createElement('p');
//     quackLikes.textContent = quack.likes;
//     quackButton.textContent = 'Like';
//     quackButton.classList.add('like-btn');
//     quackButton.setAttribute('id',quack.id);
//     quackH2.textContent = quack.name;
//     quackDiv.appendChild(quackH2);
//     quackContent.textContent = quack.postContent
//     quackDiv.appendChild(quackContent);
//     quackDiv.appendChild(quackButton);
//     quackDiv.appendChild(quackLikes);
//     quackDiv.classList.add('card');
//     quackCollection.appendChild(quackDiv);
//   })
// }


// document.addEventListener("DOMContentLoaded", () => {
//   fetchQuacks();
//   const addBtn = document.querySelector("#new-quack-btn");
//   const quackFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addQuack = !addQuack;
//     if (addQuack) {
//       quackFormContainer.style.display = "block";
//     } else {
//       quackFormContainer.style.display = "none";
//     }
//   });
// });


// let createQuack = document.getElementsByClassName('add-quack-form')[0];
// createQuack.addEventListener('submit',(e)=>{
//   e.preventDefault()  
//   let quackObject = {
//     name: document.getElementsByClassName('add-quack-form')[0].childNodes[3].value,
//     postContent: document.getElementsByClassName('add-quack-form')[0].childNodes[7].value,
//     likes: 0,
//   }
//   addNewQuack(quackObject);
// });


// function addNewQuack(quackObject){
//   return fetch(`http://localhost:3000/quacks`,{
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(quackObject)
//   })
//   .then(res=>res.json())
//   .then(quack=>renderQuacks([quack]))
// }

import { db } from "./Firebase.js";
import { doc, addDoc, getDocs, collection, increment } from "firebase/firestore";

class QuackApi {
  constructor() {
    this.addQuack = false;
  }

  fetchQuacks() {
    // console.log("Fetching quacks");
    // return getDocs(collection(db, "Quacks"))
    //   .then((snapshot) => {
    //     const quacks = snapshot.docs.map((doc) => doc.data());
    //     this.renderQuacks(quacks);
    //   });
    const quacksCollection = collection(db, "Quacks");

    getDocs(quacksCollection)
      .then((querySnapshot) => {
        const quacks = [];
        querySnapshot.forEach((doc) => {
          quacks.push(doc.data());
        });
        // Call a rendering function to display the data
        renderQuacks(quacks);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  renderQuacks(quacks) {
  const quackCollection = document.getElementById('quack-collection');
  quacks.forEach(quack=>{
    const quackDiv = document.createElement('div');
    const quackH2 = document.createElement('h2');
    const quackContent = document.createElement('p');
    const quackButton = document.createElement('button');
    quackButton.addEventListener('click',(e)=>{
      updateDoc(doc(db, "Quacks", quack.id), {
        Likes: increment(1),
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

  addNewQuack(quackObject) {
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

  // Other methods can go here

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.fetchQuacks();
      const addBtn = document.querySelector("#new-quack-btn");
      const quackFormContainer = document.querySelector(".container");
      addBtn.addEventListener("click", () => {
        this.addQuack = !this.addQuack;
        if (this.addQuack) {
          quackFormContainer.style.display = "block";
        } else {
          quackFormContainer.style.display = "none";
        }
      });
    });

    let createQuack = document.getElementsByClassName('add-quack-form')[0];
    createQuack.addEventListener('submit', (e) => {
      e.preventDefault();
      let quackObject = {
        name: document.getElementsByClassName('add-quack-form')[0].childNodes[3].value,
        postContent: document.getElementsByClassName('add-quack-form')[0].childNodes[7].value,
        likes: 0,
      };
      this.addNewQuack(quackObject);
    });
  }
}

const quackApi = new QuackApi();
quackApi.init();

