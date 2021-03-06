'use strict'

const SQL = require('./../lib/core/lib/db/SQL')
const buildUdaru = require('./../lib/core')
const buildDb = require('./../lib/core/lib/db')
const config = require('../lib/config/build-all')()
const buildConfig = require('../lib/config')

const fullConfig = buildConfig({}, config)
const db = buildDb(null, fullConfig)
const udaru = buildUdaru(null, fullConfig)

function createOrganization (job, next) {
  const superOrganizationData = config.get('authorization.superUser.organization')

  udaru.organizations.create(superOrganizationData, { createOnly: true }, (error, result) => {
    if (error) return next(error)

    job.organization = result.organization
    next()
  })
}

function createUser (job, next) {
  const { organization } = job

  const superUserData = {
    id: config.get('authorization.superUser.id'),
    name: config.get('authorization.superUser.name'),
    organizationId: organization.id
  }

  udaru.users.create(superUserData, (error, user) => {
    if (error) return next(error)

    job.user = user
    next()
  })
}

function createPolicy (job, next) {
  const { organization } = job

  const superUserPolicy = config.get('authorization.superUser.defaultPolicy', { organizationId: organization.id })

  udaru.policies.create(superUserPolicy, (error, policy) => {
    if (error) return next(error)

    job.policy = policy
    next()
  })
}

function attachPolicy (job, next) {
  const { user, policy } = job

  const sqlQuery = SQL`INSERT INTO user_policies (user_id, policy_id) VALUES (${user.id}, ${policy.id})`
  db.query(sqlQuery, next)
}

const tasks = [
  createOrganization,
  createUser,
  createPolicy,
  attachPolicy
]

db.withTransaction(tasks, (error, x) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  db.shutdown(() => {
    console.log('done')
    process.exit(0)
  })
})
