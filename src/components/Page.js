import React,{Component} from 'react'

import {Loader, Dimmer, Image, Segment} from 'semantic-ui-react';


export default props => {
  const style={};
  if (props.loading) {
    return <div className='page'>
      <div style={{display:'flex', justifyContent:'center', padding: "1em"}}>
        <Loader active inline size='massive'> Loading...</Loader>
      </div>
    </div>
  }
  if (props.center) {
    style.width='auto';
  }
  return <div className='page' style={style}>
    {props.children}
  </div>
}
