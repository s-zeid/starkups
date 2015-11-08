all: npm viewer
.PHONY: npm clean viewer

ROOT = .
BIN = ${ROOT}/node_modules/.bin
LIB = ${ROOT}/node_modules

npm:
	npm install

viewer: npm
	cd $@ && make

clean:
	cd viewer && make clean
