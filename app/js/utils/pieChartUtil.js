module.exports = function(wattTimeData, utilityData){
  var greenBound, yellowBound;
  var yellowTimes = [];
  var greenTimes = [];
  var redTimes = [];

  // Count UtilityAPI datapoints that fall within each time bracket
  var greenCount = 0;
  var yellowCount = 0;
  var redCount = 0;

  function sortByTimestamp(a,b) {
    var dateA = new Date(a.timestamp)
    var dateB = new Date(b.timestamp)
    if (dateA < dateB)
      return -1;
    if (dateA > dateB)
      return 1;
    return 0;
  };

  var getCarbonRange = function(wattTimeData){
    var min = Number.POSITIVE_INFINITY;
    var max = Number.NEGATIVE_INFINITY;
    for(var i = 0; i < wattTimeData.length; i++){
      if(wattTimeData[i].carbon !== null && wattTimeData[i].carbon > max){
        max = wattTimeData[i].carbon;
      }
      else if(wattTimeData[i].carbon !== null && wattTimeData[i].carbon < min){
        min = wattTimeData[i].carbon;
      }
    }
    return [min, max];
  };

  var getBin = function(carbon){
    if(carbon <= greenBound){
      return 'green';
    }
    else if(carbon > greenBound && carbon <= yellowBound){
      return 'yellow';
    }
    else {
      return 'red';
    }
  };

  var computeBrackets = function(wattTimeData, greenBound, yellowBound){
    var currentBin = null;
    for(var i = 0; i < wattTimeData.length; i++){
      if(currentBin === null){
        var currentBracket = [null, null];
        currentBracket[0] = wattTimeData[i].timestamp;
        currentBin = getBin(wattTimeData[i].carbon);
      }
      else if(getBin(wattTimeData[i].carbon) !== currentBin || i === wattTimeData.length-1){
        currentBracket[1] = wattTimeData[i].timestamp;
        if(currentBin === 'green'){
          greenTimes.push(currentBracket);
        }
        else if(currentBin === 'yellow'){
          yellowTimes.push(currentBracket);
        }
        else{
          redTimes.push(currentBracket)
        }
        currentBin = null;
      }
    }
  };

  var countUtilityApiPoints = function(utlityApiData){
    for(var i = 0; i < utlityApiData.length; i++){
      var intervalTime = new Date(utlityApiData[i].interval_start);
      var foundTime = false;

      if(!foundTime){
        for(var j = 0; j < greenTimes.length; j++){
          var greenStartTime = new Date(greenTimes[j][0]);
          var greenEndTime = new Date(greenTimes[j][1]);

          if(intervalTime > greenStartTime && intervalTime < greenEndTime){
            greenCount++;
            foundTime = true;
          }
        }
      }
      if(!foundTime){
        for(var j = 0; j < yellowTimes.length; j++){
          var yellowStartTime = new Date(yellowTimes[j][0]);
          var yellowEndTime = new Date(yellowTimes[j][1]);
          if(intervalTime > yellowStartTime && intervalTime < yellowEndTime){
            yellowCount++;
            foundTime = true;
          }
        }
      }
      else {
        redCount++;
      }
      
    }
  };

  var range = getCarbonRange(wattTimeData);
  var sortedWattTime = wattTimeData.sort(sortByTimestamp);
  var oneThirdRange = ((range[1] - range[0])/3);
  
  greenBound = range[0] + oneThirdRange;
  yellowBound = greenBound + oneThirdRange;
  
  computeBrackets(sortedWattTime, greenBound, yellowBound);
  countUtilityApiPoints(utilityData);

  return ([{text: 'Red', quantity: redCount},
                            {text: 'Yellow', quantity: yellowCount},
                            {text: 'Green', quantity: greenCount}
                            ]);
}