var webdriver = require('selenium-webdriver');
var fs = require('fs');
var chrome = require('chromedriver');
var driver = null;
const delayFactor = 1;
const travelInsurance = 'Circle Cover';
var site = require ('./' + travelInsurance);
var params = require('./' + travelInsurance + '/Data.js').data;
const filePath = travelInsurance + '.csv';
var currentParams = undefined;
console.log('running travel insurance website: ' + travelInsurance);


function LoopingParams(){
  console.log('Looping Params');
  if(params.length < 1){
    console.log("There is no test cases left in Data.js File | All Params Have been passed");
    return;
  }
   currentParams = params.shift();

   ExecuteTestCases();
}


function ExecuteTestCases(){
  driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();
      console.log('running : '+ JSON.stringify(currentParams));
      var _groupType = currentParams.ages.length === 1 ? 'individual'
      : currentParams.ages.length === 2? 'couple'
      :'family';

 site.Run(
   currentParams.tripType,
   currentParams.location,
    _groupType,
    currentParams.tripDays,
    currentParams.ages,
    delayFactor,
    driver,
    function(results){
   console.log("Results from Index file " + JSON.stringify(results));
   for (var i = 0; i < results.length; i++) {
     AppendResultsToCSVFILE(results[i]);
   }
   driver.quit();
   LoopingParams();

    } );

}
function AppendResultsToCSVFILE(result){
  fs.appendFileSync(filePath,''
  + result.tripType + ','
  + result.location + ','
  + result.groupType + ','
  + result.tripDays + ','
  + result.ages.join('&') + ','
  + result.Name + ','
  + result.Price + ', \n '

);
}

LoopingParams();
