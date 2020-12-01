package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

var svc *dynamodb.DynamoDB

const tableName = "Cupcake"

var attributeDefinitions = []*dynamodb.AttributeDefinition{
	{
		AttributeName: aws.String("Time"),
		AttributeType: aws.String("S"),
	},
}

var keySchema = []*dynamodb.KeySchemaElement{
	{
		AttributeName: aws.String("Time"),
		KeyType:       aws.String("HASH"),
	},
}

var provisionedThroughput = &dynamodb.ProvisionedThroughput{
	ReadCapacityUnits:  aws.Int64(5),
	WriteCapacityUnits: aws.Int64(5),
}

type TableItem struct {
	Time        string
	Score       int
	UpdatedTime string
}

func connectDynamo() {

	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	svc = dynamodb.New(sess, &aws.Config{
		Region: aws.String("us-east-2"),
	})

}

func createTable(tableName string, attributeDefinitions []*dynamodb.AttributeDefinition, keySchema []*dynamodb.KeySchemaElement, provisionedThroughput *dynamodb.ProvisionedThroughput) {

	input := &dynamodb.CreateTableInput{
		AttributeDefinitions:  attributeDefinitions,
		KeySchema:             keySchema,
		ProvisionedThroughput: provisionedThroughput,
		TableName:             aws.String(tableName),
	}

	_, err := svc.CreateTable(input)
	if err != nil {
		fmt.Println("Got error calling CreateTable:")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	fmt.Println("Created the table", tableName)
}

func putItem(item TableItem, tableName string) {

	av, err := dynamodbattribute.MarshalMap(item)
	if err != nil {
		fmt.Println("Got error marshalling new movie item:")
		fmt.Println(err.Error())
		os.Exit(1)
	}
	//fmt.Printf("marshalled struct: %+v \n", av)

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}

	_, err = svc.PutItem(input)

	if err != nil {
		fmt.Println("Got error calling PutItem:")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	fmt.Println("\nSuccessfully added '" + item.Time + "' to table " + tableName)
}

func main() {

	p := fmt.Println

	os.Setenv("AWS_ACCESS_KEY_ID", "AKIAZXNVXOZFKMI2RAO2")
	os.Setenv("AWS_SECRET_ACCESS_KEY", "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")
	os.Setenv("AWS_REGION", "us-east-2")

	connectDynamo()
	p("Creating Table " + tableName + "...")
	createTable(tableName, attributeDefinitions, keySchema, provisionedThroughput)

	fmt.Scanln()
	csv, err := ioutil.ReadFile("multiTimeline.csv") //reading csv file data
	if err != nil {
		p("Got error reading file:")
		p(err.Error())
		os.Exit(1)
	}

	for i := 0; i < len(csv); i++ {

		// extracting year-month and score details from the read data and inserting that data in dynamodb
		col1 := "" // year-month
		col2 := "" // score
		for ; i < len(csv) && csv[i] != 44; i++ {
			col1 += string(csv[i])
		}
		i++
		for ; i < len(csv) && csv[i] != 10; i++ {
			col2 += string(csv[i])
		}
		//fmt.Print(col1 + ": " + col2 + "\n")
		num, _ := strconv.Atoi(col2)

		item := TableItem{
			Time:        col1,
			Score:       num,
			UpdatedTime: time.Now().String(),
		}
		putItem(item, tableName)
	}

}
