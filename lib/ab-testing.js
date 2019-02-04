/**
 * Created by xavi on 14/12/14.
 */

var _ = require('underscore'),
    blueImp = require('blueimp-md5');

var md5 = blueImp.md5 || blueImp; // Forces this to work for webpack too: https://github.com/auth0/lock/pull/459/files

/**
 * The config object contains a the information of the different tests, their names and weights.
 *
 * @type {Function}
 */

module.exports = {
    createTest: function (name, config) {

        if(typeof name !== 'string') {
            throw Error('Insert a valid name for the test');
        }

        var testData = initTest(config);
        var testName = name;

        var getName = function () {
            return name;
        }

        var getGroup = function (user) {
            if(user === undefined || typeof user !== 'string')
                throw Error("Undefined user to give it a random group");

            var hexMD5hash = md5(testName, user).substr(0,8);
            var hashAsInt = parseInt("0x" + hexMD5hash, 16);
            var maxInt = parseInt("0xffffffff", 16);
            var random = hashAsInt / maxInt;

            var filtered = testData.filter(function (t) {
                return t.weight > random;
            });
            if(filtered.length === 0)
                throw Error('Error filtering the tests');

            return filtered[0].name;

        };

        var test = function (testGroupName, functions, that) {
            if(typeof testGroupName !== 'string')
                throw Error('Test Group is not a string');

            if(!_.isArray(functions))
                throw Error('Introduce an array of functions as a second parameter');

            if(functions.length !== testData.length)
                throw Error('The number of functions does not match the number of test groups');

            var pluckedValues = _.pluck(testData, 'name');
            var index = pluckedValues.indexOf(testGroupName);

            if(index === -1)
                throw Error('Test Group not found');

            if(that === undefined)
                that = this;

            functions[index].apply(that, functions[index].arguments);
        };

        return {
            getName: getName,
            getGroup: getGroup,
            test: test
        }
    }
}

var initTest = function (config) {
    var defaultWeight = 0.5;
    var accumulativeWeight = 0;

    if(!_.isArray(config))
        throw Error("Module not configured. Check your configuration.");

    // If no weight is provided, we give a static weight
    var totalWeight = _.map(config, function (o) {
        return _.isFinite(o.weight) ? o.weight : defaultWeight;
    }).reduce(function (a, b) {
        return a + b
    });

    var tests = _.map(config, function (test) {
        if(test.name && typeof test.name === 'string') {
            return {
                // Weight from 0..1
                weight: (_.isFinite(test.weight) ? test.weight : defaultWeight) / totalWeight,
                name: test.name
            }
        }
    }).sort(function (a, b) {
        return a.weight > b.weight
    });

    tests.forEach(function (o) {
        o.weight += accumulativeWeight
        accumulativeWeight = o.weight
    });
    return tests;
};
