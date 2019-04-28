import React, { Component } from 'react'
import { notify } from 'react-notify-toast'
import Spinner from '../components/Spinner'
import { ACCOUNT_API, getHeaders } from '../config'
import Home from './Home'
import { Dimmer, Form, Loader } from 'semantic-ui-react';

export default class Landing extends Component {

  // A bit of state to give the user feedback while their email address is being 
  // added to the User model on the server.
  state = {
    loading: true,
    email:'',
    iagree: false,
    sendingEmail: false
  }

  componentDidMount() {
    this.setState({loading: true})

    const headers= getHeaders();
    
    fetch(`${ACCOUNT_API}/api/profile`, { headers})
      .then(res => res.json())
      .then(profile => {
        if (profile.error) {
          this.setState({loading: false, profile: null})
        } else { 
          this.setState({loading: false, profile})
        }
      })
      .catch(err=>{
        this.setState({loading: false, profile: null})
      })
  }

  handleChange = (event, {name, value}) => {
    this.setState({[name]: value})
  }

  handleCheckboxChange = (e,{checked})=>{
    this.setState({iagree: checked})
  }

  onSubmit = event => {
    event.preventDefault()
    this.setState({ sendingEmail: true})

    fetch(`${ACCOUNT_API}/api/register`, {
      method: 'POST',
      headers: {
        accept: 'application/json', 
        'content-type': 'application/json'
      },
      body: JSON.stringify({ email: this.state.email })
    })
    .then(res => res.json())  
    .then(data => {
      
      // Everything has come back successfully, time to update the state to 
      // reenable the button and stop the <Spinner>. Also, show a toast with a 
      // message from the server to give the user feedback and reset the form 
      // so the user can start over if she chooses.
      this.setState({ sendingEmail: false})
      notify.show(data.message)
      this.form.reset()
    })
    .catch(err => console.log(err))
  }

  renderHome = () =>{
    return <Home profile={this.state.profile}/>
  }

  render = () => {
    const { sendingEmail, email, iagree } = this.state

    if (this.state.loading) {
        return <Spinner size='massive' message='Loading...' />
    }

    if (this.state.profile) {
      return this.renderHome()
    }

    return (<div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
        <Dimmer.Dimmable as={'div'} dimmed={sendingEmail}>
          <Dimmer active={sendingEmail}>
            <Loader>Wait while we register your email...</Loader>
          </Dimmer>
          <Form
            onSubmit={this.onSubmit}>
            <Form.Group>
            <Form.Input
              placeholder='Your work email'
              name='email'
              type='email'
              value={email}
              onChange={this.handleChange}
              required
              error={!iagree}
              size='huge'
              disabled={!iagree }
              action={{color:'blue', content:'Register'}}
            />
            </Form.Group>
            <Form.Group>
              <Form.Checkbox
                name='iagree'
                label='I agree to the Terms and Conditions'
                checked={iagree}
                onChange={this.handleCheckboxChange}
                />
            </Form.Group>
          </Form>
        </Dimmer.Dimmable>
    </div>)
  }
}
