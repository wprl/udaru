'use strict'

const Code = require('code')
const Lab = require('lab')
const proxyquire = require('proxyquire')
const expect = Code.expect
const lab = exports.lab = Lab.script()

const utils = require('./../../utils')

const policyOps = {}
const policiesRoutes = proxyquire('./../../../routes/private/policies', { './../../lib/policyOps': () => policyOps })
const server = proxyquire('./../../../wiring-hapi', { './routes/private/policies': policiesRoutes })

const getRequestOptions = (options) => {
  return utils.requestOptions(options, {
    headers: {
      authorization: 8
    }
  })
}

lab.experiment('Policies', () => {
  lab.test('create new policy without a service key should return 403 Forbidden', (done) => {
    const options = getRequestOptions({
      method: 'POST',
      url: '/authorization/policies?sig=1234',
      payload: {
        version: '2016-07-01',
        name: 'Documents Admin',
        statements: 'fake-statements'
      }
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(result.statusCode).to.equal(403)
      expect(result.message).to.be.undefined()

      done()
    })
  })

  lab.test('create new policy without valid data should return 400 Bad Request', (done) => {
    const options = getRequestOptions({
      method: 'POST',
      url: '/authorization/policies?sig=123456789',
      payload: {
        version: '2016-07-01',
        name: 'Documents Admin'
      }
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(result.statusCode).to.equal(400)

      done()
    })
  })

  lab.test('create new policy should return 201 and the created policy data', (done) => {
    const policyStub = {
      id: 2,
      version: '2016-07-01',
      name: 'Documents Admin',
      organizationId: 'POL_TEST',
      statements: '{"Statement":[{"Effect":"Allow","Action":["documents:Read"],"Resource":["pol_test:documents:/public/*"]}]}'
    }

    const options = getRequestOptions({
      method: 'POST',
      url: '/authorization/policies?sig=123456789',
      payload: {
        version: policyStub.version,
        name: policyStub.name,
        statements: policyStub.statements
      }
    })

    policyOps.createPolicy = (params, cb) => {
      expect(params).to.equal({ version: '2016-07-01', name: 'Documents Admin', organizationId: 'POL_TEST', statements: '{"Statement":[{"Effect":"Allow","Action":["documents:Read"],"Resource":["pol_test:documents:/public/*"]}]}' })
      process.nextTick(() => {
        cb(null, policyStub)
      })
    }

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(201)
      expect(result).to.equal(policyStub)

      done()
    })
  })

  lab.test('update new policy without a service key should return 403 Forbidden', (done) => {
    const options = getRequestOptions({
      method: 'PUT',
      url: '/authorization/policies/1?sig=1234',
      payload: {
        version: '2016-07-01',
        name: 'Documents Admin',
        statements: 'fake-statements'
      }
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(result.statusCode).to.equal(403)
      expect(result.message).to.be.undefined()

      done()
    })
  })

  lab.test('update policy without valid data should return 400 Bad Request', (done) => {
    const options = getRequestOptions({
      method: 'PUT',
      url: '/authorization/policies/1?sig=123456789',
      payload: {
        version: '2016-07-01',
        name: 'Documents Admin'
      }
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(result.statusCode).to.equal(400)

      done()
    })
  })

  lab.test('update new policy should return the updated policy data', (done) => {
    const policyStub = {
      id: 2,
      version: '2016-07-01',
      name: 'Documents Admin - updated',
      organizationId: 'POL_TEST',
      statements: '{"Statement":[{"Effect":"Allow","Action":["documents:Update"],"Resource":["pol_test:documents:/public/*"]}]}'
    }

    const options = getRequestOptions({
      method: 'PUT',
      url: '/authorization/policies/2?sig=123456789',
      payload: {
        version: policyStub.version,
        name: policyStub.name,
        statements: policyStub.statements
      }
    })

    policyOps.updatePolicy = (params, cb) => {
      expect(params).to.equal({
        id: 2,
        organizationId: 'POL_TEST',
        version: '2016-07-01',
        name: 'Documents Admin - updated',
        statements: '{"Statement":[{"Effect":"Allow","Action":["documents:Update"],"Resource":["pol_test:documents:/public/*"]}]}'
      })
      process.nextTick(() => {
        cb(null, policyStub)
      })
    }

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal(policyStub)

      done()
    })
  })

  lab.test('delete policy without a service key should return 403 Forbidden', (done) => {
    const options = getRequestOptions({
      method: 'DELETE',
      url: '/authorization/policies/1?sig=1234'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(result.statusCode).to.equal(403)
      expect(result.message).to.be.undefined()

      done()
    })
  })

  lab.test('delete policy should return 204', (done) => {
    const options = getRequestOptions({
      method: 'DELETE',
      url: '/authorization/policies/1?sig=123456789'
    })

    policyOps.deletePolicy = (params, cb) => {
      expect(params).to.equal({ id: 1, organizationId: 'POL_TEST' })
      process.nextTick(() => {
        cb(null)
      })
    }

    server.inject(options, (response) => {
      expect(response.statusCode).to.equal(204)

      done()
    })
  })
})
