.DEFAULT_GOAL = help

bin := $(shell npm bin)
babel := $(bin)/babel


# -- [ CONFIGURATION ] -------------------------------------------------
SRC_DIR := src
TGT_DIR := .
SRC := $(shell find $(SRC_DIR)/ -name '*.js')
TGT := ${SRC:$(SRC_DIR)/%=%}


# -- [ COMPILATION ] ---------------------------------------------------
$(TGT_DIR)/%: $(SRC_DIR)/%
	mkdir -p $(dir $@)
	$(babel) --source-map inline --out-file $@ $<

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


compile: node_modules $(TGT)

clean:
	rm -f $(TGT)

test:
	exit 1


.PHONY: help compile clean test
