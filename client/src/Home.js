import React, { Component } from 'react';
import { view } from 'react-easy-state';
import SweetAlert from 'sweetalert2-react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class Home extends Component {
constructor (props) {
    super(props)

    this.state = {
      modalOpen: false,
      moistDad:'',
      mediaType: false,
      latestDads: [],
      files: [],
      alertOpen: false,
      alertTitle: 'Congrats',
      alertText: 'You have uploaded a Moist Dad!'
    }

    this.dName = 'localhost';
    this.handleOpen = () => {
      this.setState({
        modalOpen: true,
        files: []
      })
    }
  
    this.handleClose = () => {
      this.setState({
        modalOpen: false,
        files: []
      })
      
    }
  }

  updateDadOfDay(){
    fetch('http://'+this.dName+':4100/api/getMoistDadOfDay', {
      method: 'GET'
    }).then(res => res.json())
    .then(response => {
      if (response[0]){
        let mime = response[0].files[0].mimetype.split('/');
        mime = mime[0];
        this.setState({moistDad:response[0].files[0],mediaType:mime})
      }
    })
    .catch(error => console.error('Error:', error));
  }

  updatePastDads(){
    fetch('http://'+this.dName+':4100/api/getLatestDads', {
      method: 'GET'
    }).then(res => res.json())
    .then(response => {
      this.setState({latestDads: response});
    })
    .catch(error => console.error('Error:', error));
  }

  generateDadMedia(){
    let farts = '';
    if (this.state.mediaType === 'video'){
      farts = (
        <video className="moist-bg" autoPlay loop id="video-background" playsInline >
          <source src={'http://'+this.dName+':4100/'+this.state.moistDad.path} type={this.state.moistDad.mimetype}></source>
        </video>
      );
    }else if (this.state.mediaType === 'image'){
      farts = (<div className="moist-bg" style={{backgroundImage:'url("'+'http://'+this.dName+':4100/'+this.state.moistDad.path+'")'}}></div>);
    }

    return farts;
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
                <img alt={dad.files[0].originalname} src={'http://'+this.dName+':4100/'+dad.files[0].thumbPath}/>
              </div>
            ))}
          </div>

          {this.generateDadMedia()}

          <Button className="moist-modal-btn" variant="primary" onClick={this.handleOpen}>
            Upload a Moist Dad!
          </Button>
          <Modal show={this.state.modalOpen} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Upload a Moist Dad</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <FilePond maxFiles={1}
                      ref={ref => this.pond = ref}
                      server={{
                        url: 'http://'+this.dName+':4100/api/upload'
                      }}
                      onprocessfiles={(error,file) => {
                        this.updateDadOfDay()
                        this.updatePastDads()
                        this.setState({ alertOpen: true, modalOpen:false })
                      }}
                      allowMultiple={true}
                      files={this.state.files}
                      onupdatefiles={fileItems => {
                        this.setState({
                            files: fileItems.map(fileItem => fileItem.file)
                        })
                      }} />
            </Modal.Body>

          </Modal>
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