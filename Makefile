.DEFAULT_GOAL = help

bin        := $(shell npm bin)
babel      := $(bin)/babel
eslint     := $(bin)/eslint
mocha      := $(bin)/mocha
browserify := $(bin)/browserify
uglify     := $(bin)/uglifyjs
karma      := $(bin)/karma
nyc        := $(bin)/nyc
coveralls  := $(bin)/coveralls


# -- [ COMPILATION ] ---------------------------------------------------
node_modules: package.json
	npm install


# -- [ TASKS ] ---------------------------------------------------------
.PHONY: help
help:
	@echo ""
	@echo "AVAILABLE TASKS"
	@echo ""
	@echo "  bundle ................. Generates a Browser bundle of Folktale."
	@echo "  compile ................ Compiles the project."
	@echo "  clean .................. Removes build artifacts."
	@echo "  test ................... Runs unit tests for the project."
	@echo "  test-documentation ..... Tests the documentation examples in the project."
	@echo "  test-all ............... Runs unit and documentation tests for the project."
	@echo "  test-browser ........... Runs the tests in PhantomJS."
	@echo "  test-sauce ............. Runs the tests in SauceLabs (requires sauceconnect + env vars)."
	@echo "  lint ................... Lints all source files."
	@echo "  documentation .......... Builds the documentation from source."
	@echo ""

.PHONY: bundle _bundle
bundle: compile _bundle
_bundle:
	mkdir -p packages/base/dist/umd
	$(browserify) packages/base/build/index.js --standalone folktale --outfile packages/base/dist/umd/folktale.js
	$(uglify) --mangle - < packages/base/dist/umd/folktale.js > packages/base/dist/umd/folktale.min.js

.PHONY: compile
compile:
	DISABLE_MM_COMMENTS=true $(babel) packages/base/source --source-map inline --out-dir packages/base/build

.PHONY: compile-annotated
compile-annotated:
	$(babel) packages/base/source --source-map inline --out-dir packages/base/build/annotated

.PHONY: compile-test
compile-test:
	$(babel) test/source --copy-files --source-map inline --out-dir test/build --ignore test/source/browser/mocha.js

.PHONY: bundle-test
bundle-test:
	$(browserify) test/build/browser/browser-tests.js --source-map inline --outfile test/build/browser/tests.tmp.js
	mv test/build/browser/tests.tmp.js test/build/browser/browser-tests.js
	cp test/source/browser/mocha.js test/build/browser/mocha.js

.PHONY: compile-documentation
compile-documentation:
	node tools/markdown-to-mm.js annotations/source annotations/build

.PHONY: clean
clean:
	rm -rf packages/base/build packages/base/dist
	rm -rf test/build
	rm -rf annotations/build

.PHONY: _prepare-test
_prepare-test: clean compile compile-annotated compile-test

.PHONY: test _test
test: _prepare-test _test
_test:
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd --recursive test/build/specs

.PHONY: test-all _test-all
test-all: _prepare-test compile-documentation _test-all
_test-all:
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd --recursive test/build/specs

.PHONY: test-minimal
test-minimal:
	FOLKTALE_ASSERTIONS=none $(mocha) --require babel-polyfill --reporter dot --ui bdd --recursive test/build/specs

.PHONY: test-documentation _test-documentation
test-documentation: _prepare-test compile-documentation _test-documentation
_test-documentation:
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd --grep "documentation examples" --recursive test/build/specs

.PHONY: coverage
coverage: clean
	NODE_ENV=test $(MAKE) compile-documentation
	FOLKTALE_ASSERTIONS=minimal NODE_ENV=test $(nyc) $(mocha) --require babel-polyfill --uid bdd --recursive test/source/specs

.PHONY: test-browser _test-browser
test-browser: _prepare-test bundle-test _test-browser
_test-browser:
	$(karma) start test/karma-local.js

.PHONY: test-sauce _test-sauce
test-sauce: _prepare-test bundle-test _test-sauce
_test-sauce:
	$(karma) start test/karma-sauce.js

.PHONY: travis-tests
travis-tests: tools
	$(MAKE) clean
	$(MAKE) compile-documentation
	FOLKTALE_ASSERTIONS=none $(nyc) $(mocha) --require babel-polyfill --ui bdd --recursive test/source/specs
	NODE_ENV=dev $(MAKE) _prepare-test
	$(MAKE) bundle-test
	NODE_ENV=dev $(karma) start test/karma-local.js
	$(nyc) report --reporter=text-lcov | $(coveralls)

.PHONY: documentation _documentation
documentation: compile compile-annotated compile-documentation _documentation
_documentation:
	node tools/generate-docs.js en

.PHONY: lint
lint:
	$(eslint) packages/base/source

.PHONY: tools
tools:
	cd metamagical && npm install
	cd metamagical/packages/babel-plugin-assertion-comments && npm install && make build && npm link
	npm link babel-plugin-transform-assertion-comments
	cd metamagical/packages/babel-plugin-metamagical-comments && npm install && make build && npm link
	npm link babel-plugin-transform-metamagical-comments
	cd metamagical/packages/interface && npm install && make build && npm link
	npm link metamagical-interface
	cd metamagical/packages/mocha-bridge && npm install && make build && npm link
	npm link metamagical-mocha-bridge
	cd metamagical/packages/repl && npm install && make build && npm link
	npm link metamagical-repl
	cd tools/static-docs && npm install && make build && npm link
	npm link metamagical-static-docs

.PHONY: release-base
release-base: lint test-all test-browser # test-sauce
	$(eval VERSION := $(shell node -pe "require('./packages/base/package.json').version"))
	$(MAKE) clean
	$(MAKE) compile
	$(MAKE) compile-annotated
	$(MAKE) bundle
	$(MAKE) compile-documentation
	$(MAKE) _documentation
	cd docs && bundle exec jekyll build
	mkdir -p packages/base/releases/
	rm -rf packages/base/releases/$(VERSION)
	cp -R packages/base/build packages/base/releases/$(VERSION)
	cp -R docs/_site packages/base/releases/$(VERSION)/docs
	cp -R packages/base/dist packages/base/releases/$(VERSION)/dist
	cp packages/base/package.json packages/base/releases/$(VERSION)/package.json
	cp packages/base/CHANGELOG.md packages/base/releases/$(VERSION)/CHANGELOG.md
	cd packages/base/releases/$(VERSION) && zip -r ../folktale-base-$(VERSION).zip *