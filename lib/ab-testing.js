/**
 * Created by xavi on 14/12/14.
 */

var _ = require('underscore')

/**
 * The config object contains a the information of the different tests, their names and weights.
 *
 * @type {Function}
 */

module.exports = {
        tests : [],
        init : function (config) {
            if(!_.isArray(config))
                throw Error("Decide module not configured. Check your configuration.");

            // If no weight is provided, we give a static weight
            var totalWeight = _.map(config, function (o) { return _.isFinite(o.weight) ? o.weight : 1 })
                .reduce(function (a, b) { return a + b });

            var accumulativeWeight = 0;

            this.tests = _.map(config, function (test) {
                if(test.weight === undefined)
                    test.weight = 1;

                if(_.isFinite(test.weight) && typeof test.name === 'string') {
                    return {
                        // Weight from 0..1
                        weight : test.weight / totalWeight,
                        name : test.name
                    }
                }
            })
                .sort(function (a, b) { return a.weight > b.weight });

            this.tests.forEach(function (o) {
                o.weight += accumulativeWeight;
                accumulativeWeight += o.weight;
            });

        },
        getRandomGroup :  function () {
            var random = Math.random();
            for(var i in this.tests) {
                if(this.tests[i].weight > random)
                    return this.tests[i].name;
            }
        }
    }
