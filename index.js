const fetch = require('node-fetch');


fetch('https://www.imdb.com/name/nm0000102/?ref_=nv_sr_1')
    .then(res => res.text())
    .then(body => console.log(body));
