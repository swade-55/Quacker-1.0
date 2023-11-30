class QuackApi {
  constructor() {
    this.addQuack = false;
    console.log('QuackApi instance created.');
  }

  async fetchQuacks() {
    try {
      const response = await fetch('http://localhost:3000/quacks');
      const quacks = await response.json();
      this.renderQuacks(quacks);
    } catch (error) {
      console.error("Error fetching quacks:", error);
    }
  }

  renderQuacks(quacks) {
    const quackCollection = document.getElementById('quack-collection');
    quackCollection.innerHTML = ''; // Clear existing quacks

    quacks.forEach(quack => {
      const quackDiv = document.createElement('div');
      const quackName = document.createElement('h3');
      const quackContent = document.createElement('p');
      const quackLikes = document.createElement('p');
      const deleteButton = document.createElement('button');
      const likeButton = document.createElement('button');
      const commentInput = document.createElement('input');
      const commentButton = document.createElement('button');

      quackName.textContent = quack.name;
      quackContent.textContent = quack.postContent;
      quackLikes.textContent = `Likes: ${quack.likeCount}`;
      deleteButton.textContent = 'Delete';
      likeButton.textContent = 'Like';
      commentInput.placeholder = 'Add a comment';
      commentButton.textContent = 'Comment';

      deleteButton.onclick = () => {
        console.log('Delete button clicked for quackId:', quack._id);
        this.deleteQuack(quack._id);
      };
      likeButton.onclick = () => this.incrementLikes(quack._id);
      commentButton.onclick = () => this.addComment(quack._id, commentInput.value);

      quackDiv.appendChild(quackName);
      quackDiv.appendChild(quackContent);
      quackDiv.appendChild(quackLikes);
      quackDiv.appendChild(deleteButton);
      quackDiv.appendChild(likeButton);
      quackDiv.appendChild(commentInput);
      quackDiv.appendChild(commentButton);
      quackCollection.appendChild(quackDiv);
    });
  }

  async loginUser(email, password) { 
    console.log('loginUser method called.'); // This should log when loginUser is called
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);
        // Handle post-login logic (like storing session data and redirecting to the main page)
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error during login');
      }
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  }
  


  async addNewQuack(quackObject) {
    try {
      // Construct the newQuack object in the desired format
      const newQuack = {
        name: quackObject.name,
        postContent: quackObject.quackText, // Assuming you're sending quackText from the client
        likeCount: 0, // Initialize likeCount to 0 for a new quack
        comments: [] // Initialize an empty array for comments
      };
    
  
      // Make the POST request to the server
      const response = await fetch('http://localhost:3000/quacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuack)
      });
  
      if (response.ok) {
        // Wait for the new quack to be successfully added
        await response.json();
  
        // Re-fetch all quacks to refresh the list
        await this.fetchQuacks();
        await this.fetchTopQuacks();
        //force refresh of page
        window.location.reload();
      } else {
        // If the server response was not OK, handle the error
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred while adding the quack.');
      }
    } catch (error) {
      console.error("Error adding new quack:", error);
    }
  }

  
  

  async fetchTopQuacks() {
    try {
      const response = await fetch('http://localhost:3000/top-quacks');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const topQuacks = await response.json();
  
      // Log the response data for 
      console.log("Top quacks data:", topQuacks);
  
      // Check if the response is an array before calling forEach
      if (Array.isArray(topQuacks)) {
        this.renderTopQuacks(topQuacks);
      } else {
        console.error("Received data is not an array:", topQuacks);
      }
    } catch (error) {
      console.error("Error fetching top quacks:", error);
    }
  }



  async deleteQuack(quackId) {
    try {
      const response = await fetch(`http://localhost:3000/delete-quack?id=${quackId}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        await this.fetchQuacks(); // Refresh the quack list
      } else {
        throw new Error('Error deleting quack');
      }
    } catch (error) {
      console.error("Error deleting quack:", error);
    }
  }

  async incrementLikes(quackId) {
    try {
      const response = await fetch(`http://localhost:3000/increment-likes?id=${quackId}`, {
        method: 'POST'
      });

      if (response.ok) {
        await this.fetchQuacks(); // Refresh the quack list
      } else {
        throw new Error('Error incrementing likes');
      }
    } catch (error) {
      console.error("Error incrementing likes:", error);
    }
  }

  async addComment(quackId, comment) {
    try {
      const response = await fetch('http://localhost:3000/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quackId, comment })
      });

      if (response.ok) {
        await this.fetchQuacks(); // Refresh the quack list
      } else {
        throw new Error('Error adding comment');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
  
  
  renderTopQuacks(quacks) {
    const topQuacksDiv = document.getElementById('top-quacks');
    // Clear existing content
    topQuacksDiv.innerHTML = '<h1 id="top-quack-title">Top Quacks For You</h1>';
    
    quacks.forEach(quack => {
      const quackDiv = document.createElement('div');
      // Add quack details
      quackDiv.innerHTML = `<h3>${quack.name}</h3><p>${quack.postContent}</p><p>Likes: ${quack.likeCount}</p>`;
      topQuacksDiv.appendChild(quackDiv);
    });
  }

  async registerUser(email, password) {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration successful:", result);
        // Handle post-registration logic (like redirecting to a login page)
      } else {
        throw new Error('Error during registration');
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }

  async loginUser(email, password) {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);
        // Handle post-login logic (like storing session data and redirecting to the main page)
      } else {
        throw new Error('Error during login');
      }
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  }
  
  
  

  init() {
    this.fetchQuacks();
    this.fetchTopQuacks();
  }
}

const quackApi = new QuackApi();
document.addEventListener("DOMContentLoaded", () => {
quackApi.init()

// Add event listeners for the registration and login forms
const registrationForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');
if (registrationForm) {
  registrationForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    await quackApi.registerUser(email, password);
  });
}
if (loginForm) {
  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    await quackApi.loginUser(email, password); // This calls the correct loginUser method
  });
}
const addQuackForm = document.querySelector('.add-quack-form');
  if (addQuackForm) {
    addQuackForm.style.display = 'block'; // This will make sure the form is visible
    addQuackForm.addEventListener('submit', async function(event) {
      event.preventDefault(); // This prevents the default form submission
      const name = this.name.value;
      const quackText = this.quackText.value;
      if(name && quackText) {
        await quackApi.addNewQuack({ name, quackText });
      }
    });
}
}
);
