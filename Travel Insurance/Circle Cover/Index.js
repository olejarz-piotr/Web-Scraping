var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var tripTypes = {
  singletrip:2,
  annualtrip:3,
  cruisetrip:4
};
var destinations = {
  singletrip:{
    europe:2,
    australia:3,
    worldwideExclude:4,
    worldwideInclude:5,
    uk:6
  },
  annualtrip:{
    europe:2,
    worldwideInclude:3,
  },
  cruisetrip:{
    europe:2,
    australia:3,
    worldwideExclude:4,
    worldwideInclude:5,
    uk:6
  }
};
/**
adding seleinum wait
 * Delay in seconds
 * @param int time
 * @param function func
 */


exports.Run = function Run(tripType,location,groupType,tripDays,ages,delayFactor,driver,resultsCallBack){
  var FinalResults = {
    PackageName:[],
    PackagePrice:[]
  }
driver.get('https://www.circlecover.com');
  function Pause(Time,FuncName){
    setTimeout(FuncName,Time*1000);
  }


function ConvertDate(inputFormat){
var d = new Date(inputFormat);
function Padding(S){ return (S < 10) ? '0' + S : S; }
return [Padding(d.getDate()),Padding(d.getMonth()+1),d.getFullYear()].join('/');
}

Pause(10,SetCover);
function SetCover(){
  var id = tripTypes[tripType];
  driver.findElement(By.xpath('// select [@id="ddPolicyType"]/option['+ id +']')).click();
  Pause(5,SetDestination);
}
function SetDestination(){
  var id = destinations[tripType][location];
  driver.findElement(By.xpath('//select [@id="ddDestination"]/option['+ id +']')).click();
  Pause(5,SetTripDuration);
}
function SetTripDuration(){
  console.log("Running Trip Duration Function...");
  var tommorow = new Date();
  tommorow.setDate(tommorow.getDate() + 1);
  var dateStr = ConvertDate(tommorow);
  console.log("Start Date : " + dateStr);
  driver.findElement(By.css('#txtCoverStartDate')).sendKeys(dateStr);
  Pause(5,function(){
    if(tripType !== 'annualtrip'){

      var endDate = new Date(tommorow);
      endDate.setDate(endDate.getDate() + tripDays);
      dateStr = ConvertDate(endDate);
      console.log("Ending Date : " + dateStr);
      driver.findElement(By.css('#txtCoverEndDate')).click();
      driver.findElement(By.css('#txtCoverEndDate')).clear();
      Pause(2,function(){
      driver.findElement(By.css('#txtCoverEndDate')).sendKeys(dateStr);
    });
    }
    Pause(4,SetAges);
  });
}

function SetAges(){
  driver.findElement(By.css('#ddlNoOfTravellers option:nth-child('+ ages.length +')')).click();
  Pause(3,function () {
    for (var i = 0; i < ages.length; i++) {
      driver.findElement(By.id('tb_travellerAge_' + (i+1))).sendKeys(ages[i].toString());
    }
    Pause(5,MoveToNextQuotePage);
  });
}

function MoveToNextQuotePage() {

  driver.executeScript('document.getElementById("btnNext").click()');
  Pause(10,GetPackageName);

}
function GetPackageName(){
  driver.findElements(By.className('productheadings')).then(function(head){
    for (var i = 0; i < head.length; i++) {
      head[i].getText().then(function(headText){
        console.log(headText);
        FinalResults.PackageName.push(headText);
      });
    }
  });
  Pause(3,GetPackagePrice);

}
function GetPackagePrice() {
  driver.findElements(By.xpath('//span [@class="comparePriceJustPrice"] /span')).then(function(body){
    for (var i = 0; i < body.length; i++) {
      body[i].getText().then(function(bodyText){
        console.log(bodyText);
        FinalResults.PackagePrice.push(bodyText);
      });
    }
  });
Pause(3,CompileResults);
}

function CompileResults(){
  var toReturn = [];
  console.log("Raw Results : " + JSON.stringify(FinalResults));
  for (var i = 0; i < FinalResults.PackageName.length; i++) {
  toReturn.push({
    tripType:tripType,
    location:location,
    groupType:groupType,
    tripDays:tripDays,
    ages:ages,
    Name:FinalResults.PackageName[i],
    Price:FinalResults.PackagePrice[i]
  });
  }
  resultsCallBack(toReturn);
}

} //End Run Function
