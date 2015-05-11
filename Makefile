documentation:
	cd docs && $(MAKE) html

test:
	exit -1

.PHONY: documentation test
