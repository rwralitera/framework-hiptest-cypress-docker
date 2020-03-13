const { reporters } = require('mocha');
const RPClient = require('reportportal-client');

const { testItemStatuses, events, entityType } = require('./constants');

const { FAILED, PASSED, SKIPPED } = testItemStatuses;

const promiseErrorHandler = promise => {
  promise.catch(err => {
    console.error(err);
  });
};

let runnerSuiteId = null;
let runnerTestId = null;

class ReportPortalReporter extends reporters.Base {
  constructor(runner, config) {
    super(runner);
    this.runner = runner;
    this.config = config.reporterOptions;
    this.launchObject = null;
    this.client = new RPClient(config.reporterOptions);
    this.testStartRequestsPromises = {};
    this.lastFailedTestRequestPromises = {};
    this.currentSuiteId = null;
    this.currentTestId = null;
    const { tempId, promise } = this.client.startLaunch({
      name: 'tests',
      start_time: this.client.helpers.now(),
      description: 'Automation tests for the DEMO',
    });
    promiseErrorHandler(promise);
    this.tempLaunchId = tempId;
    this.parentIds = {};

    runner.on('suite', suite => {
      runnerSuiteId = `suite${Date.now().toString()}`;
      suite.cid = runnerSuiteId;
      this.suiteStart(suite);
    });
    runner.on('suite end', suite => {
      suite.cid = runnerSuiteId;
      this.suiteEnd(suite);
    });
    runner.on('test', test => {
      runnerTestId = Date.now().toString();
      test.cid = runnerTestId;
      this.testStart(test);
    });
    runner.on('test pending', test => {
      test.cid = runnerTestId;
      this.testPending(test);
    });
    runner.on('pass', test => {
      test.cid = runnerTestId;
      this.testPass(test);
    });
    runner.on('fail', test => {
      test.cid = runnerTestId;
      this.testFail(test);
    });
    runner.on('end', () => {
      this.finishLaunch();
    });
    runner.on('rp:log', (level, message) => {
      this.sendLog(level, message);
    });
  }

  getParentIds(suiteId) {
    if (this.parentIds[suiteId]) {
      return this.parentIds[suiteId];
    }

    this.parentIds[suiteId] = [];
    return this.parentIds[suiteId];
  }

  getParentId(suiteId) {
    const parentIds = this.getParentIds(suiteId);
    if (!parentIds.length) {
      return null;
    }
    return parentIds[parentIds.length - 1];
  }

  addParentId(suiteId, id) {
    const parentIds = this.getParentIds(suiteId);
    parentIds.push(id);
  }

  clearParent(suiteId) {
    const parentIds = this.getParentIds(suiteId);
    parentIds.pop();
  }

  suiteStart(suite) {
    const suiteStartObj = { type: entityType.SUITE, name: suite.title.slice(0, 255).toString() };
    this.currentSuiteId = suite.cid;

    if (suite.tags && suite.tags.length > 0) {
      suiteStartObj.tags = suite.tags.map(tag => tag.name);
    }

    if (suite.description) {
      suiteStartObj.description = suite.description;
    }

    if (!suiteStartObj.name) {
      return;
    }
    const { tempId, promise } = this.client.startTestItem(
      suiteStartObj,
      this.tempLaunchId,
      this.getParentId(suite.cid)
    );
    promiseErrorHandler(promise);
    this.addParentId(suite.cid, tempId);
    this.currentSuiteId = tempId;
  }

  suiteEnd(suite) {
    const parentId = this.getParentId(suite.cid);
    if (parentId === null) return;
    const { promise } = this.client.finishTestItem(parentId, {});
    promiseErrorHandler(promise);
    this.clearParent(suite.cid);
  }

  testStart(test) {
    if (!test.title) {
      return;
    }
    const testStartObj = { type: entityType.TEST, name: test.title.slice(0, 255).toString() };

    const { tempId, promise } = this.client.startTestItem(
      testStartObj,
      this.tempLaunchId,
      this.currentSuiteId // this.getParentId(test.cid)
    );
    promiseErrorHandler(promise);
    this.testStartRequestsPromises[test.cid] = promise;

    this.addParentId(test.cid, tempId);

    this.currentTestId = tempId;
  }

  testPass(test) {
    this.testFinished(test, PASSED);
  }

  testFail(test) {
    this.testFinished(test, FAILED);
  }

  testPending(test) {
    this.testFinished(test, SKIPPED, { issue_type: 'NOT_ISSUE' });
  }

  testFinished(test, status, issue) {
    const parentId = this.getParentId(test.cid);
    const finishTestObj = { status, issue };

    if (status === FAILED) {
      const level = 'error';
      const message = `Stacktrace: ${test.err.stack}\n`;
      finishTestObj.description = `${test.file}\n\`\`\`error\n${message}\n\`\`\``;
      this.client.sendLog(parentId, {
        message,
        level,
        time: this.client.helpers.now(),
      });
      console.log(message);
    }

    const { promise } = this.client.finishTestItem(parentId, finishTestObj);
    promiseErrorHandler(promise);

    if (status === FAILED) {
      this.lastFailedTestRequestPromises[test.cid] = this.testStartRequestsPromises[test.cid];
    }
    this.clearParent(test.cid);
    delete this.testStartRequestsPromises[test.cid];
  }

  sendLog(level, message) {
    const { promise } = this.client.sendLog(this.currentTestId, {
      message: String(message),
      level,
      time: this.client.helpers.now() + 1,
    });
    promiseErrorHandler(promise);
  }

  finishLaunch() {
    this.client.finishLaunch(this.tempLaunchId);
  }

  rpSendLog(level, message) {
    this.runner.emit(events.RP_LOG, level, message);
  }
}

module.exports = ReportPortalReporter;
