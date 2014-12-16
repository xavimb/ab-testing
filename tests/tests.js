/**
 * Created by xavi on 14/12/14.
 */

var should = require('chai').should(),
    db = require('mongoose'),
    ABTesting = require('../index');

db.connect('mongodb://localhost/test')

var Account = db.model('Account', { email : String, testGroup : String })


describe('Init', function() {
    it('should work with a default weight', function () {
        ABTesting.init([{ name : 'A' },{ name : 'B' }])

        var account = new Account({ email : 'alice@example.com', testGroup : ABTesting.getRandomGroup('alice@example.com') })

        account.testGroup.should.match(/^[A|B]/)
    })
    it('should work with weights smaller than 1', function () {
        ABTesting.init([{ name : 'A', weight : 0.3 },{ name : 'B', weight: 0.3 }])

        var account = new Account({ email : 'bob@example.com', testGroup : ABTesting.getRandomGroup('bob@example.com') })

        account.testGroup.should.match(/^[A|B]/)
    })
    it('should work with weights bigger than 1', function () {
        ABTesting.init([{ name : 'A', weight : 30 },{ name : 'B', weight: 30 }])

        var account = new Account({ email : 'bob@example.com', testGroup : ABTesting.getRandomGroup('bob@example.com') })

        account.testGroup.should.match(/^[A|B]/)
    })
})

describe('Test', function () {
    it('should execute the correct function for Alice', function() {
        ABTesting.init([{ name : 'A' },{ name : 'B' }])

        var account = new Account({ email : 'alice@example.com', testGroup : ABTesting.getRandomGroup('alice@example.com') })
        ABTesting.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A')
            },
            function() {
                account.testGroup.should.equal('B')
            }
        ])
    })
    it('should execute the correct function for Bob', function() {
        ABTesting.init([{ name : 'A' },{ name : 'B' }])

        var account = new Account({ email : 'bob@example.com', testGroup : ABTesting.getRandomGroup('bob@example.com') })
        ABTesting.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A')
            },
            function() {
                account.testGroup.should.equal('B')
            }
        ])
    })
    it('should execute with the correct scope', function() {
        ABTesting.init([{ name : 'A' },{ name : 'B' }])
        this.foo = "foo"
        var account = new Account({ email : 'bob@example.com', testGroup : ABTesting.getRandomGroup('bob@example.com') })
        ABTesting.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A')
                this.foo.should.equal('foo')
            },
            function() {
                account.testGroup.should.equal('B')
                this.foo.should.equal('foo')
            }
        ], this)
    })
})

