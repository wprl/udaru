'use strict'

const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const logger = require('pino')()
const async = require('async')

const OrganizationOps = require('../../../lib/organizationOps')
const TeamOps = require('../../../lib/teamOps')
const UserOps = require('../../../lib/userOps')
const PolicyOps = require('../../../lib/policyOps')
const dbConn = require('../../../lib/dbConn')

const db = dbConn.create(logger)
const organizationOps = OrganizationOps(db.pool, logger)
const teamOps = TeamOps(db.pool, logger)
const userOps = UserOps(db.pool, logger)
const policyOps = PolicyOps(db.pool)

lab.experiment('OrganizationOps', () => {

  lab.test('list of all organizations', (done) => {
    organizationOps.list({}, (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.exist()
      expect(result.length).to.equal(5)

      done()
    })
  })

  lab.test('create an organization (and delete it)', (done) => {
    organizationOps.create({id: 'nearForm', name: 'nearForm', description: 'nearform description'}, (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.exist()
      expect(result.name).to.equal('nearForm')

      organizationOps.deleteById(result.id, done)
    })
  })

  lab.test('update an organization', (done) => {
    const createData = {id: 'nearForm1', name: 'nearForm', description: 'nearform description'}
    const updateData = {id: 'nearForm1', name: 'nearFormUp', description: 'nearFormUp desc up'}

    organizationOps.create(createData, (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.exist()
      expect(result.name).to.equal('nearForm')

      organizationOps.update(updateData, (err, result) => {
        expect(err).to.not.exist()
        expect(result).to.exist()
        expect(result).to.equal(updateData)

        organizationOps.deleteById(result.id, done)
      })
    })
  })

  lab.test('get a specific organization', (done) => {
    const expected = {id: 'CONCH', name: 'Conch Plc', description: 'Global fuel distributors'}
    organizationOps.readById('CONCH', (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.exist()
      expect(result).to.equal(expected)

      done()
    })
  })

  lab.test('get a specific organization that does not exist', (done) => {
    organizationOps.readById(['I_do_not_exist'], (err, result) => {
      expect(err).to.exist()
      expect(err.output.statusCode).to.equal(404)
      expect(result).to.not.exist()

      done()
    })
  })

  lab.test('deleting an organization should remove teams and memebers from that organization', (done) => {
    var teamId
    var policyId
    var userId
    var tasks = []
    var policy = ['2016-07-01', 'Documents Admin', 'nearForm222', '{"Statement":[{"Effect":"Allow","Action":["documents:Read"],"Resource":["wonka:documents:/public/*"]}]}']

    tasks.push((next) => {
      userOps.listAllUsers([], (err, result) => {
        expect(result.length).to.equal(6)
        next(err, result)
      })
    })
    tasks.push((next) => {
      teamOps.listAllTeams([], (err, result) => {
        expect(result.length).to.equal(6)
        next(err, result)
      })
    })
    tasks.push((next) => {
      policyOps.listAllPolicies([], (err, result) => {
        expect(result.length).to.equal(8)
        next(err, result)
      })
    })
    tasks.push((next) => {
      organizationOps.list([], (err, result) => {
        expect(result.length).to.equal(5)
        next(err, result)
      })
    })

    tasks.push((next) => { organizationOps.create({id: 'nearForm222', name: 'nearForm222', description: 'nearform description'}, next) })
    tasks.push((next) => {
      teamOps.createTeam(['Team 4', 'This is a test team', null, 'nearForm222'], function (err, result) {
        if (err) return next(err)

        teamId = result.id
        next()
      })
    })
    tasks.push((next) => {
      userOps.createUser(['Grandma Josephine', 'nearForm222'], function (err, result) {
        if (err) return next(err)

        userId = result.id
        next()
      })
    })
    tasks.push((next) => {
      policyOps.createPolicy(policy, function (err, result) {
        if (err) return next(err)

        policyId = result.id
        next()
      })
    })
    tasks.push((next) => { teamOps.updateTeam([teamId, 'Team 4', 'This is a test team', [{id: userId}], [{id: policyId}]], next) })
    tasks.push((next) => { userOps.updateUser([userId, 'user user', [{id: teamId}], [{id: policyId}]], next) })
    tasks.push((next) => { organizationOps.deleteById('nearForm222', next) })

    tasks.push((next) => {
      userOps.listAllUsers([], (err, result) => {
        expect(result.length).to.equal(6)
        next(err, result)
      })
    })
    tasks.push((next) => {
      teamOps.listAllTeams([], (err, result) => {
        expect(result.length).to.equal(6)
        next(err, result)
      })
    })
    tasks.push((next) => {
      policyOps.listAllPolicies([], (err, result) => {
        expect(result.length).to.equal(8)
        next(err, result)
      })
    })
    tasks.push((next) => {
      organizationOps.list([], (err, result) => {
        expect(result.length).to.equal(5)
        next(err, result)
      })
    })

    async.series(tasks, done)
  })
})