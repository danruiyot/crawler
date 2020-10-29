const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.calories.info/food/meat";
const { Worker, isMainThread, parentPort }  = require('worker_threads');

var firebase = require('firebase');


const   firebaseConfig = {
// api details goes here
  }

var app = firebase.initializeApp(firebaseConfig);

var database = firebase.database();



fetchData(url).then( (res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    var myData=[];
    const statsTable = $('.table tbody > tr');
    var coun = {};
       


    statsTable.each(function() {
        let food = $(this).find('td:nth-of-type(1)').text().trim();
        let serving = $(this).find('td:nth-of-type(2)').text().trim();
        let calories = $(this).find('td:nth-of-type(2)').text().trim();
        var res = {
        'food' : food,
        'serving' : serving,
        'calories' : calories

        };
        coun ++;
        myData.push(res);
        console.log(res)


    });

        // console.log(myData);
  firebase.database().ref('szfsdf/').set(myData);

})

async function fetchData(url){
    console.log("Crawling data...")
    // make http call to url
    let response = await axios(url).catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}