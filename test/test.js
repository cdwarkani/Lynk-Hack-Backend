var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
var expect = require('chai').expect
var should = chai.should();
chai.use(chaiHttp);
let endPoint = "http://localhost:3000";
var expected = require('./inputsAndOutputs.js')
var anystyle = require('../_core/post/anystyle.js');
//Test to check ML system stability
describe('Test to check ML system stability', function () {
    describe('POST /api/anystyle.check', function () {
        it('It should print succesfully trained if system is stable', function () {
            assert.equal(anystyle.checkstatus(), 'Succesfully Trained.');
        });
    });
});

//check if html page is working
describe('Check if Overall html page is working', () => {
    describe('GET ' + endPoint, () => {
        it('it should return 200 status', (done) => {
            chai.request(endPoint).get('/')
                .end((err, res) => {
                    (res).should.have.status(200);
                    done();
                });
        });
    });
});

//Check if training html page is working
describe('Check if training html page is working', () => {
    describe('GET ' + '/training.html', () => {
        it('it should return 200 status', (done) => {
            chai.request(endPoint).get('/training.html')
                .end((err, res) => {
                    (res).should.have.status(200);
                    done();
                });
        });
    });
});

//check if testbed html page is working
describe('Check if testbed html page is working', () => {
    describe('GET '  + '/testbed.html', () => {
        it('it should return 200 status', (done) => {
            chai.request(endPoint).get('/testbed.html')
                .end((err, res) => {
                    (res).should.have.status(200);
                    done();
                });
        });
    });
});


//Check if  tagging is working appropriately
describe('Check if  atleast one style is loaded', () => {
    describe('GET /api/extractstyles', () => {
        it('Returns response with lengthh atleast 1', (done) => {
            chai.request(endPoint).post('/api/extractstyles')
                .set('content-type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    (res).should.have.status(200);
                    console.log(res.body.status.message.length);
                    expect(res.body.status.message.length).to.greaterThan(0);
                    done();
                });
        });
    });
});

//Check if  tagging is working appropriately
describe('Check if JSON tagging is working appropriately', () => {
    describe('POST /api/anystyle', () => {
        it('Returns 200 status', function (done) {
            this.timeout(5000);
            chai.request(endPoint).post('/api/anystyle')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ "text": expected.expectedinput, "type": "test", "rateLimit": 130, "uid": "12345" })
                .end((err, res) => {
                    (res).should.have.status(200);
                    done();
                });
        });
        it('it should succesfully tag JSON output as expected', (done) => {
            chai.request(endPoint).post('/api/anystyle')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ "text": expected.expectedinput, "type": "test", "rateLimit": 130, "uid": "12345" })
                .end((err, res) => {
                    assert.equal((JSON.stringify(res.body.data)), (JSON.stringify(expected.expectedOutput)));
                    done();
                });
        });
        it('it should succesfully tag XML output as expected', (done) => {
            chai.request(endPoint).post('/api/anystyle')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ "text": expected.expectedinput, "type": "test", "rateLimit": 130, "uid": "12345" })
                .end((err, res) => {
                    assert.equal((JSON.stringify(res.body["xml"])), (JSON.stringify(expected.expectedOutput2)));
                    done();
                });
        });
        it('it should succesfully tag HTML output as expected', (done) => {
            chai.request(endPoint).post('/api/anystyle')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ "text": expected.expectedinput, "type": "test", "rateLimit": 130, "uid": "12345" })
                .end((err, res) => {
                    assert.equal((JSON.stringify(res.body["htmlDataArray"][0])), (JSON.stringify(expected.expectedOutput3)));
                    done();
                });
        });
        it('it should succesfully return 400 since no data is passed', (done) => {
            chai.request(endPoint).post('/api/anystyle')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ "text": '', "type": "test", "rateLimit": 130, "uid": "12345" })
                .end((err, res) => {
                    (res).should.have.status(400);
                    assert.equal(res.body, "Either no data was supplied or something unexpectedly went wrong.");
                    //"Either no data was supplied or something unexpectedly went wrong."
                    done();
                });
        });
    });

});


//Check if  validation is working fine is working appropriately
describe('Check if reference is getting validated appropriately', () => {
    describe('POST /api/mastermodule2', () => {
        it('Returns validated tagged output', function (done) {
            this.timeout(20000);
            chai.request(endPoint).post('/api/mastermodule2')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ "data": expected.expectedinput, "type": "reference", "rateLimit": "20", "style": "IMA-2.csl","skipTrackChanges":true,"locale":"locales-en-US.xml" })
                .end((err, res) => {
                    (res).should.have.status(200);
                    assert.equal((JSON.stringify(res.body)), (JSON.stringify(expected.expectedOutput4)));
                    done();
                });
        });
    });
    describe('POST /api/resolvemultiplepmidsusingpubmed', () => {
        it('Resolves input data having pmid', function (done) {
            this.timeout(20000);
            chai.request(endPoint).post('/api/resolvemultiplepmidsusingpubmed')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ "data": JSON.stringify(expected.expectedinput2) })
                .end((err, res) => {
                    (res).should.have.status(200);
                     assert.equal((JSON.stringify(res.body)), (JSON.stringify(expected.expectedOutput5)));
                    done();
                });
        });
    });

});