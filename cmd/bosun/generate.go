package main

//go:generate sh tsc.sh
//go:generate esc -o web/static.go -pkg web -prefix web/static web/static/
