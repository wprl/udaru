'use strict'

const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const Boom = require('boom')
var proxyquire = require('proxyquire')
var utils = require('./../../utils')

var policyOps = {}
var policiesRoutes = proxyquire('./../../../routes/public/policies', { './../../lib/ops/policyOps': policyOps })
var server = proxyquire('./../../../wiring-hapi', { './routes/public/policies': policiesRoutes })

lab.experiment('Policies', () => {
  lab.test('get policy list should return error for error case', (done) => {
    policyOps.listByOrganization = (params, cb) => {
      expect(params).to.equal({ organizationId: 'WONKA' })
      process.nextTick(() => {
        cb(Boom.badImplementation())
      })
    }

    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/policies'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(500)
      expect(result).to.be.undefined

      done()
    })
  })

  lab.test('get single policy should return error for error case', (done) => {
    policyOps.readPolicy = (params, cb) => {
      expect(params).to.equal({ id: '99', organizationId: 'WONKA' })
      process.nextTick(() => {
        cb(Boom.badImplementation())
      })
    }

    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/policies/99'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(500)
      expect(result).to.be.undefined

      done()
    })
  })
})
