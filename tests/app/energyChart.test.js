var rewire = require('rewire');
var utils = rewire('../../app/js/utils/dataUtils.js');
 
describe("dataUtils Functions", function() {

  describe("formatFocusDate()", function() {

    var testNow = new Date(Date.now()); 
    var testTime = new Date('December 17, 1995 6:00:00');

    it("should return a String", function() {
      var result = utils.formatFocusDate(testNow);
      expect(typeof result).toEqual('string');
    });

    it('should return "day mm/dd, h:mm AM/PM format"', function() {
      var result = utils.formatFocusDate(testTime);
      // assert.equal(result, 'Sun 12/17, 6:00 AM');
      expect(result).toBe('Sun 12/17, 6:00 AM');
    });
  });

  describe('bisectDateIndex()', function() {

    var testArray = [
      {time: new Date('January 2, 2000')}, 
      {time: new Date('July 7, 2000')},
      {time: new Date('August 14, 2001')},      
    ];
    var test = new Date('December 1, 2000');
    var testTwo = new Date('January 1, 2000');

    it('should return a number', function() {
      var result = utils.bisectDateIndex(testArray, test);
      // assert(typeof result === 'number');
      expect(typeof result).toEqual('number');
    });

    it('should return left bisect index from given date', function() {
      var result = utils.bisectDateIndex(testArray, test);
      // assert(result === 1);
      expect(result).toBe(1);
    });

    it('should return 0 if left bisect occurs before first index', function() {
      var result = utils.bisectDateIndex(testArray, testTwo);
      // assert(result === 0);
      expect(result).toBe(0);
    });
  });

  describe('translate()', function() {

    it('should return correct translate string', function() {
      var result = utils.translate(100, 200);
      // assert(result === 'translate(100,200)');
      expect(result).toBe('translate(100,200)');
    });

  });

  describe('findDAHRIndex()', function() {

    var data = [
      {market: "RT5M"},
      {market: "RT5M"},
      {market: "RT5M"},
      {market: "DAHR"},
      {market: "DAHR"},
    ];

    it('should return a number', function() {
      var result = utils.findDAHRIndex(data);
      // assert(typeof result === 'number');
      expect(typeof result).toEqual('number');
    });

    it('should return the index of the first occurance of DAHR market prop', function () {
      var result = utils.findDAHRIndex(data);
      // assert(result === 3);
      expect(result).toBe(3);
    });

    it('should return -1 if data does not contain market prop', function() {
      var result = utils.findDAHRIndex([{point:1230}]);
      // assert(result === -1);
      expect(result).toBe(-1);
    });

    it('should return last index if no DAHR exists', function() {
      var result = utils.findDAHRIndex(data.slice(0, 3));
      // assert(result === 2);
      expect(result).toBe(2);
    });

  });

});