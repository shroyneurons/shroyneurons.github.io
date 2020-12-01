package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
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
var region = "us-east-2"
var service = "es"

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
	fmt.Println("body:")
	fmt.Printf(responseString)

	fmt.Println("Done Getting Data")
	return responseString
}

func handleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	fmt.Println("---------------------------------------")
	fmt.Println(request.QueryStringParameters)
	fmt.Println(request.MultiValueQueryStringParameters)
	fmt.Println(request.PathParameters)

	fmt.Printf("Processing request data for request %s.\n", request.RequestContext.RequestID)
	fmt.Printf("Body size = %d.\n", len(request.Body))

	query := request.QueryStringParameters["query"]
	res := getData(query)
	headers := map[string]string{"Access-Control-Allow-Headers": "*", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "*", "Accept": "*/*"}
	return events.APIGatewayProxyResponse{Body: res, StatusCode: 200, Headers: headers}, nil
}

func main() {
	lambda.Start(handleRequest)
}
