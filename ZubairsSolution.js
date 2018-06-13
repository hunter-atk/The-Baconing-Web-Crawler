const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const search = 'Lee DiFilippo';
let found = false; //when this is true, the program should stop
const queue = []; //where we load up objects with urls we want to visit
// const baconNode = {

// }

render();

function render(){
  fetch('https://www.imdb.com/name/nm0000102/?ref_=fn_al_nm_1') //gets all data from KB's IMDB page
  .then(data => data.text()) //converts string to HTML text
  .then(htmlText => {
    getMovies(htmlText) // fills up queue with movies
    baconFirstSearch( queue.shift() ) //takes the first element in our queue as an input while removing the same element from the queue
  });
}

function baconFirstSearch(node) { //takes the shifted movie from our queue as an input and looks for search
  if (queue.length < 1 || found) { 
    console.log(`found ${node.name} at ${node.parentNode.name}`);
    return;
  }
  
  // visit first url in line
  getChildrenFor(node.url) //fetches data from movie url
  .then(data => data[0].text()) //take the first element in our array (our page data string) and converts it to HTML text
  .then( htmlText => {
    // add children to queue
        // movie? getCast
      if (node.type === 'movie') {
        // get cast urls, add to queue
        // check if search matches, make found = true
        console.log(`getting cast from ${node.name}`);
        
        node.children = getCast(htmlText, node)
      } else {
        // cast ? getMovies -----get movies urls, add to queue
        console.log(`getting movies from ${node.name}`);
        node.children = getMovies(htmlText, node) // gets movies associated with this castmember
      }
      // call baconFirstSearch
     baconFirstSearch(queue.shift())
    })
};

// this extracts information about the first 5 movies in the target filmography, including links to movie pages on IMDB
function getMovies(htmlText, parentNode) {
  const dom = new JSDOM(htmlText);
  const movieContainer = dom.window.document.querySelector(".filmo-category-section")
  const movies = movieContainer.querySelectorAll('b a')
  let i = 0
  const children = []
  for (const movie of movies) {
    if (i > 4) {
      return; //only looks at the first 5 movies
    }
    const _link = movie.getAttribute('href')
    const newNode = {
      url: `https://www.imdb.com${_link}`,
      name: movie.textContent,
      type: 'movie',
      parentNode
    }
    children.push(newNode);
    queue.push(newNode);
    i++
  }

  return children;
}

// this extracts information about the first 5 castmembers from a specific movie (the htmlText we pass in)
function getCast(htmlText, parentNode){
  const dom = new JSDOM(htmlText);
  const actorsContainer = dom.window.document.querySelector('.cast_list')
  const castLinks = actorsContainer.querySelectorAll('td.itemprop a')
  const children = []
  let i = 0;
  for (const cast of castLinks) {
    if (i > 4) {
      return;
    }
    const _link = cast.getAttribute('href')
    if (cast.textContent.includes(search)) {
      found = true;
    }
    const newNode = {
      url: `https://www.imdb.com${_link}`,
      name: cast.textContent,
      type: 'cast',
      parentNode
    }
    children.push(newNode);
    queue.push(newNode);
    i++;
  }
  console.log(children);
  
  return children;
}

function getAllActors(moviesList){
  const list = moviesList.slice(); // cloning the movie array
  getActorsForMovies(list)


}

function getChildrenFor(node){ //fetches string data from the url we pass in
  // this makes sure both promises are completed
  // first promise: fetch
  // second promise: delay function
  return Promise.all( [ fetch( node ), delay(10) ] ) //returns an array with data corresponding to each promise
}

function delay(ms){ //delays fetch() by a set number of milliseconds before it executes again
  return new Promise( (resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}