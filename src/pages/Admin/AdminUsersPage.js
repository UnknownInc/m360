import React, {Component} from 'react';
import { Header, Icon, Container } from 'semantic-ui-react';
import Page from '../../components/Page';

class AdminUsersPage extends Component {
  render(){
    return <Page>
      <Container>
        <Header as={'h1'}> <Icon name="user circle"/>Users</Header>
      </Container>
    </Page>
  }
}

export default AdminUsersPage;
