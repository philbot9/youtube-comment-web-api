var expect = require('chai').expect;
var cheerio = require('cheerio');

var getReplies = require('../lib/replies-api');

describe('Replies API', function(){
	it('should export a function', function(){
		expect(require('../lib/replies-api.js')).to.be.a('function');
	});
	
	it('should throw an error if no video ID is provided', function(){
		expect(getReplies).to.throw(Error);
		expect(function(){
			getReplies(null, 'abc');
		}).to.throw(Error);
	});
	
	it('should throw an error if no comment ID is provided', function(){
		expect(getReplies).to.throw(Error);
		expect(function(){
			getReplies('abc', null);
		}).to.throw(Error);
	});

	it('should give an error (400) for an invalid video ID', function(done){
		this.timeout(10000);

		getReplies('fakeId', 'z13oy5eavyzketqp204cjvjadqu5xttiwhk')
    .then(function(page) {
			expect(page).not.to.exist;
			done();
    })
    .catch(function(error) {
      expect(error).to.exist;
      expect(error).to.have.a.property('status', 400);
			done();
		});
	});

	it('should give an error (503) for an invalid comment ID', function(done){
		this.timeout(10000);
		getReplies('eKEwL-10s7E', 'yadayada')
    .then(function(page) {
			expect(page).not.to.exist;
			done();
    })
    .catch(function(error) {
      expect(error).to.exist;
			expect(error).to.have.a.property('status', 503);
			done();
    });
	});

	it('should get replies to a comment', function(done){
		this.timeout(10000);
		getReplies('eKEwL-10s7E', 'z13oy5eavyzketqp204cjvjadqu5xttiwhk')
    .then(function(page){
			expect(page).to.have.a.property('html');
			expect(page.html).to.be.a('string');
			expect(page.html).to.have.length.above(1);
			done();
		});
	});

	it('should return valid HTML for replies', function(done){
		this.timeout(10000);
		getReplies('eKEwL-10s7E', 'z13oy5eavyzketqp204cjvjadqu5xttiwhk')
    .then(function(page){
			var $ = cheerio.load(page.html);
			expect($('.comment-item')).to.have.a.property('0');
			done();
		});
	});
});