#!/usr/bin/env node
/* eslint-disable no-console */

'use strict'

// Core
let fs = require('fs'),
	path = require('path')

// Vendor
let program = require('commander'),
	moment = require('moment')

// Local
let toolbag = require('../lib/toolbag'),
	config = require('../config')

// Constants
let kMigrationDirectory = config.database.migrations.umzug.migrations.path,
	kMigrationSqlDirectory = config.database.migrations.sqlPath

program
.usage('<migration sql file>')
.parse(process.argv)

let sqlFile = program.args[0]
if (!sqlFile) {
	program.outputHelp()
	process.exit(1)
}

if (!toolbag.fileExists(sqlFile)) {
	console.error('SQL file:', sqlFile, 'does not exist!')
	process.exit(1)
}

let baseSqlFileName = path.basename(sqlFile),
	sqlFileInWrongDirectory = path.resolve(sqlFile) !== path.resolve(kMigrationSqlDirectory, baseSqlFileName)
if (sqlFileInWrongDirectory) {
	console.error(`SQL file ${sqlFile} must exist in the following directory: ${kMigrationSqlDirectory}`)
	process.exit(1)
}

let migrationJs = `module.exports = require('../sql-file-to-migration')('${baseSqlFileName}')\n`,
	migrationFileName = moment().format('YYYYMMDDHHmmss') + '_' + baseSqlFileName + '.js',
	migrationFile = path.resolve(kMigrationDirectory, migrationFileName)

fs.writeFileSync(migrationFile, migrationJs)
console.log('Created migration', migrationFile)
