console.log("salut");
const fetch = require("node-fetch");
const myParsing = require('./parsing.js')

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
 }

const API_BASE = 'https://www.bureauxlocaux.com/recherche/?';
const params = {
    location_type: 'zip_code',
    location: '75001',
    location_zip_code: '75011',
    transaction_type: 'rental',
    realty_type: 'office',
    isEstimation: 'false',
    page: 1
};

async function fetchParams(params) {
    const sParams = encodeQueryData(params);
    const full_url = API_BASE + sParams;
    console.log('GET ' + full_url);
    return await fetch(full_url)
        .then(r => r.text())
        .then(myParsing.parse_result_page);
}

async function fetchWhileResults(params) {

    let newData = true;
    const cp = {...params};
    const datas = [];

    while (newData) {
        const data = await fetchParams(cp);

        if (datas.length === 0) {
            if (data.length === 0) {
                newData = false;
                console.log('no results at all')
            }
        } else {
            const firstUrl = datas[0].data[0].url;
            const currFirst = data[0].url;

            console.log(firstUrl);
            console.log(currFirst);

            if (firstUrl === currFirst) {
                console.log('end of results');
                newData = false;
            }
        }

        if (!newData) continue;

        datas.push({
            page: cp.page,
            data
        });

        console.log('Loaded page ' + cp.page + ' with ' + data.length + ' results');
        cp.page++;
    }

    return datas;
}

// fetchParams(params).then(console.log);
// fetchWhileResults(params).then(data => {
//     const str = JSON.stringify(data);
//     console.log(str);
// });

let monJson = require('./codePostal.json');

async function queryAll(params){
    const datas = []
    const cp = {...params}
    for (let codePostal of monJson){
        cp.location = codePostal.fields.postal_code;
        cp.location_zip_code = codePostal.fields.postal_code
        const data = await fetchWhileResults(cp);
        datas.push(data);
    }
   
    return datas;
}
queryAll(params).then(console.log)
