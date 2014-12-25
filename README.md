ab-testing
==========

A/B testing made easy.

## Install

	npm install ab-testing

## Initialize

	var ABTesting = require('ab-testing');

	var testObject = ABTesting.createTest([
		{
			name: 'A',
			weight: 0.1 // if not set, the default value is 0.5
		},
		{
			name: 'B',
			weight: 0.9 // if not set, the default value is 0.5
		}
	]);

## Assign a group

	// Given a unique ID of the user, returns 'A' or 'B'
	var testGroup = testObject.getRandomGroup(user.id);

## A/B Test

	// Executes the corresponding function for the given group
	testObject.test(testGroup, [
        function () {
            // Test A code here
        },
        function() {
            // Test B code here
        }
    ], this);

## Create multiple A/B tests

	var ABTesting = require('ab-testing');

	var LandingPageTest = ABTesting.createTest[{ name: 'oldLandingPage' }, { name: 'newLandingPage' }]);
	var PricingPageTest = ABTesting.createTest[{ name: 'oldPricingPage' }, { name: 'newPricingPage' }]);

	...

	var LandingPageGroup = LandingPageTest.getRandomGroup(req.account.username);
	var PricingPageGroup = PricingPageTest.getRandomGroup(req.account.username);

	...

	LandingPageTest.test(LandingPageGroup, [
		function () {
			// oldLandingPage code
		},
		function () {
			// newLandingPage code
		}
	], this);

	PricingPageTest.test(PricingPageGroup, [
		function () {
			// oldPricingPage code
		},
		function () {
			// newPricingPage code
		}
	], this);


NB: the last parameter `this` is optional. If the scope is not required, this paremeter can be ignored.

