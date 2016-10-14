'use strict';

const glob = require('glob');
const path = require('path');
const child_process = require('child_process');
const argv = require('yargs').argv;

const tslintCommand = path.resolve('./node_modules/.bin/tslint');
const istanbulCommand = path.resolve('./node_modules/.bin/istanbul');
const buildDir = path.resolve('./build');
const coverageDir = path.resolve('./coverage');

glob('src/tests/**/*.ts.lint', (error, files) => {
  if (error) {
    throw error;
  }

  files
    .map(file => path.dirname(file))
    .forEach(dir => {
      const pathToBuildDir = path.resolve(dir, buildDir);
      const pathToCoverageDir = path.resolve(dir, coverageDir);

      child_process.execSync(getTestCommand(pathToBuildDir, pathToCoverageDir), {
        cwd: dir,
        stdio: 'inherit'
      });
    });
});

function getTestCommand(buildDir, coverageDir) {
  if (argv.coverage) {
    return `${istanbulCommand} cover --root ${buildDir} --dir ${coverageDir} --report json --print none --include-pid ${tslintCommand} -- --test .`;
  } else {
    return `${tslintCommand} --test .`;
  }
}