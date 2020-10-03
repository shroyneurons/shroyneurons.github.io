import React, { useState, useParams } from 'react';
import ReactDOM from 'react-dom';
import logo from "./bkgc.PNG";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import classnames from 'classnames'
import { ListGroup, ListGroupItem, Container, Breadcrumb, BreadcrumbItem, Jumbotron, Form,Label,Input, FormFeedback, FormText } from 'reactstrap';
import {
    Alert,
    Modal, ModalHeader, ModalBody, ModalFooter,
    TabContent, TabPane,
    Table,
    UncontrolledAlert,
    Badge,
    Button,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText,
    FormGroup
  } from 'reactstrap';
  
const wg = [
"CES_Medica",
"CLAIMS_PROCESSORS",
"COMPLIANCE", 
"COSMOS", 
"Cust_Care_HP",
"Cust_Care_MR", 
"Cust_Care_Medica" ,
"Cust_Care_Medica_Full" ,
"Cust_Care_Medica_NAMS" ,
"Cust_Care_UHC" ,
"ELIG_HPHC" ,
"ELIG_Medica", 
"ELIG_UHC" ,
"EXCHANGE" ,
"HEALTH_SERVICES" ,
"HPHC"
];

const data = wg.map((string,i) => {
    return {
    id:i,
    workGroup:string,
    templates:[]
  };
});

data[1].templates.push("ELIG001");
data[1].templates.push("ELIG002");
data[1].templates.push("ELIG003");
data[1].templates.push("ELIG017");
data[1].templates.push("ELIG018");

const tableData1 = [ 
{ historyID: 566803690, relatedID: 566803690, letterGenerationID: 328519, topsCompoundKey: "712590,S123456789,KIMEDICASPOUSE3,SP,C405,4979237777,01,DLARSO2,M", createdDate: "25-FEB-18" },
{ historyID: 566803687, relatedID: 566803687, letterGenerationID: 328518, topsCompoundKey: "712590,S123456789,KIMEDICACHILD29,CH,C405,4979237777,01,DLARSO2,P", createdDate: "25-FEB-18" },
{ historyID: 566803685, relatedID: 566803685, letterGenerationID: 328517, topsCompoundKey: "712590,S123456789,KIMEDICACHILD26,CH,C405,4979237777,01,DLARSO2,P", createdDate: "25-FEB-18" },
{ historyID: 566803682, relatedID: 566803679, letterGenerationID: 328516, topsCompoundKey: "712590,S123456789,KIMEDICACHILD23,CH,C405,4979237777,01,DLARSO2,P", createdDate: "25-FEB-18" },
{ historyID: 566803679, relatedID: 566803679, letterGenerationID: 328515, topsCompoundKey: "712590,S123456789,KIMEDICACHILD23,CH,C405,4979237777,01,DLARSO2,P", createdDate: "25-FEB-18" }
]
const tableData2 = [ 
{ historyID: 12345, relatedID: 12345, letterGenerationID: 99278, topsCompoundKey: "23456,S909090988,KIMEDICACHACHA3,SP,C999,111111111,01,DLARSO2,M", createdDate: "01-SEP-20" },
{ historyID: 6789, relatedID: 6789, letterGenerationID: 45234, topsCompoundKey: "712590,S123456789,KIMEDICACHILD29,CH,C405,4979237777,01,DLARSO2,P", createdDate: "11-MAY-20" },
{ historyID: 1023, relatedID: 1023, letterGenerationID: 90987, topsCompoundKey: "712590,S123456789,KIMEDICACHILD26,CH,C405,4979237777,01,DLARSO2,P", createdDate: "25-FEB-18" },
{ historyID: 566803682, relatedID: 566803679, letterGenerationID: 328516, topsCompoundKey: "712590,S123456789,KIMEDICACHILD23,CH,C405,4979237777,01,DLARSO2,P", createdDate: "25-FEB-18" },
{ historyID: 566803679, relatedID: 566803679, letterGenerationID: 328515, topsCompoundKey: "712590,S123456789,KIMEDICACHILD23,CH,C405,4979237777,01,DLARSO2,P", createdDate: "25-FEB-18" }
]

