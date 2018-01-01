.PHONY: _css
_css:
	../node_modules/.bin/stylus --watch --out css/screen.css stylus/screen.styl

.PHONY: _jekyll
_jekyll:
	bundle exec jekyll serve --incremental

.PHONY: run
run:
	$(MAKE) _css &
	$(MAKE) _jekyll
