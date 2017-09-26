'use strict'

const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const utils = require('../../utils')
const server = require('../../../lib/server')
const Factory = require('../../factory')

lab.experiment('Authorization', () => {
  lab.test('check authorization should return access true for allowed', (done) => {
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/access/ROOTid/action_a/resource_a'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal({ access: true })

      done()
    })
  })

  lab.test('check authorization should return access false for denied', (done) => {
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/access/Modifyid/action_a/resource_a'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal({ access: false })

      done()
    })
  })

  lab.test('list authorizations should return actions allowed for the user', (done) => {
    const actionList = {
      actions: []
    }
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/list/ModifyId/not/my/resource'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal(actionList)

      done()
    })
  })

  lab.test('list authorizations should return actions allowed for the user', (done) => {
    const actionList = {
      actions: ['Read']
    }
    const options = utils.requestOptions({
      method: 'GET',
      // TO BE DISCUSSED: We need double slashes "//" if we use a "/" at the beginning of a resource in the policies
      // @see https://github.com/nearform/udaru/issues/198
      url: '/authorization/list/ManyPoliciesId//myapp/users/filippo'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal(actionList)

      done()
    })
  })

  lab.test('list authorizations should return actions allowed for the user', (done) => {
    const actionList = [
      {
        resource: '/myapp/users/filippo',
        actions: ['Read']
      },
      {
        resource: '/myapp/documents/no_access',
        actions: []
      }
    ]
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/list/ManyPoliciesId?resources=/myapp/users/filippo&resources=/myapp/documents/no_access'
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result).to.equal(actionList)

      done()
    })
  })
})

lab.experiment('Authorization root user in impersonated organization', () => {
  const NewOrgPolicyId = 'NewOrgPolicyId'
  const NewOrgId = 'NewOrgId'

  Factory(lab, {
    organizations: {
      org1: {
        id: NewOrgId,
        name: 'New Organization.',
        description: 'The Mighty New Organization.',
        policies: ['org1AdminPolicy']
      }
    },
    users: {
      user1: {
        id: 'AdminId',
        name: 'Mr. Admin No Policy',
        organizationId: 'ROOT'
      }
    },
    policies: {
      org1AdminPolicy: {
        id: NewOrgPolicyId,
        name: 'NewOrgPolicyId',
        organizationId: NewOrgId,
        statements: {
          Statement: [
            {
              Effect: 'Allow',
              Action: ['do:stuff'],
              Resource: ['all:stuff:*']
            }
          ]
        }
      }
    }
  })

  lab.test('The AdminId user and its organisation have no policies attached', (done) => {
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/users/AdminId',
      headers: {
        authorization: 'ROOTid'
      }
    })

    server.inject(options, (response) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result.policies).to.have.length(0)

      options.url = '/authorization/organizations/ROOT'
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(200)
        expect(response.result.policies).to.have.length(0)

        done()
      })
    })
  })

  lab.test('The NewOrgId organisation has one policy attached', (done) => {
    const options = utils.requestOptions({
      method: 'GET',
      url: `/authorization/organizations/${NewOrgId}`,
      headers: {
        authorization: 'ROOTid'
      }
    })

    server.inject(options, (response) => {
      expect(response.statusCode).to.equal(200)
      expect(response.result.policies[0].id).to.equal(NewOrgPolicyId)

      done()
    })
  })

  lab.test('A user should not inherit a list of actions from a policy assigned to an organization it does not belong to', (done) => {
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/list/AdminId/all:stuff:*',
      headers: {
        authorization: 'ROOTid',
        org: NewOrgId
      }
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result.actions).to.have.length(0)

      done()
    })
  })

  lab.test('A user should not inherit access to a resource from a policy assigned to an organization it does not belong to', (done) => {
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/access/AdminId/do:stuff/all:stuff:*',
      headers: {
        authorization: 'ROOTid',
        org: NewOrgId
      }
    })

    server.inject(options, (response) => {
      const result = response.result

      expect(response.statusCode).to.equal(200)
      expect(result.access).to.equal(false)

      done()
    })
  })
})

