import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom'
import Notifications from 'react-notify-toast'


import Spinner from './components/Spinner'
import Confirm from './pages/Confirm'
import Landing from './pages/Landing'
import Admin,{AdminQuestions, AdminUsers, AdminSettings} from './pages/Admin'
import ProfilePage from './pages/Profile';
import Footer from './components/Footer/Footer'
import './App.css';
import { Menu, Icon, Segment } from 'semantic-ui-react';
import LoginSwitch from './components/LoginSwitch';
import { isNullOrUndefined } from 'util';


const MenuLink = ({ label, to, activeOnlyWhenExact, ...menuProps })=>{
  return (
    <Route
      path={to}
      exact={activeOnlyWhenExact}
      children={({ match }) => (
        <Menu.Item {...menuProps} active={!isNullOrUndefined(match)}>
          <Link to={to}>{label}</Link>
        </Menu.Item>
      )}
    />
  );
}

class App extends Component {

  // A bit of state to make sure the server is up and running before the user 
  // can interact with the app.
  state = {
    loading: true
  }

  // When the component mounts, a simple GET request is made to 'wake up' the 
  // server. A lot of free services like Heroku and Now.sh will put your server 
  // to sleep if no one has used your application in a few minutes. Using a 
  // service like uptimerobot.com to ping the server regularly can mitigate 
  // sleepiness.
  componentDidMount = () => {
    fetch('/ping')
      .then(res => {
        this.setState({ loading: false })
      })
      .catch(err => console.log(err))
  }

  render() {

    // The 'content' function determines what to show the user based on whether 
    // the server is awake or not.
    const content = () => {
      
      // The server is still asleep, so provide a visual cue with the <Spinner /> 
      // component to give the user that feedback.
      if (this.state.loading) {
        return <Spinner size='massive' mesage='Loading...' />
      }

      // The server is awake! React Router is used to either show the 
      // <Landing /> component where the emails are collected or the <Confirm /> 
      // component where the emails are confirmed.
      return (
        <BrowserRouter>
          <div>
            <Menu pointing secondary fixed='top' color='blue' inverted>
              <Menu.Menu>
                <Menu.Item>
                  <Link to='/'><Icon name='bars'/></Link>
                </Menu.Item>
              </Menu.Menu>

              <LoginSwitch 
                adminView={<MenuLink to='/admin' label="Admin"/>}/>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Link to='/profile'>
                    <LoginSwitch 
                      defaultView={<Icon name='key'/>} 
                      loggedInView={<Icon name='user circle' size='large'/>} 
                      adminView={<Icon name='user circle' color='yellow' size='large'/>}/>
                  </Link>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Switch>
              <Route exact path='/verify/:id' component={Confirm} />
              <Route exact path='/profile' component={ProfilePage} />
              <Route exact path='/admin/settings' component={AdminSettings} />
              <Route exact path='/admin/users' component={AdminUsers} />
              <Route exact path='/admin/questions' component={AdminQuestions} />
              <Route exact path='/admin' component={Admin} />
              <Route exact path='/' component={Landing} />
              <Redirect from='*' to='/'/>
            </Switch>
          </div>
        </BrowserRouter>
      )
    }

    return (
      // The 'container' class uses flexbox to position and center its three 
      // children: <Notifications />, <main> and <Footer /> 
      <div className='container fadein'>
        {/* 
          <Notifications > component from 'react-notify-toast'. This is the 
          placeholder on the dom that will hold all the feedback toast messages 
          whenever notify.show('My Message!') is called.
        */}
        <Notifications />
        <main>
          {content()}
        </main>
        {/* <Footer/> */}
      </div>
    )
  }
}

export default App;
