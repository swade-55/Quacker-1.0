class QuackApi {
  constructor() {
    this.addQuack = false;
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

      quackName.textContent = quack.name;
      quackContent.textContent = quack.postContent;
      quackLikes.textContent = `Likes: ${quack.likeCount}`;

      quackDiv.appendChild(quackName);
      quackDiv.appendChild(quackContent);
      quackDiv.appendChild(quackLikes);
      quackCollection.appendChild(quackDiv);
    });
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
  
      // Log the response data for debugging
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
  
  
  

  init() {
    this.fetchQuacks();
    this.fetchTopQuacks();
  }
}

const quackApi = new QuackApi();
document.addEventListener("DOMContentLoaded", () => quackApi.init());
