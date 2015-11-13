all: npm viewer
.PHONY: npm mdlite clean

ROOT = ..
BIN = ${ROOT}/node_modules/.bin
LIB = ${ROOT}/node_modules

npm:
	cd ${ROOT}; make npm

viewer: npm index.html

index.html: src/viewer.html src/viewer.js src/viewer.css \
            bundle.js mdlite
	${BIN}/vulcanize --inline-scripts --inline-css $< > $@

bundle.js: src/viewer.js ${ROOT}/starkups.js
	${BIN}/browserify $< | ${BIN}/uglifyjs - > $@

mdlite: ${LIB}/material-design-lite
	rm -rf $@
	mkdir $@
	cp -a $^/material.min.js $@
	cp -a $^/dist/material.brown-deep_purple.min.css $@/material.min.css
	sed -i -f $@.sed $@/material.min.css

clean:
	rm -rf index.html bundle.js mdlite
