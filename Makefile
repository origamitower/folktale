.DEFAULT_GOAL = help

bin        := $(shell npm bin)
babel      := $(bin)/babel
eslint     := $(bin)/eslint
mocha      := $(bin)/mocha
browserify := $(bin)/browserify
uglify     := $(bin)/uglifyjs
karma      := $(bin)/karma
VERSION    := $(shell node -e 'console.log(require("./package.json").version)')


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
	@echo "  publish ................ Publishes the current version."
	@echo ""

.PHONY: bundle _bundle
bundle: compile _bundle
_bundle:
	mkdir -p dist
	$(browserify) index.js --standalone folktale > dist/folktale.js
	$(uglify) --mangle - < dist/folktale.js > dist/folktale.min.js

.PHONY: compile
compile:
	DISABLE_MM_COMMENTS=true $(babel) src --source-map inline --out-dir .

.PHONY: compile-annotated
compile-annotated:
	$(babel) src --source-map inline --out-dir annotated

.PHONY: compile-test
compile-test:
	$(babel) test/specs-src --source-map inline --out-dir test/specs
	$(babel) test/helpers-src --source-map inline --out-dir test/helpers
	$(browserify) test/browser/browser-tests.js --source-map inline > test/browser/tests.js

.PHONY: compile-documentation
compile-documentation:
	node tools/markdown-to-mm.js docs/source docs/build

.PHONY: clean
clean:
	rm -rf core helpers data test/specs test/helpers index.js docs/build docs/api annotated

.PHONY: _prepare-test
_prepare-test: clean compile compile-annotated compile-test

.PHONY: test _test
test: _prepare-test _test
_test:
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd test/specs

.PHONY: test-all _test-all
test-all: _prepare-test compile-documentation _test-all
_test-all:
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd test/specs

.PHONY: test-minimal
test-minimal:
	FOLKTALE_ASSERTIONS=none $(mocha) --require babel-polyfill --reporter dot --ui bdd test/specs

.PHONY: test-documentation _test-documentation
test-documentation: _prepare-test compile-documentation _test-documentation
_test-documentation:
	FOLKTALE_ASSERTIONS=minimal $(mocha) --require babel-polyfill --reporter spec --ui bdd --grep "documentation examples" test/specs

.PHONY: test-browser _test-browser
test-browser: _prepare-test _test-browser
_test-browser:
	$(karma) start test/karma-local.js

.PHONY: test-sauce _test-sauce
test-sauce: _prepare-test _test-sauce
_test-sauce:
	$(karma) start test/karma-sauce.js

.PHONY: all-tests
all-tests: tools _prepare-test
	$(MAKE) compile-documentation
	$(MAKE) _test-all
	$(MAKE) _test-browser

.PHONY: documentation _documentation
documentation: compile compile-annotated compile-documentation _documentation
_documentation:
	node tools/generate-docs.js en

.PHONY: lint
lint:
	$(eslint) src/

.PHONY: publish
publish: clean lint
	rm -rf node_modules
	npm install
	$(MAKE) tools
	$(MAKE) _prepare-test
	$(MAKE) _test-all
	$(MAKE) _test-browser
	# $(MAKE) _test-sauce
	git checkout -b "publish/$(VERSION)"
	$(MAKE) _documentation
	-git add --update
	git commit -m "(release) Publishes version $(VERSION)" --allow-empty
	git tag "release/$(VERSION)"
	git push --tags
	git push origin "publish/$(VERSION)"
	$(MAKE) _bundle
	mkdir -p releases
	zip -r "releases/folktale-$(VERSION).zip" package.json README.md LICENCE FAQ.md CHANGELOG.md CODE_OF_CONDUCT.md CONTRIBUTING.md CONTRIBUTORS test docs/index.html docs/prism.css docs/prism.js docs/style.css docs/api/ index.js helpers/ data/ core/ dist/
	npm publish

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

