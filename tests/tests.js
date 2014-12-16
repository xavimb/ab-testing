/**
 * Created by xavi on 14/12/14.
 */

var should = require('chai').should(),
    db = require('mongoose'),
    Decide = require('../index');

db.connect('mongodb://localhost/test')

var Account = db.model('Account', { email : String, testGroup : String })


describe('Init', function() {
    it('should work with a default weight', function () {
        Decide.init([{ name : 'A' },{ name : 'B' }])

        var account = new Account({ email : 'alice@example.com', testGroup : Decide.getRandomGroup('alice@example.com') })

        account.testGroup.should.match(/^[A|B]/)
    })
    it('should work with weights smaller than 1', function () {
        Decide.init([{ name : 'A', weight : 0.3 },{ name : 'B', weight: 0.3 }])

        var account = new Account({ email : 'bob@example.com', testGroup : Decide.getRandomGroup('bob@example.com') })

        account.testGroup.should.match(/^[A|B]/)
    })
    it('should work with weights bigger than 1', function () {
        Decide.init([{ name : 'A', weight : 30 },{ name : 'B', weight: 30 }])

        var account = new Account({ email : 'bob@example.com', testGroup : Decide.getRandomGroup('bob@example.com') })

        account.testGroup.should.match(/^[A|B]/)
    })
})

describe('Test', function () {
    it('should execute the correct function for Alice', function() {
        Decide.init([{ name : 'A', weight : 30 },{ name : 'B', weight: 30 }])

        var account = new Account({ email : 'alice@example.com', testGroup : Decide.getRandomGroup('alice@example.com') })
        Decide.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A')
                console.log("group A")
            },
            function() {
                account.testGroup.should.equal('B')
                console.log("group B")
            }
        ])
    })
    it('should execute the correct function for Bob', function() {
        Decide.init([{ name : 'A', weight : 30 },{ name : 'B', weight: 30 }])

        var account = new Account({ email : 'bob@example.com', testGroup : Decide.getRandomGroup('bob@example.com') })
        Decide.test(account.testGroup, [
            function () {
                account.testGroup.should.equal('A')
            },
            function() {
                account.testGroup.should.equal('B')
            }
        ])
    })
})

