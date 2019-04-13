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
      modalOpen: false
    }

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
      endpoint: 'http://localhost:4100/api/upload',
      id: 'XHRUpload'
    })
    .on('complete', (result) => {
      this.setState({ 
        alertOpen: true, 
        alertTitle: 'Moist!',
        alertText: 'You will be a Moist Dad on:'
      });
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

  render () {
    return (
      <div>
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