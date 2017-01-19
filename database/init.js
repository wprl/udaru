'use strict'

const _ = require('lodash')
const async = require('async')
const pg = require('pg')
const config = require('./../src/lib/config')

if (!config.get('local')) {
  console.log('ERROR: You are trying to init the database while not in local environment.')
  process.exit(1)
}

const pgConf = _.clone(config.get('pgdb'))
/**
 * This is a hack to connect to PostgreSQL if you do not have a specific db.
 * @see https://github.com/olalonde/pgtools/blob/master/index.js#L43
 */
pgConf.database = 'postgres'

const client = new pg.Client(pgConf)

function connect (next) {
  client.connect(next)
}

function dropDb (next) {
  client.query(`DROP DATABASE IF EXISTS "${config.get('pgdb.database')}"`, function (err, result) {
    if (err) throw next(err)

    next()
  })
}

function createDb (next) {
  client.query(`CREATE DATABASE "${config.get('pgdb.database')}"`, function (err, result) {
    if (err) throw next(err)

    next()
  })
}

function dropAdminUser (next) {
  client.query('DROP USER IF EXISTS "admin"', function (err, result) {
    if (err) throw next(err)

    next()
  })
}

function createAdminUser (next) {
  client.query('CREATE USER "admin" WITH PASSWORD \'default\'', function (err, result) {
    if (err) throw next(err)

    next()
  })
}

async.series([
  connect,
  dropDb,
  createDb,
  dropAdminUser,
  createAdminUser
],
function (err) {
  if (err) console.log(err)

  client.end(function (err) {
    if (err) throw err

    console.log('Db init: done')
  })
})
