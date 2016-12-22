'use strict'

const async = require('async')
const Code = require('code')
const Lab = require('lab')
const expect = Code.expect
const lab = exports.lab = Lab.script()

const PolicyOps = require('../../../lib/policyOps')
const utils = require('../../utils')

const updatePolicyData = {
  id: 1,
  organizationId: 'POL_TEST',
  varsion: '2016-07-03',
  name: 'name',
  statements: '{}'
}


lab.experiment('policyOps', () => {
  lab.test('should return an error if the db connection fails', (done) => {
    const policyOps = PolicyOps(utils.getDbPollConnectionError())
    const functionsUnderTest = ['listAllUserPolicies', 'listByOrganization', 'readPolicy', 'createPolicy', 'updatePolicy', 'deletePolicy']
    const tasks = []

    functionsUnderTest.forEach((f) => {
      tasks.push((cb) => {
        policyOps[f]({}, utils.testError(expect, 'Error: connection error test', cb))
      })
    })

    async.series(tasks, done)
  })

  lab.test('should return an error if the db query fails', (done) => {
    const policyOps = PolicyOps(utils.getDbPollFirstQueryError())
    const functionsUnderTest = ['listAllUserPolicies', 'listByOrganization', 'readPolicy', 'updatePolicy', 'deletePolicy', 'createPolicy']
    const tasks = []

    functionsUnderTest.forEach((f) => {
      tasks.push((cb) => {
        policyOps[f]({}, utils.testError(expect, 'Error: query error test', cb))
      })
    })

    async.series(tasks, done)
  })

  lab.test('readPolicy should return an error if the query has row count 0', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount(undefined, { testRollback: true, expect: expect }, { rowCount: 0 })
    const policyOps = PolicyOps(dbPool)

    policyOps.readPolicy({ id: 1, organizationId: 'WONKA' }, utils.testError(expect, 'Not Found', done))
  })

  lab.test('updatePolicy should return an error if the update fails', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount('UPDATE policies', { testRollback: true, expect: expect })
    const policyOps = PolicyOps(dbPool, () => {
    })

    policyOps.updatePolicy(updatePolicyData, utils.testError(expect, 'Error: query error test', done))
  })

  lab.test('updatePolicy should return an error if updating returns rowCount 0', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount(undefined, { testRollback: true, expect: expect }, { rowCount: 0 })
    const policyOps = PolicyOps(dbPool, () => {
    })

    policyOps.updatePolicy(updatePolicyData, utils.testError(expect, 'Not Found', done))
  })

  lab.test('deletePolicy should return an error if deliting from user_policies fails', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount('DELETE FROM user_policies', { testRollback: true, expect: expect })
    const policyOps = PolicyOps(dbPool, () => {
    })

    policyOps.deletePolicy({ id: 1, organizationId: 'WONKA' }, utils.testError(expect, 'Error: query error test', done))
  })

  lab.test('deletePolicy should return an error if deliting from team_policies fails', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount('DELETE FROM team_policies', { testRollback: true, expect: expect })
    const policyOps = PolicyOps(dbPool, () => {
    })

    policyOps.deletePolicy({ id: 1, organizationId: 'WONKA' }, utils.testError(expect, 'Error: query error test', done))
  })

  lab.test('deletePolicy should return an error if deliting from policies fails', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount('DELETE FROM policies', { testRollback: true, expect: expect })
    const policyOps = PolicyOps(dbPool, () => {
    })

    policyOps.deletePolicy({ id: 1, organizationId: 'WONKA' }, utils.testError(expect, 'Error: query error test', done))
  })

  lab.test('deletePolicy should return an error if deleting from policies returns rowCount 0', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount(undefined, { testRollback: true, expect: expect }, { rowCount: 0 })
    const policyOps = PolicyOps(dbPool, () => {
    })

    policyOps.deletePolicy({ id: 1, organizationId: 'WONKA' }, utils.testError(expect, 'Not Found', done))
  })

  lab.test('deletePolicy should return an error if the delete commit fails', (done) => {
    const dbPool = utils.getDbPoolErrorForQueryOrRowCount('COMMIT', { testRollback: true, expect: expect })
    const policyOps = PolicyOps(dbPool, () => {
    })

    policyOps.deletePolicy({ id: 1, organizationId: 'WONKA' }, utils.testError(expect, 'Error: query error test', done))
  })
})
