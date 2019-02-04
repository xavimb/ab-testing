ab-testing
==========

[![Build Status](https://travis-ci.com/xavimb/ab-testing.svg?branch=master)](https://travis-ci.org/xavimb/ab-testing)
[![Latest Stable Version](https://img.shields.io/npm/v/ab-testing.svg)](https://www.npmjs.com/package/ab-testing)
[![License](https://img.shields.io/npm/l/ab-testing.svg)](https://raw.githubusercontent.com/xavimb/ab-testing/master/LICENSE)

A/B testing made easy.

## Install

	npm install ab-testing

## Initialize

```javascript
var ABTesting = require('ab-testing');

var testObject = ABTesting.createTest('firstTest', 	// This name has to be unique across all the tests
[
	{
		name: 'A',
		weight: 0.1 	// If not set, the default value is 0.5
	},
	{
		name: 'B',
		weight: 0.9
	}
]);
```

## Assign a group

```javascript
// Given a unique ID of the user, returns 'A' or 'B'
var testGroup = testObject.getGroup(user.id);
```

## Get test name

```javascript
// Returns the name of the test, in this case 'firstTest'
var testName = testObject.getName();
```

## A/B Test

```javascript
// Executes the corresponding function for the given group
testObject.test(testGroup, [
	function () {
		// Test A code here
	},
	function() {
		// Test B code here
	}
], this);
```

## Useful usage tips

```javascript
// Use the test name and the group name to track analytics
sendToAnalytics(testName, testGroup);
```

## Create multiple A/B tests

```javascript
var ABTesting = require('ab-testing');

var landingPageTest = ABTesting.createTest('landingPage', [{ name: 'oldLandingPage' }, { name: 'newLandingPage' }]);
var pricingPageTest = ABTesting.createTest('pricingPage', [{ name: 'oldPricingPage' }, { name: 'newPricingPage' }]);

...

var landingPageGroup = pandingPageTest.getGroup(req.account.username);
var pricingPageGroup = pricingPageTest.getGroup(req.account.username);

...

landingPageTest.test(landingPageGroup, [
	function () {
		// oldLandingPage code
	},
	function () {
		// newLandingPage code
	}
], this);

pricingPageTest.test(pricingPageGroup, [
	function () {
		// oldPricingPage code
	},
	function () {
		// newPricingPage code
	}
], this);
```

>NB: the last parameter `this` is optional. If the scope is not required, this paremeter can be ignored.

