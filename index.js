const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

fetch('https://www.imdb.com/name/nm0000102/?ref_=fn_al_nm_1')
  .then(data => data.text())
  .then(render);

function render(htmlText) {
  const dom = new JSDOM(htmlText);
  const movieContainer = dom.window.document.querySelector(".filmo-category-section")
  const movies = movieContainer.querySelectorAll('b a')

  const movieLinks = []
  for (const movie of movies) {
    // console.log(`https://www.imdb.com${movie.getAttribute('href')}`);
    // get all the movie links
    const titleLink = movie.getAttribute('href').replace(/\?.+/, '');
    movieLinks.push(`https://www.imdb.com${titleLink}`)
  }
  const cast = {}
  for (const link of movieLinks) {
    fetch(link)
      .then(data => data.text())
      .then((dataText) => {
        console.log(link);
        renderCast(dataText);
      })
  }
  // console.log(movieLinks[0]);
}

function renderCast(htmlText) {
  const dom = new JSDOM(htmlText);
  const castContainer = dom.window.document.querySelector(".cast_list")
  const cast = castContainer.querySelectorAll('td.itemprop > a')
  console.log(cast.length);
  // for (const castMember of cast) {
  //   console.log(castMember.textContent);

  // }

}