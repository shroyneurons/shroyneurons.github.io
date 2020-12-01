package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/credentials"
	v4 "github.com/aws/aws-sdk-go/aws/signer/v4"
)

var domain = "https://search-borderfree-kpsncigx2tramdps7fwjrnvofi.us-east-2.es.amazonaws.com"
var index = "cupcakes"
var endpt = domain + "/" + index + "/" + "_doc" + "/"

var region = "us-east-2"
var service = "es"

func makeRequest(method, endpoint string, body *strings.Reader) {

	client := &http.Client{}

	req, err := http.NewRequest(method, endpoint, body)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	credentials := credentials.NewStaticCredentials("AKIAZXNVXOZFIKKUOSOQ", "6rpB7DjNhy0gJXzXklU/+Lsl9tLPMEtFtfhFD8Pz", "")
	signer := v4.NewSigner(credentials)

	req.Header.Add("Content-Type", "application/json")
	signer.Sign(req, body, service, region, time.Now())
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Println(resp.Status + "\n")
}

func handleInsert(record events.DynamoDBEventRecord) {

	fmt.Println("Handling INSERT Event")
	newImage := record.Change.NewImage
	fmt.Println(newImage)

	newTime := newImage["Time"].String()
	newScore, err := newImage["Score"].Integer()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Printf("New row added with Time = %s and Score = %d\n", newTime, newScore)

	endpoint := endpt + newTime
	fmt.Println()

	newImageJson, _ := json.Marshal(newImage)
	fmt.Println("newImageJson: ")
	fmt.Println(string(newImageJson))
	body := strings.NewReader(string(newImageJson))
	client := &http.Client{}
	makeRequest("PUT", endpoint, body)

	fmt.Println("Done handling INSERT Event")
}

func handleModify(record events.DynamoDBEventRecord) {

	fmt.Println("Handling MODIFY Event")
	fmt.Println(record.Change.OldImage)
	fmt.Println(record.Change.NewImage)

	oldTime := record.Change.OldImage["Time"].String()
	oldScore, _ := record.Change.OldImage["Score"].Integer()
	newScore, _ := record.Change.NewImage["Score"].Integer()
	fmt.Printf("Scores changed - OldScore =  %d , NewScore = %d\n", oldScore, newScore)

	endpoint := endpt + oldTime + "/_update"
	fmt.Println()

	newImage := record.Change.NewImage
	newImageJson, _ := json.Marshal(newImage)
	bd := `{"doc":` + string(newImageJson) + `}`
	fmt.Println("update query: ")
	fmt.Println(bd)
	body := strings.NewReader(bd)
	makeRequest("POST", endpoint, body)

	fmt.Println("Done handling MODIFYEvent")

}

func handleRemove(record events.DynamoDBEventRecord) {

	fmt.Println("Handling REMOVE Event")
	fmt.Println(record.Change.OldImage)

	oldTime := record.Change.OldImage["Time"].String()
	oldScore, _ := record.Change.OldImage["Score"].Integer()

	fmt.Printf("Row removed with Time = %s and Score = %d\n", oldTime, oldScore)

	endpoint := endpt + oldTime
	fmt.Println()
	body := strings.NewReader("")
	makeRequest("DELETE", endpoint, body)

	fmt.Println("Done handling REMOVE Event")
}

func HandleRequest(ctx context.Context, e events.DynamoDBEvent) {

	fmt.Println("---------------------------------------")
	fmt.Println(e)

	for _, record := range e.Records {
		fmt.Printf("Processing request data for event ID %s, type %s.\n", record.EventID, record.EventName)
		if record.EventName == "INSERT" {
			handleInsert(record)
		} else if record.EventName == "MODIFY" {
			handleModify(record)
		} else if record.EventName == "REMOVE" {
			handleRemove(record)
		}

	}

	fmt.Println("---------------------------------------")
}

func main() {
	lambda.Start(HandleRequest)
}
