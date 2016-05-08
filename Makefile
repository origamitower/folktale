.DEFAULT_GOAL = help

bin    := $(shell npm bin)
babel  := $(bin)/babel
eslint := $(bin)/eslint
mocha  := $(bin)/mocha


# -- [ CONFIGURATION ] -------------------------------------------------
SRC_DIR := src
SRC := $(shell find $(SRC_DIR)/ -name '*.js')
TGT := ${SRC:$(SRC_DIR)/%.js=%.js}

TEST_DIR := test
TEST_SRC := $(shell find $(TEST_DIR)/ -name '*.es6')
TEST_TGT := ${TEST_SRC:$(TEST_DIR)/%.es6=%.js}


# -- [ COMPILATION ] ---------------------------------------------------
node_modules: package.json
	npm install


# -- [ TASKS ] ---------------------------------------------------------
help:
	@echo ""
	@echo "AVAILABLE TASKS"
	@echo ""
	@echo "  compile ................ Compiles the project."
	@echo "  clean .................. Removes build artifacts."
	@echo "  test ................... Runs the tests for the project."
	@echo "  lint ................... Lints all source files."
	@echo ""


compile: $(SRC)
	$(babel) src --source-map inline --out-dir .

compile-test: $(TEST_SRC)
	$(babel) test --source-map inline --out-dir test

clean:
	rm -f $(TGT) $(TEST_TGT)
	rm -r core helpers data

test: compile compile-test
	$(mocha) --reporter spec --ui bdd

test-watch: compile
	$(babel) test --source-map inline --out-dir test --watch &
	$(mocha) --reporter min --ui bdd --watch

lint:
	$(eslint) .


.PHONY: help compile clean test lint test-watch
