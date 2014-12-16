ab-testing
==========

A/B testing made easy.

## Install

	npm install ab-testing

## Initialize

	var ABTesting = require('ab-testing');
	
	ABTesting.init([
		{
			name: 'A',
			weight: 0.1 // if not set, the default value is 0.5
		},
		{
			name: 'B',
			weight: 0.9 // if not set, the default value is 0.5
		}
	])

## Assign a group

	// Give a unique ID for the user
	var testGroup = ABTesting.getRandomGroup(user.id)
	
## A/B Test

	ABTesting.test(testGroup, [
        function () {
            // Test A code here
        },
        function() {
            // Test B code here
        }
    ], this)

NB: the last parameter `this` is optional. If the scope is not required, this paremeter can be ignored.

