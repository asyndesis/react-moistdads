import React, { Component } from 'react';
import { view } from 'react-easy-state';
import appStore from './appStore';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Webcam from '@uppy/webcam';
import XHRUpload from '@uppy/xhr-upload';


class Upload extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };

    this.strapUppy = () => {
      const uppy = Uppy({
        debug: true,
        autoProceed: false,
        restrictions: {
          maxFileSize: 5000000,
          maxNumberOfFiles: 1,
          minNumberOfFiles: 1,
          allowedFileTypes: ['image/*', 'video/*']
        }
      })
      .use(Dashboard, {
        trigger: '.UppyModalOpenerBtn',
        inline: true,
        target: '.uppy-target',
        replaceTargetContent: true,
        showProgressDetails: true,
        note: 'Upload an image up to 5 MB',
        height: 470,
        metaFields: [
          { id: 'name', name: 'Name', placeholder: 'file name' },
          { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
        ],
        browserBackButtonClose: true
      })
      //.use(GoogleDrive, { target: Dashboard, serverUrl: 'https://companion.uppy.io' })
      //.use(Dropbox, { target: Dashboard, serverUrl: 'https://companion.uppy.io' })
      //.use(Instagram, { target: Dashboard, serverUrl: 'https://companion.uppy.io' })
      .use(Webcam, { target: Dashboard })
      //.use(Tus, { endpoint: 'https://master.tus.io/files/' })
      .use(XHRUpload, {
        endpoint: 'http://localhost:4100/api/upload',
      })
  
      uppy.on('complete', result => {
        console.log('successful files:', result.successful)
        console.log('failed files:', result.failed)
      });
    }//---this.strapUppy()

  }//---constructor

  componentDidMount(){
    this.strapUppy();
  }

  

  render() {
    return (
      <div className="container">
        <h1 style={{textAlign:"center"}}>Moist Dads</h1>
        <div className="uppy-target">Upload</div>
      </div>
    );
  }
}

export default view(Upload);