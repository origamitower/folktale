.DEFAULT_GOAL = help

bin        := $(shell npm bin)
babel      := $(bin)/babel
eslint     := $(bin)/eslint
mocha      := $(bin)/mocha
browserify := $(bin)/browserify
uglify     := $(bin)/uglifyjs


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
	@echo "  bundle ................. Generates a Browser bundle of Folktale."
	@echo "  compile ................ Compiles the project."
	@echo "  clean .................. Removes build artifacts."
	@echo "  test ................... Runs the tests for the project."
	@echo "  lint ................... Lints all source files."
	@echo ""

bundle:
	mkdir -p dist
	$(browserify) index.js --standalone folktale > dist/folktale.js
	$(uglify) --mangle - < dist/folktale.js > dist/folktale.min.js

compile:
	$(babel) src --source-map inline --out-dir .

compile-test:
	$(babel) test --source-map inline --out-dir test

clean:
	rm -f $(TGT) $(TEST_TGT)
	rm -r core helpers data

test: compile compile-test
	FOLKTALE_ASSERTIONS=minimal $(mocha) --reporter spec --ui bdd

documentation: compile
	node tools/generate-docs.js

lint:
	$(eslint) .


.PHONY: help bundle compile clean test lint
