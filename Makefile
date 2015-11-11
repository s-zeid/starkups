-include config.mk

all: npm viewer
.PHONY: npm viewer clean deploy

ROOT = .
BIN = ${ROOT}/node_modules/.bin
LIB = ${ROOT}/node_modules

npm:
	npm install

viewer: npm
	cd $@ && make

clean:
	cd viewer && make clean

deploy:
	@([ x"${HOST}" != x"" ] && [ x"${DIR}" != x"" ]) && true || \
	 (echo 'error: `HOST` and `DIR` need to be set in `config.mk`' >&2; \
	  exit 1)
	ssh ${HOST} 'cd ${DIR}; pwd; git pull && git submodule update && make'
