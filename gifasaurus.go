package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"text/template"
)

var indextpl = template.Must(template.ParseFiles("views/index.html"))
var files, _ = ioutil.ReadDir("img")

func index(w http.ResponseWriter, r *http.Request) {
	indextpl.Execute(w, map[string]interface{}{
		"images": files,
	})
}

func imager() http.Handler {
	abspath, _ := os.Getwd()
	imgpath := http.Dir(abspath + "/img/")
	return http.StripPrefix("/img/", http.FileServer(imgpath))
}

func static() http.Handler {
	abspath, _ := os.Getwd()
	staticpath := http.Dir(abspath + "/static/")
	return http.StripPrefix("/static/", http.FileServer(staticpath))
}

func main() {
	http.HandleFunc("/", index)
	http.Handle("/static/", static())
	http.Handle("/img/", imager())
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
