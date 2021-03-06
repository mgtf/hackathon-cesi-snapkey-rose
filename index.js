console.log("salut");
var fs = require('fs');
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

let buffer = "";

// fetchParams(params).then(console.log);
// fetchWhileResults(params).then(data => {
  
//     //const str = JSON.stringify(data);
//    // console.log(str);
//    buffer = "type_de_transaction,type_de_bien,code_postal,prix_m2_an,surface\r\n";
//    data.forEach(element => {
//        element.data.forEach(elements =>{
           
        
//            buffer += elements.transaction_type + "," + elements.realty_type + "," +elements.code.split(' ')[0] + "," + elements.price + "," + elements.surface + "\r\n"

//        })
//    });
//   // console.log(buffer)
//    fs.writeFile('rose.csv', buffer, function(err) {
//     // If an error occurred, show it and return
//     if(err) return console.error(err);
//     // Successfully wrote to the file!
//   });
// });

let monJson = require('./codePostal.json');

// async function queryAll(params){
//     const datas = []
//     const cp = {...params}
//     for (let codePostal of monJson){
//         cp.location = codePostal.fields.postal_code;
//         cp.location_zip_code = codePostal.fields.postal_code
//         const data = await fetchWhileResults(cp).then(data => {
  
//             //const str = JSON.stringify(data);
//            // console.log(str);
//            data.forEach(element => {
//                element.data.forEach(elements =>{
//                    buffer += elements.transaction_type + "," + elements.realty_type + "," +elements.code.split(' ')[0] + "," + elements.price + "," + elements.surface + "\r\n"
        
//                })
//            });
//           // console.log(buffer)
//            fs.writeFile('rose.csv', buffer, function(err) {
//             // If an error occurred, show it and return
//             if(err) return console.error(err);
//             // Successfully wrote to the file!
//           });
//         });
//         datas.push(data);
//     }
   
//     return datas;
// }
async function queryAllParis(params){
    const datas = []
    const cp = {...params}
    buffer = "type_de_transaction,type_de_bien,code_postal,prix_m2_an,surface\r\n";
    for (let codePostal of ['75001','75002', '75003', '75004', '75005', '75006', '75007', '75008', '75009', '75010', '75011', '75012', '75013', '75014', '75015', '75016', '75017', '75018','75019','75020']){
        cp.location = codePostal;
        cp.location_zip_code = codePostal
        const data = await fetchWhileResults(cp).then(data => {
  
            //const str = JSON.stringify(data);
           // console.log(str);
          
           data.forEach(element => {
               element.data.forEach(elements =>{
                   buffer += elements.transaction_type + "," + elements.realty_type + "," +elements.code.split(' ')[0] + "," + elements.price + "," + elements.surface + "\r\n"
        
               })
           });
          // console.log(buffer)
           fs.writeFile('rose.csv', buffer, function(err) {
            // If an error occurred, show it and return
            if(err) return console.error(err);
            // Successfully wrote to the file!
          });
        });
        datas.push(data);
    }
   
    return datas;
}

queryAllParis(params);