var flag =1;

function findObjById(data,id) {

    return data.find((obj) => {
            
        return obj.id == id
    })
}

function searchData() {
    
    flag=!flag;
    return flag==1 ? tableData1 : tableData2
}

const HistoryModal = (props) => {
    const {
      id
    } = props;
  
    const [modal, setModal] = useState(false);
  
    const toggle = () => setModal(!modal);
  
    return (
      <div>
        <Link onClick={toggle}>{id}</Link>
        <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}><h5>Data For HistoryID: </h5><Badge>{id}</Badge></ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }


class Display extends React.Component {

    render() {
        
        const tData = this.props.tData.slice();
        var table = []
        var list=[]
        list.push(<th>#</th>)
        for(const prop in tData[0])
            list.push(<th>{prop}</th>)
        
        table.push(<thead><tr>{list}</tr></thead>) //thead data

        table.push(<tbody>{tData.map(
            (obj, i) => {
                
                var list=[]
                list.push(<th scope="row">{i+1}</th>)
                
                for (const prop in obj) {
                    
                    if(prop=="historyID")
                        list.push(<td><HistoryModal id={obj[prop]}/></td>)
                    else
                        list.push(<td>{obj[prop]}</td>)
                }
                return <tr>{list}</tr>

            }
        )}</tbody>)
        
        return (
            <div>
            <Table>{table}</Table>
            </div>
        )
    }   
}


class AlertUser extends React.Component {
    
    constructor(props) {
        super(props)
        this.state={
            visible:this.props.visible, 
        }
        console.log("IN AlertUser constructor(). visible : "+this.state.visible+" count : "+this.state.count)
    }

    toggle() {

        setTimeout(()=>{this.setState({
            visible:false,
        })},4000)
        
    }
    
    render(){
        
        console.log("IN AlertUser render(). visible : "+this.state.visible+" count : "+this.state.count)
        return  (
        <div> 
            <br/>
            <Alert color="danger" isOpen={this.state.visible} fade={true}>
                Invalid Selection.Try Again!
            </Alert>
            {this.state.visible==true && this.toggle()}
        </div>
        );
    }

}

class SearchForm extends React.Component {


    handleChangeFromDate = (e) => {

        this.props.onFromDateChange(e.target.value)
    }

    handleChangeToDate = (e) => {

        this.props.onToDateChange(e.target.value)
    }
    
    isValid()
    {
        console.log("called")
        if(!this.state.valid) 
            return (
            <div> 
                <br/>
                <Alert color="danger" isOpen={!this.state.valid} fade={true}>
                    Invalid Selection.Try Again!
                </Alert>
            </div>
            )
    }

    handleSubmit = (e) => {

        e.preventDefault();
        this.props.onSubmit()
    }

    render() {

        return (
            
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="fromDate">From Date :</Label>
                        <Input
                        type="date"
                        name="fromDate"
                        id="fromDate"
                        placeholder="date placeholder"
                        onChange={this.handleChangeFromDate}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="toDate">Till Date :</Label>
                        <Input
                        type="date"
                        name="toDate"
                        id="toDate"
                        placeholder="date placeholder"
                        onChange={this.handleChangeToDate}
                        />
                    </FormGroup>
                    <br/>
                    <Button color="primary">Search</Button>
                    <br/>
                </Form>
            </div>
        )
    }
}

class SearchForm2 extends React.Component {

    handleChangeTopsCompoundKey = (e) => {

        this.props.onTopsCompoundKeyChange(e.target.value)
    }

    handleSubmit = (e) => {

        e.preventDefault();
        this.props.onSubmit()
    }

