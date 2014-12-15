/**
 * Created by xavi on 14/12/14.
 */

var should = require('chai').should(),
    db = require('mongoose'),
    Decide = require('../index');

db.connect('mongodb://localhost/test')

var Account = db.model('Account', { email : String, testGroup : String })

Decide.init([{name: 'A'},{name: 'B'}])

describe('#escape', function() {
    it('converts & into &amp;', function() {

        var account = new Account({ email: 'alice@example.com', testGroup: Decide.getRandomGroup() })
        console.log("group: " + account.testGroup);
        account.testGroup.should.match(/^[A|B]/);
    });

});
