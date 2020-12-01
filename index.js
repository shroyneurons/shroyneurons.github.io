import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import './index.css'

var query1 = "select Score.N, Time.S from cupcakes order by Time.S limit 10000"
var query2 = "select * from test"

var responseDataJSON = {}

async function getQueryData(query) { 

  
  let result = await axios.options('https://b3kvmb9f8b.execute-api.us-east-2.amazonaws.com/dev?query="' + query + '"')
  console.log("after await axios.get printing result and result.data")
  console.log(result)
  console.log(result.data)

  return result.data;

}

class Demo extends React.Component {

  constructor(props) {
      super(props)
      this.noOfTimesRendered = 0;
      this.state = {
          data: null
      }
  }

  sortFunction = (a, b) => {

    if (a.name === b.name) {
        return 0;
    }
    else {
        return (a.name < b.name) ? -1 : 1;
    }
  }

  verifyData = async () => {
    console.log("JSON created from data from API result: ")
    console.log(responseDataJSON)
    var result = await getQueryData(query2)
    var lambdaJSON = null
    if(result.status == 200){
      lambdaJSON = result.datarows[0][0]
    }
    console.log("lambdaJSON: ")
    console.log(lambdaJSON)

    for(const prop in lambdaJSON){
      if(lambdaJSON[prop] != responseDataJSON[prop]){
          console.log("This record mismatches for time: " + prop)
          console.log("lambdaJSON[prop]")
          console.log(lambdaJSON[prop])
          console.log("responseDataJSON[prop]:")
          console.log(responseDataJSON[prop])
      }
    }
  }

  populateData = async () => {
      
      const result = await getQueryData(query1)
      let data;
      console.log("after await getQueryData() printing  result")
      if(result.status == 200){
        data = result.datarows.map((arr) => {

          responseDataJSON[arr[1]] = arr[0]
          return {name:arr[1], score: parseInt(arr[0])}
        })
      }
      console.log("apna naya data from response is: ")
      console.log(data)
      this.verifyData()
      //data.sort(this.sortFunction)
      this.setState({
        data: data
      })

  }

  componentDidMount = () => {

      this.populateData()
  }

  render() {

    this.noOfTimesRendered++;
    console.log("In render data = ")
    console.log(this.state.data)
    return (
        <div style={{ backgroundColor: "white",boxShadow:"0 2px 2px 0 rgba(0,0,0,0.12)", height: "400px", width:"1160px", position: "relative", left:"60px"}}>
        <div style={{ alignItems:"center", height:"56px",lineHeight:"56px", borderBottom: "1px solid #cccccc",paddingLeft:"28px"}}>
          Interest over time
        </div>
        <br/>
        <br/>
        {!this.state.data ? <div style={{position: "absolute",top: "40%", width:"100%", textAlign: "center"}}><h1>{this.noOfTimesRendered <=1 ? "Loading ..." : "NO SUCH DATA AVAILABLE"}</h1></div> :
        <>
        <LineChart
          width={1150}
          height={280}
          data={this.state.data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid stroke="#cac4c3" strokeWidth={0.45} vertical={0} strokeDasharray="3 0" />
          <XAxis stroke="#9f9593" fontSize={13} dataKey="name"/>
          <YAxis fontSize={13} stroke="#cac4c3" strokeWidth={0}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#2196f3" strokeWidth={3.5} dot={{r:0}} activeDot={{ r: 5 }} />
        </LineChart></>}
      </div>
    );
  }
}

// ReactDOM.render(<Demo />,document.getElementById('root'))
ReactDOM.render(<Demo />,document.getElementById('root'))