package web

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/MiniProfiler/go/miniprofiler"
	"github.com/StackExchange/tsaf/search"
	"github.com/gorilla/mux"
)

// A Sorted List of Available Metrics
func UniqueMetrics(t miniprofiler.Timer, w http.ResponseWriter, r *http.Request) {
	values := search.UniqueMetrics()
	b, err := json.Marshal(values)
	if err != nil {
		serveError(w, err)
		return
	}
	w.Write(b)
}

func TagKeysByMetric(t miniprofiler.Timer, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	metric := vars["metric"]
	keys := search.TagKeysByMetric(metric)
	b, err := json.Marshal(keys)
	if err != nil {
		serveError(w, err)
		return
	}
	w.Write(b)
}

func TagValuesByMetricTagKey(t miniprofiler.Timer, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	metric := vars["metric"]
	tagk := vars["tagk"]
	q := r.URL.Query()
	var values []string
	if len(q) > 0 {
		tsf := make(map[string]string)
		for k, v := range q {
			tsf[k] = strings.Join(v, "")
		}
		values = search.FilteredTagValuesByMetricTagKey(metric, tagk, tsf)
	} else {
		values = search.TagValuesByMetricTagKey(metric, tagk)
	}
	b, err := json.Marshal(values)
	if err != nil {
		serveError(w, err)
		return
	}
	w.Write(b)
}

func MetricsByTagPair(t miniprofiler.Timer, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tagk := vars["tagk"]
	tagv := vars["tagv"]
	values := search.MetricsByTagPair(tagk, tagv)
	b, err := json.Marshal(values)
	if err != nil {
		serveError(w, err)
		return
	}
	w.Write(b)
}

func TagValuesByTagKey(t miniprofiler.Timer, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tagk := vars["tagk"]
	values := search.TagValuesByTagKey(tagk)
	b, err := json.Marshal(values)
	if err != nil {
		serveError(w, err)
		return
	}
	w.Write(b)
}