import React, { Component } from 'react';
import { view } from 'react-easy-state';
import appStore from './appStore';
import { DashboardModal } from '@uppy/react'
import Uppy from '@uppy/core';
import Webcam from '@uppy/webcam';
import XHRUpload from '@uppy/xhr-upload';
import SweetAlert from 'sweetalert2-react';


class Home extends Component {
constructor (props) {
    super(props)

    this.state = {
      modalOpen: false,
      moistDad:'',
      latestDads: []
    }

    this.domainName = 'vyzed.com';

    this.uppy = Uppy({
      debug: true,
      autoProceed: false,
      restrictions: {
        maxFileSize: 5000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ['image/*', 'video/*']
      }
    })
    .use(Webcam, { id: 'Webcam'})
    .use(XHRUpload, {
      endpoint: 'http://'+this.domainName+':4100/api/upload',
      id: 'XHRUpload'
    })
    .on('complete', (result) => {
      this.setState({ 
        alertOpen: true, 
        alertTitle: 'Moist!',
        alertText: 'You will be a Moist Dad on:'
      });
      this.updatePastDads()
      this.uppy.reset()
      console.log('successful files:', result.successful)
      console.log('failed files:', result.failed)
    })
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)

    
  }

  handleOpen () {
    this.setState({
      modalOpen: true
    })
  }

  handleClose () {
    this.setState({
      modalOpen: false
    })
  }

  updateDadOfDay(){
    fetch('http://'+domainName+':4100/api/getMoistDadOfDay', {
      method: 'GET'
    }).then(res => res.json())
    .then(response => {
      this.setState({moistDad:'http://'+domainName+':4100/'+response[0].files[0].path})
    })
    .catch(error => console.error('Error:', error));
  }

  updatePastDads(){
    fetch('http://'+domainName+':4100/api/getLatestDads', {
      method: 'GET'
    }).then(res => res.json())
    .then(response => {
      console.log(response);
      this.setState({latestDads: response});
    })
    .catch(error => console.error('Error:', error));
  }

  componentDidMount() {
    this.updateDadOfDay()
    this.updatePastDads()
  }

  render () {
    return (
      <div>
          <div className="moist-old-dads">
          {this.state.latestDads.map((dad, index) => (
            <div key={index}>
              <img src={'http://'+domainName+':4100/'+dad.files[0].path}/>
            </div>
          ))}
          </div>
          <div className="moist-bg" style={{backgroundImage:'url("'+this.state.moistDad+'")'}}>
          </div>
          <button className='uppy-btn btn btn-lg btn-success' onClick={this.handleOpen}>Submit a MoistDad</button>
          <DashboardModal
          uppy={this.uppy}
          closeModalOnClickOutside
          open={this.state.modalOpen}
          note="File must be under 5MB"
          closeAfterFinish={true}
          snowProgressDetails={true}
          onRequestClose={this.handleClose}
          plugins={['Webcam','XHRUpload']}
          />
          <SweetAlert
          show={this.state.alertOpen}
          title={this.state.alertTitle}
          text={this.state.alertText}
          onConfirm={() => this.setState({ alertOpen: false })}
          />
      </div>
    );
  }
}

export default view(Home);