'use strict'

const { expect } = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const utils = require('../../utils')
const server = require('../../../lib/server')

const Factory = require('../../factory')

lab.experiment('Issue #396: Reproduction', () => {
  Factory(lab, {
    organizations: {
      org1: {
        id: 'NewOrgId',
        name: 'New Organization.',
        description: 'The Mighty New Organization.'
      }
    },
    users: {
      user1: {
        id: 'AdminId',
        name: 'Mr. Admin No Policy',
        organizationId: 'ROOT'
      },
    },
    policies: {
      org1AdminPolicy: {
        name: 'NewOrgPolicyId',
        organizationId: 'NewOrgId',
        statements: {
          Statement: [
            {
              Effect: 'Allow',
              Action: ['do:stuff'],
              Resource: ['all:stuff:*'],
            }
          ]
        }
      },
    }
  })

  lab.test('A user should not inherit a list of actions from a policy assigned to an organization it does not belong to', (done) => {
    const options = utils.requestOptions({
      method: 'GET',
      url: '/authorization/list/AdminId/all:stuff:*',
      headers: {
        authorization: 'ROOTid',
        org: 'NewOrgId'
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
        org: 'NewOrgId'
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

