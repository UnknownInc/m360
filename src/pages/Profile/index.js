import React, {Component} from 'react';
import loadable from '@loadable/component'
import Page from '../../components/Page';


const ProfilePage = loadable(() => import('./ProfilePage'), {
  fallback:<Page loading={true}>...</Page>,
})

export default class LoadableDashboard extends React.Component {
  render() {
    return <ProfilePage />;
  }
}
