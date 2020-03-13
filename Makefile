makefile := $(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
#
# VARIABLE
#-----------------------------------------------------------------------------

BASE_URL = "http://127.0.0.1:84/"
DIR = $(CURDIR)
CWD=/cypress/integration/
TEST_RUN_NAME = Test
REPORT := $(ls *.xml)
TAG = Datainit
OPTION= --verbose

AWK := $(shell command -v awk 2> /dev/null)
.DEFAULT_GOAL := help
.PHONY: help

help:
ifndef AWK
	@fgrep -h "##" $(makefile) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
else
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(makefile) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
endif

#
# EXPORTS
#-----------------------------------------------------------------------------

export CYPRESS_BASE_URL=$(BASE_URL)
#Print console.log to Terminal
export ELECTRON_ENABLE_LOGGING=true


#
# COMMANDES
#-----------------------------------------------------------------------------

_DELETE_	=@rm -f $(DIR)/cypress/*.yaml
_CLEAN_TEST_FOLDER_	=@rm -Rf $(DIR)/cypress/integration/tests/**/**
_CLEAN_REPORT_FOLDER_	=@rm -Rf $(DIR)/multiple-results/*
_GET_ALL_		=@hiptest-publisher $(OPTION) -c hiptest-publisher.conf --without=actionwords --force
_GET_TEST_RUN_NAME_		=@hiptest-publisher $(OPTION) -c hiptest-publisher.conf --without=actionwords --test-run-name $(TEST_RUN_NAME) --force
_TAGGED_	=@hiptest-publisher $(OPTION) -c hiptest-publisher.conf --without=actionwords --force --filter-on-tags=$(TAG)
_HEADED_		=@npx cypress run --headed --reporter mocha-reportportal --reporter mocha-multi-reporters --reporter-options configFile=config.json --spec 'cypress/integration/tests/**/**' --env configFile=localhost || true
_HEADLESS_	=@npx cypress run --reporter mocha-reportportal --reporter mocha-multi-reporters --reporter-options configFile=config.json --spec 'cypress/integration/tests/**/**' --env configFile=localhost || true
_OPEN_		=@npx cypress open --env configFile=localhost || true
_NPM_INSTALL_	=@npm install
_PUSH_		=@hiptest-publisher $(OPTION) --config-file hiptest-publisher.conf --push="./multiple-results/*.xml" --push-format=junit
_DEBUG_		=@hiptest-publisher --config-file hiptest-publisher.conf --show-actionwords-diff \
			@hiptest-publisher --config-file hiptest-publisher.conf --actionwords-signature --force \
			@hiptest-publisher --config-file hiptest-publisher.conf --show-actionwords-signature-changed --force \
			@hiptest-publisher --config-file hiptest-publisher.conf --show-actionwords-renamed --force \
			@hiptest-publisher --config-file hiptest-publisher.conf --show-actionwords-deleted --force
_PUSH_SLACK_ = php slack.php
_MOCHAWESOME_MERGE_=@npx mochawesome-merge --reportDir multiple-results/results > mochawesome.json
_MOCHAWESOME_REPORT_GENERATOR_=@npx mochawesome-report-generator mochawesome.json

##
## COMMANDES
##-----------------------------------------------------------------------------
get_all: ## Get all tests from Hiptest (Ex: make get_all)
	$(_CLEAN_TEST_FOLDER_)
	$(_CLEAN_REPORT_FOLDER_)
	$(_GET_ALL_)

get_testname: ## Get tests with testname from Hiptest (Ex: make get_testname TEST_RUN_NAME=Test)
	$(_CLEAN_TEST_FOLDER_)
	$(_CLEAN_REPORT_FOLDER_)
	$(_GET_TEST_RUN_NAME_)

open: ## Open Cypress with HEADED mode based on given BASE_URL (Ex: make open BASE_URL=http://127.0.0.1:84/)
	$(_OPEN_)

run_all_headed: ## Get all tests from Hiptest and then launch them with HEADED mode (Ex: make run_all_headed BASE_URL=http://127.0.0.1:84/)
	$(_CLEAN_TEST_FOLDER_)
	$(_CLEAN_REPORT_FOLDER_)
	$(_GET_ALL_)
	$(_HEADED_)
	$(_PUSH_)

run_all_headless: ## Get all tests from Hiptest and then launch them with HEADLESS mode (Ex: make run_all_headless BASE_URL=http://127.0.0.1:84/)
	$(_CLEAN_TEST_FOLDER_)
	$(_CLEAN_REPORT_FOLDER_)
	$(_GET_ALL_)
	$(_HEADLESS_)
	$(_PUSH_)

run_testname_headed: ## Get testname from Hiptest and then launch them with HEADED mode (Ex: make run_testname_headed BASE_URL=http://127.0.0.1:84/ TEST_RUN_NAME=Test)
	$(_CLEAN_TEST_FOLDER_)
	$(_CLEAN_REPORT_FOLDER_)
	$(_GET_TEST_RUN_NAME_)
	$(_HEADED_)
	$(_PUSH_)

run_testname_headless: ## Get testname from Hiptest and then launch them with HEADED mode (Ex: make run_testname_headless BASE_URL=http://127.0.0.1:84/ TEST_RUN_NAME=Test)
	$(_CLEAN_TEST_FOLDER_)
	$(_CLEAN_REPORT_FOLDER_)
	$(_GET_TEST_RUN_NAME_)
	$(_HEADLESS_)
	$(_PUSH_)

run_tagged_tests: ## Get tagged tests from Hiptest and then launch them with HEADED mode (Ex: make run_tagged_tests BASE_URL=http://127.0.0.1:84/ TAG=Test)
	$(_CLEAN_TEST_FOLDER_)
	$(_CLEAN_REPORT_FOLDER_)
	$(_TAGGED_)
	$(_HEADED_)
	$(_PUSH_)

run_local_test: ## Launched already downloaded test into test folder with HEADED mode (Ex: make run_local_test BASE_URL=http://127.0.0.1:84/)
	$(_CLEAN_REPORT_FOLDER_)
	$(_HEADED_)
	$(_MOCHAWESOME_MERGE_)
	$(_MOCHAWESOME_REPORT_GENERATOR_)
	