    render() {

        return (
            
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="topsCompoundKey">Enter TOPS Compound Key :</Label>
                        <Input
                        type="text"
                        name="topsCompoundKey"
                        id="topsCompoundKey"
                        placeholder="Key"
                        onChange={this.handleChangeTopsCompoundKey}
                        />
                    </FormGroup>
                    <br/>
                    <Button color="primary">Search</Button>
                    <br/>
                </Form>
            </div>
        )
    }
}

class Search extends React.Component {

    constructor(props){
        super(props)
        
        console.log("Search props: "+this.props.match.params.wg_id)
        this.state = {
            wg_id: this.props.match.params.wg_id,
            doc_id: this.props.match.params.doc_id,
            fromDate: null,
            toDate: null,
            topsCompoundKey: null,
            isValidDate: true,
            isValidTopskey: true,
            showTable: false,
            tableData: null,
            activeTab: '1'
        }
    }

    handleFromDateChange = (fromDate) => {

        this.setState({
            fromDate: fromDate
        })
    }

    handleToDateChange = (toDate) => {

        this.setState({
            toDate : toDate
        })
    }

    handleTopsCompoundKeyChange = (topsCompoundKey) => {

        this.setState({
            topsCompoundKey : topsCompoundKey
        })
    }

    handleFormSubmit = () => {

        const fromDate = this.state.fromDate;
        const toDate = this.state.toDate;
        console.log("on pressing submit button this data is in Search: "+fromDate+" "+toDate )
        if(!fromDate || !toDate || fromDate>toDate)
            this.setState({isValidDate: false})
        else
        {

            this.setState({
                isValidDate: true,
                showTable: true,
                tableData: searchData()

            })
            console.log("IN Search handleFormSubmit() success  . fromDate : "+this.state.fromDate+" "+this.state.toDate+" "
            +this.state.isValidDate)

        }
    }

    handleFormSubmit2 = () => {

        const topsCompoundKey = this.state.topsCompoundKey;
        
        console.log("on pressing search2 button this data is in Search: "+topsCompoundKey )
        if(!topsCompoundKey)
            this.setState({

                isValidTopskey: false,
            })
        else
        {
            this.setState({
                
                isValidTopskey: true,
                showTable: true,
                tableData: searchData()

            })
            console.log("IN Search handleFormSubmit2() success  . topsCompoundKey : "+this.state.topsCompoundKey)
        }
    }

    toggle = (tab) => {
        if(this.state.activeTab !== tab) {
            
            let st = {activeTab: tab}
            if(tab==1)
                st.isValidTopskey = true
            if(tab==2)
                st.isValidDate = true            
            this.setState(st);
        }
    }

    
    render() {

        const wg_id = this.state.wg_id
        const doc_id = this.state.doc_id
        const obj = findObjById(data,wg_id);

        return (

            <div>
            <Container fluid>
            <div >
                <Breadcrumb tag="nav" listTag="div">
                <BreadcrumbItem> <Link to="/">WorkGroup:{obj.workGroup}</Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/'+wg_id}>Document:{doc_id}</Link></BreadcrumbItem>
                <BreadcrumbItem>Search</BreadcrumbItem>
                </Breadcrumb>
            </div>
            <br/>
            <h2 style={{paddingBottom:2}} >Enter Search Criteria</h2>
            <h5 className="lead">Choose a Filter :</h5>
            <hr color="blue" className="my-auto" />
            <br/>
            <Nav tabs>
                <NavItem>
                <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}
                >
                    Filter By Date
                </NavLink>
                </NavItem>
                <NavItem>
                <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}
                >
                    Filter By TOPS Compound Key
                </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                    <br/>
                    <SearchForm 
                    onFromDateChange={this.handleFromDateChange} 
                    onToDateChange={this.handleToDateChange}
                    onSubmit={this.handleFormSubmit}
                    />
                    <br/>
                {this.state.isValidDate==false && <Alert color="danger"  fade={true}>
                    Invalid Selection.Try Again!
                </Alert> }
                </TabPane>
                <TabPane tabId="2">
                    <br/>
                    <SearchForm2
                    onTopsCompoundKeyChange={this.handleTopsCompoundKeyChange} 
                    onSubmit={this.handleFormSubmit2}
                    />
                    <br/>
                    {this.state.isValidTopskey==false && <Alert color="danger" fade={true}>
                    Invalid Selection.Try Again!
                </Alert> }
                </TabPane>
            </TabContent>
            {/* {this.state.isValidDate==false && <AlertUser visible={true} />} */}
            <br/>
            <br/>
            {this.state.showTable==true && <Display tData={this.state.tableData} />}
            </Container>
            
