process.env.NODE_ENV = 'test'

// const assert = require('assert')
const supertest = require('supertest')
const app = require('..')

describe('GET /', function () {
  it('renders a web view', function (done) {
    supertest(app)
      .get('/?query=dog')
      // .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        // assert.equal(res.body, request_id)
        return done()
      })
  })

  it('returns JSON if format=json query param is present', function (done) {
    supertest(app)
      .get('/?query=dog&format=json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        // assert.equal(res.body, request_id)
        done()
      })
  })
})
