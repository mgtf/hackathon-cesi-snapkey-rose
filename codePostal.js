let monJson = require('./codePostal.json');

//console.log(monJson)
monJson.forEach(element => {
    
    console.log(element.fields.postal_code)
});