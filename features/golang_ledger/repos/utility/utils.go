package utility

import (
	"encoding/json"

	"github.com/sirupsen/logrus"

	"github.com/unrolled/render"
)

var R *render.Render
var Log *logrus.Entry

//pakcage for adding for utitliy functions

// IsBlank ...
func IsBlank(v interface{}) bool {
	if v == 0 {
		return true
	}
	if v == "" {
		return true
	}
	if v == nil {
		return true
	}
	return false
}

// Unmarshal ...
func Unmarshal(body []byte, v interface{}) interface{} {
	PrintError(json.Unmarshal(body, v))
	return v
}

// Marshal ...
func Marshal(v interface{}) []byte {
	data, err := json.Marshal(v)
	PrintError(err)
	return data
}

// PrintError ...
func PrintError(e error) {
	if e != nil {
		Log.Println(e)
	}
}
