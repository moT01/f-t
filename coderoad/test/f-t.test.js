const assert = require('assert');
const fs = require('fs');
const util = require('util');
const path = require('path');

const readdir = util.promisify(fs.readdir);
const getRootDir = async (dir = process.cwd()) => {
	const pathToRoot = path.join(dir, '..');
	const rootDir = await readdir(pathToRoot);

  if (!rootDir) {
    throw new Error(`Could not find folder ${pathToRoot}`);
  }

	return rootDir;
}

describe("first-tutorial folder", () => {
  let rootDir;
  before(async () => {
    rootDir = await getRootDir();
  });

  it('should have an index.html file', async () => {
		assert(rootDir.indexOf('index.html') >= 0)
  });
});

const readFile = util.promisify(fs.readFile);
const getIndexFile = async (dir = process.cwd()) => {
	const pathToIndex = path.join(dir, '..', 'index.html');
	const indexFile = await readFile(pathToIndex);

  if (!indexFile) {
    throw new Error(`Could not find ${pathToIndex}`);
  }
	return indexFile;
}

describe("index.html", () => {
  let indexFile;
  before(async () => {
    indexFile = await getIndexFile();
  });

	it('should have a DOCTYPE', () => {
		assert(/<!doctype html>/i.test(indexFile));
	});
});

const removeWhiteSpace = (str = '') => {
  return str.replace(/\s/g, '');
};

const getPsqlLogFile = async (dir = process.cwd()) => {
	const pathToPsqlLogFile = path.join(dir, '../../../../var/log/postgresql', 'postgresql-12-main.log');
	const psqlLogFile = await readFile(pathToPsqlLogFile, 'utf8');

  if (!psqlLogFile) {
    throw new Error(`Could not find ${pathToPsqlLogFile}`);
  }
	return psqlLogFile;
}

describe("database", () => {
  let logFile;
  before(async () => {
    logFile = await getPsqlLogFile();
  });

	it('should have a log', () => {
    console.log('logFile')
    logFile = logFile.split('LOG:  statement: ');
    const lastLog = removeWhiteSpace(logFile[logFile.length-1]);
    console.log(lastLog);
    const re = /SELECTd\.datnameas"Name",pg_catalog\.pg_get_userbyid\(d\.datdba\)as"Owner",pg_catalog\.pg_encoding_to_char\(d\.encoding\)as"Encoding",d\.datcollateas"Collate",d\.datctypeas"Ctype",pg_catalog\.array_to_string\(d\.datacl,E'\\n'\)AS"Accessprivileges"FROMpg_catalog\.pg_databasedORDERBY1;$/;
		assert(re.test(lastLog));
	});
});

// solution