import React, {Component} from 'react';
import { Container, Form, Header, Segment, Table, Icon, Checkbox, Button, Divider, Message, Popup, Responsive,Modal, FormButton, Tab, Comment } from 'semantic-ui-react';

import { ACCOUNT_API, getHeaders } from '../../config'

class TeamView extends Component {

  constructor(props){
    super(props);
    this.state={
      loading: true,
      newteammember:'',
    }
  }
  async componentDidMount(){
    this.setState({loading: true, errorHdr:null, errors:[]})
    try{
      const headers= getHeaders();
      const response = await fetch(`${ACCOUNT_API}/api/team`, {headers})

      if (response.status===401) {
        return this.setState({loading: false, errorHdr:'Not logged in.', errors:[]})
      }
      if (response.status>=400) {
        return this.setState({loading: false, errorHdr:'Unknown error', errors:[]})
      }
      const node = await response.json();
      this.setState({loading: false, errorHdr:null, errors:[], node: node});
    } catch (err) {
      this.setState({loading: false, errorHdr:'Unable to retrive the team list.', errors:[]})
    }
  }

  handleChange = (e) => this.setState({newteammember: e.target.value});

  addNewTeamMember = async (e) => {
    e.preventDefault();
    try {
      const headers= getHeaders();

      headers['accept']='application/json';
      headers['content-type']='application/json';

      const body={add:[this.state.newteammember], remove:[]};
      const response = await fetch(`${ACCOUNT_API}/api/team`, {headers, method:'PUT', body:JSON.stringify(body)})

      if (response.status===401) {
        return this.setState({loading: false, errorHdr:'Not logged in.', errors:[]})
      }
      if (response.status>=400) {
        return this.setState({loading: false, errorHdr:'Unknown error', errors:[]})
      }

      const node = response.json();
      node.children=node.children||[];
      this.setState({node, loading: false, errorHdr:null, errors:[], newteammember:''})

    } catch (err) {
      this.setState({loading: false, errorHdr:'Unable to add team member.', errors:[]})
    }
  }

  renderErrors(){
    const {errorHdr, errors=[]} = this.state;
    if (!errorHdr) return null
    return <Message error header={errorHdr} list={errors} />
  }

  render(){
    const {node={children:[]}} = this.state
    return <div>
      {this.renderErrors()}
      <Comment.Group>
        {this.props.header?<Header as='h3' dividing>
          {this.props.header}
        </Header>:null}

        {node.children.map((u,i)=>{

          return (
            <Comment key={u._id}>
              <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
              <Comment.Content>
                <Comment.Author as='a'>{u.email}</Comment.Author>
                <Comment.Metadata>
                  <div>{u.createdAt}</div>
                </Comment.Metadata>
                <Comment.Text>SAL1</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>+ Add Team</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          )
        })}
        <Divider/>
        <Form reply>
          <Form.Input name="newteammember" value={this.state.newteammember} onChange={this.handleChange}/>
          <Button content='Add Team Members' labelPosition='left' icon='edit' secondary onClick={this.addNewTeamMember} />
        </Form>
      </Comment.Group>
    </div>
  }
}

export default TeamView;
