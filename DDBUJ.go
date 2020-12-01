package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws/credentials"
	v4 "github.com/aws/aws-sdk-go/aws/signer/v4"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

var domain = "https://search-borderfree-kpsncigx2tramdps7fwjrnvofi.us-east-2.es.amazonaws.com"
var region = "us-east-2"
var service = "es"
var svc *dynamodb.DynamoDB

const tableName = "Cupcake"
const query = "select Time.S from cupcakes order by rand() limit 100"

type queryResultType struct {
	Datarows [][]string `json:"datarows"`
}


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

func sendJSONToES(js string) {

	fmt.Println("Starting Sending ...")

	endpt := domain + "/test/_doc/1"
	bd := `{"js":` + js + `}`
	fmt.Println("update query: ")
	fmt.Println(bd)
	body := strings.NewReader(bd)
	makeRequest("PUT", endpt, body)

	fmt.Println("Done Sending")
}

func getData(query string) string {

	fmt.Println("Getting Data from ES")
	fmt.Println()

	endpoint := domain + "/_opendistro/_sql"
	queryJson := `{"query":` + query + `}`
	fmt.Println("queryJson:")
	fmt.Println(queryJson)
	body := strings.NewReader(string(queryJson))
	client := &http.Client{}

	req, err := http.NewRequest(http.MethodPost, endpoint, body)
	if err != nil {
		fmt.Println("Error while forming HTTP request")
		fmt.Println(err)
		os.Exit(1)
	}

	credentials := credentials.NewStaticCredentials("AKIAZXNVXOZFIKKUOSOQ", "6rpB7DjNhy0gJXzXklU/+Lsl9tLPMEtFtfhFD8Pz", "")
	signer := v4.NewSigner(credentials)

	req.Header.Add("Content-Type", "application/json")

	// Sign the request, send it, and print the response
	signer.Sign(req, body, service, region, time.Now())
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error while sending HTTP request")
		fmt.Println(err)
		os.Exit(1)
	}

	defer resp.Body.Close()

	responseData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	responseString := string(responseData)
	fmt.Println("Query Data Result:")
	fmt.Println(responseString)

	fmt.Println("Done Getting Data")

	return responseString
}

func connectDynamo() {

	sess, err := session.NewSession()
	if err != nil {
		fmt.Println("Error creating session ", err)
		os.Exit(1)
	}

	// Create DynamoDB client
	svc = dynamodb.New(sess)

}

func updateDynamoDBItem(tym, score, tableName string) {

	fmt.Println("Updating Item")
	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":s": {
				N: aws.String(score),
			},
			":u": {
				S: aws.String(time.Now().String()),
			},
		},
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"Time": {
				S: aws.String(tym),
			},
		},
		ReturnValues:     aws.String("UPDATED_NEW"),
		UpdateExpression: aws.String("set Score = :s, UpdatedTime = :u"),
	}

	_, err := svc.UpdateItem(input)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	fmt.Println("Successfully updated ")
}

func Handler() {

	p := fmt.Println
	p("-----------------------------------------------------------")
	p("Running New Job")
	p("****Connecting Dynamo****")
	connectDynamo()
	queryResultJson := getData(query)
	queryResult := queryResultType{}
	json.Unmarshal([]byte(queryResultJson), &queryResult)

	var tym = ""
	var score = ""
	s1 := rand.NewSource(time.Now().UnixNano())
	r1 := rand.New(s1)
	var updatedValues = map[string]string{}

	for _, row := range queryResult.Datarows {

		tym = row[0]
		score = strconv.Itoa(r1.Intn(100))
		fmt.Printf("Updating row for Time = %s with Score = %s", tym, score)
		updateDynamoDBItem(tym, score, tableName)
		updatedValues[tym] = score

	}

	updateValuesString, err := json.Marshal(updatedValues)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	p(string(updateValuesString))
	p("sending the above json of update info to ES ")
	sendJSONToES(string(updateValuesString))

}

func main() {
	lambda.Start(Handler)
}
