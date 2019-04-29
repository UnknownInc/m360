import React, {Component} from 'react';
import { Container, Form, Header, Segment, Table, Icon, Checkbox, Button, Divider, Message, Popup, Responsive,Modal, FormButton, Tab, Comment, Loader, Input } from 'semantic-ui-react';

import { ACCOUNT_API, getHeaders } from '../../config'

class TeamView extends Component {

  constructor(props){
    super(props);
    this.state={
      newteammember:'',
      name:this.props.team.name,
      team:this.props.team
    }
  }
  async componentDidMount(){
  }

  handleChange = (e) => this.setState({newteammember: e.target.value});

  addNewTeamMember = async (e) => {
    e.preventDefault();
    this.setState({loading: true})
    try {
      const headers= getHeaders();

      headers['accept']='application/json';
      headers['content-type']='application/json';
      const add=[];
      const remove=[];
      if (this.state.newteammember) { add.push(this.state.newteammember)}
      const body={add, remove, name: this.state.name};
      const response = await fetch(`${ACCOUNT_API}/api/team/${this.props.team._id}`, {headers, method:'PUT', body:JSON.stringify(body)})

      if (response.status===401) {
        return this.setState({loading: false, errorHdr:'Not logged in.', errors:[]})
      }
      if (response.status>=400) {
        return this.setState({loading: false, errorHdr:'Unknown error', errors:[]})
      }

      const team = await response.json();
      team.children=team.children||[];
      this.setState({team, name:team.name, loading: false, errorHdr:null, errors:[], newteammember:''})

    } catch (err) {
      this.setState({loading: false, errorHdr:'Unable to add team member.', errors:[]})
    }
  }

  renderErrors(){
    const {errorHdr, errors=[]} = this.state;
    if (!errorHdr) return null
    return <Message error header={errorHdr} list={errors} />
  }

  renderTeamMember=(user)=>{
    return <Comment key={user._id}>
      <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
      <Comment.Content>
        <Comment.Author as='a'>{user.email}</Comment.Author>
        <Comment.Metadata>
          <div>{user.createdAt}</div>
        </Comment.Metadata>
        <Comment.Text>SAL1</Comment.Text>
        <Comment.Actions>
          <Comment.Action>x remove</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  }
  renderTeam() {
    const {name, team={}}=this.state;
    const {children=[]}=team;
    return <Comment.Group>
      {this.props.header?<Header as='h3'>
        {this.props.header}
      </Header>:null}
      <Header as={'h3'} ><small>Team Name: </small>
        <span> {name==''?'\u226A unspecified \u226B':name}&nbsp;&nbsp;</span>
        <small>
        <Popup
        trigger={<Button icon='edit'/>}
        content={<Form.Group>
          <Input value={name} placeholder={'\u226A unspecified \u226B'} onChange={e=>this.setState({name: e.target.value})}/>
          <Button color='green' icon='check' onClick={this.addNewTeamMember}/></Form.Group>}
        on='click'
        position='top right'  
      />
      <Popup
        trigger={<Button icon='users'/>}
        content={<Form.Group>
          <Input name="newteammember" placeholder='email' type='email' value={this.state.newteammember} onChange={this.handleChange}/>
          <Button onClick={this.addNewTeamMember} color='green' icon='check'/>
        </Form.Group>}
        on='click'
        position='top right'  
      /></small>
      </Header>

      {children.map((u,i)=>this.renderTeamMember(u))}
      <Divider/>
    </Comment.Group>
  }
  render(){
    const {loading} = this.state
    return <div>
      {this.renderErrors()}
      {loading?<Loader active inline>Loading...</Loader>:this.renderTeam()}
    </div>
  }
}

export default TeamView;
