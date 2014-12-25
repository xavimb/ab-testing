/**
 * Created by xavi on 14/12/14.
 */

var should = require('chai').should(),
    db = require('mongoose'),
    ABTesting = require('../index');

db.connect('mongodb://localhost/test');

var Account = db.model('Account', { email : String, testGroup : String });

describe('Init', function() {
    it('should work with a default weight', function () {
        var ABTest = ABTesting.createTest([{ name : 'A' },{ name : 'B' }]);

        var account = new Account({ email : 'alice@example.com', testGroup : ABTest.getRandomGroup('alice@example.com') });

        account.testGroup.should.match(/^[A|B]/);
    });
    it('should work with weights smaller than 1', function () {
        var ABTest = ABTesting.createTest([{ name : 'A', weight : 0.3 },{ name : 'B', weight: 0.3 }]);

        var account = new Account({ email : 'bob@example.com', testGroup : ABTest.getRandomGroup('bob@example.com') });

        account.testGroup.should.match(/^[A|B]/);
    });
    it('should work with weights bigger than 1', function () {
        var ABTest = ABTesting.createTest([{ name : 'A', weight : 30 },{ name : 'B', weight: 30 }]);

        var account = new Account({ email : 'bob@example.com', testGroup : ABTest.getRandomGroup('bob@example.com') });

        account.testGroup.should.match(/^[A|B]/);
    });
});

describe('Test', function () {
    it('should execute the correct function for Alice', function() {
        var ABTest = ABTesting.createTest([{ name : 'A' },{ name : 'B' }]);

        var account = new Account({ email : 'alice@example.com', testGroup : ABTest.getRandomGroup('alice@example.com') });
        ABTest.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A');
            },
            function() {
                account.testGroup.should.equal('B');
            }
        ]);
    });
    it('should execute the correct function for Bob', function() {
        var ABTest = ABTesting.createTest([{ name : 'A' },{ name : 'B' }]);

        var account = new Account({ email : 'bob@example.com', testGroup : ABTest.getRandomGroup('bob@example.com') });
        ABTest.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A');
            },
            function() {
                account.testGroup.should.equal('B');
            }
        ]);
    });
    it('should execute with the correct scope', function() {
        var ABTest = ABTesting.createTest([{ name : 'A' },{ name : 'B' }]);
        this.foo = "foo";
        var account = new Account({ email : 'bob@example.com', testGroup : ABTest.getRandomGroup('bob@example.com') });
        ABTest.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A');
                this.foo.should.equal('foo');
            },
            function() {
                account.testGroup.should.equal('B');
                this.foo.should.equal('foo');
            }
        ], this);
    });
    it('should return error if the user group does not match any test', function () {
        var ABTest = ABTesting.createTest([{ name : 'A' },{ name : 'B' }]);

        try {
            ABTest.test('nonExistingGroup', [
                function () {
                    should.throw.error();
                },
                function() {
                    should.throw.error();
                }
            ]);
        } catch (err) {
            err.should.exist();
        }
    });
});

describe('Test more than one A/B test', function () {
    it('should accept more than one test', function () {
        var TestOne = ABTesting.createTest([{ name: 'A'}, { name: 'B'}]);
        var TestTwo = ABTesting.createTest([{ name: 'ATest'}, { name: 'BTest'}]);

        var TestOneGroup = TestOne.getRandomGroup('username');
        var TestTwoGroup = TestTwo.getRandomGroup('anotherUsername');

        TestOne.test(TestOneGroup, [
            function () {
                TestOneGroup.should.be.equal('A');
            },
            function () {
                TestOneGroup.should.be.equal('B');
            }
        ], this);

        TestTwo.test(TestTwoGroup, [
            function () {
                TestTwoGroup.should.be.equal('ATest');
            },
            function () {
                TestTwoGroup.should.be.equal('BTest');
            }
        ], this);
    });
    it('should give different groups for each test', function () {
        var TestOne = ABTesting.createTest([{ name: 'A'}, { name: 'B'}]);
        var TestTwo = ABTesting.createTest([{ name: 'A'}, { name: 'B'}]);
        var username = 'testUsername';

        while(TestOne.getRandomGroup(username) != TestTwo.getRandomGroup(username)) {
            TestTwo = ABTesting.createTest([{ name: 'A'}, { name: 'B'}]);
        };
    });
});
