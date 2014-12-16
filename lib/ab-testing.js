/**
 * Created by xavi on 14/12/14.
 */

var _ = require('underscore'),
    crypto = require('crypto')

/**
 * The config object contains a the information of the different tests, their names and weights.
 *
 * @type {Function}
 */

module.exports = {
        tests : [],
        init : function (config) {

            var defaultWeight = 1
            var accumulativeWeight = 0

            if(!_.isArray(config))
                throw Error("Decide module not configured. Check your configuration.");

            // If no weight is provided, we give a static weight
            var totalWeight = _.map(config, function (o) {
                return (_.isFinite(o.weight) && o.weight > 0) ? o.weight : defaultWeight
            }).reduce(function (a, b) { return a + b })

            this.tests = _.map(config, function (test) {
                if(test.weight === undefined)
                    test.weight = defaultWeight

                if(_.isFinite(test.weight) && test.name && typeof test.name === 'string') {
                    return {
                        // Weight from 0..1
                        weight : test.weight / totalWeight,
                        name : test.name
                    }
                }
            }).sort(function (a, b) { return a.weight > b.weight })

            this.tests.forEach(function (o) {
                o.weight += accumulativeWeight
                accumulativeWeight += o.weight
            });
        },
        getRandomGroup :  function (user) {

            if(user === undefined || typeof user !== 'string')
                throw Error("Undefined user to give it a random group")

            var hexMD5hash = crypto.createHash('md5').update(user).digest('hex').substr(0, 6)
            var hashAsInt = parseInt("0x" + hexMD5hash, 16)
            var maxInt = parseInt("0xffffff", 16)
            var random = hashAsInt / maxInt

            for(var i in this.tests) {
                if(this.tests[i].weight > random)
                    return this.tests[i].name
            }
        },
        test : function (testGroupName, functions, that) {
            if(typeof testGroupName !== 'string')
                throw Error('Test Group is not a string')

            if(!_.isArray(functions))
                throw Error('Introduce an array of functions as a second parameter')

            if(functions.length !== this.tests.length)
                throw Error('The number of functions does not match the number of test groups')

            var pluckedValues = _.pluck(this.tests, 'name')
            var index = pluckedValues.indexOf(testGroupName)

            if(index === -1)
                throw Error('Test Group not found')

            if(that === undefined)
                that = this

            functions[index].apply(that, functions[index].arguments)
        }
    }
