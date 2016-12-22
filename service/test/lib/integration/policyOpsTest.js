'use strict'

const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const PolicyOps = require('../../../lib/policyOps')
const dbConn = require('../../../lib/dbConn')
const logger = require('pino')()

const db = dbConn.create(logger)
const policyOps = PolicyOps(db.pool)

lab.experiment('PolicyOps', () => {

  lab.test('list all organization policies', (done) => {
    policyOps.listByOrganization({ organizationId: 'POL_TEST' }, (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.exist()
      expect(result.length).to.equal(1)

      const policy = result[0]
      expect(policy.id).to.exist()
      expect(policy.name).to.exist()
      expect(policy.version).to.exist()
      expect(policy.statements).to.exist()

      done()
    })
  })

  lab.test('read a specific policy', (done) => {
    policyOps.readPolicy({ id: 10, organizationId: 'POL_TEST' }, (err, policy) => {
      expect(err).to.not.exist()
      expect(policy).to.exist()

      expect(policy.id).to.exist()
      expect(policy.name).to.exist()
      expect(policy.version).to.exist()
      expect(policy.statements).to.exist()

      done()
    })
  })

  lab.test('create, update and delete a policy', (done) => {
    const policyData = {
      version: 1,
      name: 'Documents Admin',
      organizationId: 'POL_TEST',
      statements: '{"Statement":[{"Effect":"Allow","Action":["documents:Read"],"Resource":["pol_test:documents:/public/*"]}]}'
    }

    policyOps.createPolicy(policyData, (err, policy) => {
      expect(err).to.not.exist()
      expect(policy).to.exist()

      const policyId = policy.id

      expect(policy.name).to.equal('Documents Admin')
      expect(policy.version).to.equal('1')
      expect(policy.statements).to.equal({ Statement: [{ Effect: 'Allow', Action: ['documents:Read'], Resource: ['pol_test:documents:/public/*'] }] })

      const updateData = {
        id: policyId,
        organizationId: 'POL_TEST',
        version: 2,
        name: 'Documents Admin v2',
        statements: '{"Statement":[{"Effect":"Deny","Action":["documents:Read"],"Resource":["pol_test:documents:/public/*"]}]}'
      }

      policyOps.updatePolicy(updateData, (err, policy) => {
        expect(err).to.not.exist()
        expect(policy).to.exist()

        expect(policy.name).to.equal('Documents Admin v2')
        expect(policy.version).to.equal(2)
        expect(policy.statements).to.equal({ Statement: [{ Effect: 'Deny', Action: ['documents:Read'], Resource: ['pol_test:documents:/public/*'] }] })

        policyOps.deletePolicy({ id: policyId, organizationId: 'POL_TEST' }, done)
      })
    })
  })
})
