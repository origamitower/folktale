.DEFAULT_GOAL = help

bin := $(shell npm bin)
babel := $(bin)/babel


# -- [ CONFIGURATION ] -------------------------------------------------
SRC_DIR := src
SRC := $(shell find $(SRC_DIR)/ -name '*.js')
TGT := ${SRC:$(SRC_DIR)/%.js=%.js}


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
	@echo ""


compile: node_modules
	$(babel) src --source-map inline --out-dir .

clean:
	rm -f $(TGT)
	rm -r core

test:
	exit 1


.PHONY: help compile clean test