            </div>
        );
    }

}

class Templates extends React.Component {

    constructor(props){
        super(props)
        console.log("Template props: "+this.props)
        this.state = {
            id:this.props.match.params.wg_id
        }
    }

    /*componentDidMount(){
        
        let id = this.props.match.params.wg_id;
        console.log("working . id = "+id)
        this.setState({
            id: id
        })
    }*/
    render() {

        // console.log("id data "+this.state.id+data.find((obj) => {
            
        //     return obj.id === this.state.id
        // }))
        const id = this.state.id;
        const obj = (findObjById(data,id))
        const list = obj.templates.map((template) => {

            const item=(<ListGroupItem><Link to={'./'+id+'/'+template}>{template}</Link></ListGroupItem>)
            return item
        } );

        return (

            <div>
            <div>
                <Container fluid>
                <div >
                    <Breadcrumb tag="nav" listTag="div">
                    <BreadcrumbItem> <Link to="/">WorkGroup:{obj.workGroup}</Link></BreadcrumbItem>
                    <BreadcrumbItem>Documents</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <br/>
                <h2 style={{paddingBottom:2}} >Document Template Selection</h2>
                <h5 className="lead">Choose a Template:</h5>
                <hr color="blue" className="my-auto" />
                <br/>
                </Container>
            </div>
            <Container><ListGroup>{list}</ListGroup></Container>
            </div>
        )
    }

}

class App extends React.Component {

    render() {

        return (
            
            <Router>
                <div className="App">
                <Switch>
                <Route exact path='/' component={WorkGroupList} />
                <Route exact path='/:wg_id' render={(props) => (
                <Templates {...props} value={1}/> 
                )} 
                />
                <Route exact path='/:wg_id/:doc_id' render={(props) => (
                <Search {...props} value={1}/> 
                )} 
                />
                </Switch>
                </div>
            </Router>

        );
    }
}

class WorkGroupList extends React.Component {

    constructor(props){
        super(props)
        this.state={
            workgroups: []
        }    
    }
    componentDidMount() {
        this.setState({
            workgroups: data.slice()
        }) 
    }

    render(){

        const list = this.state.workgroups.map((model) => {
            const item=(<ListGroupItem><Link to={'./'+model.id}>{model.workGroup}</Link></ListGroupItem>)
            return item
        })
        return (
            <div>
            {/*<img src={logo} alt="logo" width="100%" height="72">
                </img>*/}
            {/*<div>
            <Navbar color="light" light expand="md">
                <NavbarBrand><u>UserID</u>: <Badge color="primary">elgsys (145597946)</Badge></NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                    <NavLink href="https://www.google.com" target="_blank"><Button outline size="sm">User Settings</Button>{' '}</NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink href="https://github.com/reactstrap/reactstrap"><Button outline size="sm">Logoff</Button></NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
            </div>*/}
            
            <div>
                <Container fluid>
                <div >
                    <Breadcrumb tag="nav" listTag="div">
                    <BreadcrumbItem>WorkGroups</BreadcrumbItem> 
                    </Breadcrumb>
                </div>
                <br/>
                <h2 style={{paddingBottom:2}} >WorkGroup Selection</h2>
                <h5 className="lead">Choose a WorkGroup:</h5>
                <hr color="blue" className="my-auto" />
                <br/>
                </Container>
            </div>
            <Container><ListGroup>{list}</ListGroup></Container>
            </div>
        );
    }

}





ReactDOM.render(<App />,document.getElementById('root'))