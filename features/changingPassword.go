package main

import (
	"fmt"
	"strings"
	"net/http"
	"io/ioutil"
)

func main() {

	url := "https://YOUR_DOMAIN/api/v2/users/USER_ID"

	payload := strings.NewReader("{\"password\": \"NEW_PASSWORD\",\"connection\": \"Username-Password-Authentication\"}")

	req, _ := http.NewRequest("PATCH", url, payload)

	req.Header.Add("content-type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))

}