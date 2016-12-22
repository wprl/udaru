'use strict'

const Code = require('code')
const Lab = require('lab')
const Boom = require('boom')
const proxyquire = require('proxyquire')
const expect = Code.expect
const lab = exports.lab = Lab.script()

const utils = require('./../../utils')

const policyOps = {}
const policiesRoutes = proxyquire('./../../../routes/public/policies', { './../../lib/policyOps': () => policyOps })
const server = proxyquire('./../../../wiring-hapi', { './routes/public/policies': policiesRoutes })

const getRequestOptions = (options) => {
  return utils.requestOptions(options, {
    headers: {
      authorization: 8
    }
  })
}

lab.experiment('Policies', () => {
  lab.test('get policy list', (done) => {
    const policyListStub = [{
      id: 1,
      name: 'SysAdmin',
      version: '0.1'
    }, {
      id: 2,
      name: 'Developer',
      version: '0.2'
    }]

    policyOps.listByOrganization = (params, cb) => {
      expect(params).to.equal({ organizationId: 'POL_TEST' })
      cb(null, policyListStub)
    }

    const options = getRequestOptions({
      method: 'GET',
      url: '/authorization/policies'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal(policyListStub)

      done()
    })
  })

  lab.test('get policy list should return error for error case', (done) => {
    policyOps.listByOrganization = (params, cb) => {
      expect(params).to.equal({ organizationId: 'POL_TEST' })
      process.nextTick(() => {
        cb(Boom.badImplementation())
      })
    }

    const options = getRequestOptions({
      method: 'GET',
      url: '/authorization/policies'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(result.statusCode).to.equal(500)
      expect(result.error).to.equal('Internal Server Error')
      expect(result.message).to.equal('An internal server error occurred')

      done()
    })
  })

  lab.test('get single policy', (done) => {
    const policyStub = {
      id: 1,
      name: 'SysAdmin',
      version: '0.1',
      statements: [{
        'Statement': [
          {
            'Action': [
              'finance:ReadBalanceSheet'
            ],
            'Effect': 'Allow',
            'Resource': [
              'database:pg01:balancesheet'
            ]
          },
          {
            'Action': [
              'finance:ImportBalanceSheet'
            ],
            'Effect': 'Deny',
            'Resource': [
              'database:pg01:balancesheet'
            ]
          }
        ]
      }]
    }

    policyOps.readPolicy = (params, cb) => {
      expect(params).to.equal({ id: 1, organizationId: 'POL_TEST' })
      process.nextTick(() => {
        cb(null, policyStub)
      })
    }

    const options = getRequestOptions({
      method: 'GET',
      url: '/authorization/policies/1'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal(policyStub)

      done()
    })
  })

  lab.test('get single policy should return error for error case', (done) => {
    policyOps.readPolicy = (params, cb) => {
      expect(params).to.equal({ id: 99, organizationId: 'POL_TEST' })
      process.nextTick(() => {
        cb(Boom.badImplementation())
      })
    }

    const options = getRequestOptions({
      method: 'GET',
      url: '/authorization/policies/99'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(result.statusCode).to.equal(500)
      expect(result.error).to.equal('Internal Server Error')
      expect(result.message).to.equal('An internal server error occurred')

      done()
    })
  })
})
