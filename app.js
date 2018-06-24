

const fetch = require('node-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const input = "Helen Hunt";

fetch('https://www.imdb.com/name/nm0000102/')
.then(data => data.text())
.then(render);


function render(htmlText){
    const dom = new JSDOM(htmlText);
    const movieContainer = dom.window.document.querySelector(".filmo-category-section")
    const movies = movieContainer.querySelectorAll("b a")

    const movieLinks = [];

    for(const movie of movies){
        movieLinks.push(`https://www.imdb.com${movie.getAttribute('href')}`)
    }

    // movieLinks.forEach(x => {
    //     fetch(x)
    //     .then(data => data.text())
    //     .then(renderActors);
    // })

    // function renderActors(htmlText){
    //     const dom1 = new JSDOM(htmlText);
    //     const actorContainer = dom1.window.document.querySelector(".cast_list")
    //     const actors = actorContainer.querySelectorAll("tr .itemprop a span")
        
    //     for (actor of actors){
    //         if (actor.textContent == input){
    //             console.log(actor.textContent + " is one degree of separation away from Kevin Bacon!");
    //             return;
    //         } 
    //     }
    // }

    getAllActors(movieLinks);
}

function getAllActors(moviesList){
    const list = moviesList.slice();

    getActorsForMovie(list)
}

function getActorsForMovie(list){
    if (list.length < 1){
        return;
    }
    getNextActor(list)
        .then(data => data[0].text())
        .then((txt) => {
            const dom = new JSDOM(txt);
            const actorsContainer = dom.window.document.querySelector(".cast_list")
            const actorLinks = actorsContainer.querySelectorAll("tr .itemprop a span")
            console.log(actorLinks)
            list.shift()
            getActorsForMovie(list)
        })
        .catch(console.error)
    
}

function getNextActor(list){
    return Promise.all([fetch(list[0]), delay(1000)])
}

function delay(ms){
    new Promise( (resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

