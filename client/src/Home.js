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
      latestDads: [],
      files: [],
      alertOpen: false,
      alertText: 'Congrats',
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
        this.setState({moistDad:'http://'+this.dName+':4100/'+response[0].files[0].path})
      }else{

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

  initFilePond(){

  }

  componentDidMount() {
    this.initFilePond()
    this.updateDadOfDay()
    this.updatePastDads()
  }

  render () {
    return (
      <div>
          <div className="moist-old-dads">
            {this.state.latestDads.map((dad, index) => (
              <div key={index}>
                <img src={'http://'+this.dName+':4100/'+dad.files[0].thumbPath}/>
              </div>
            ))}
          </div>
          <div className="moist-bg" style={{backgroundImage:'url("'+this.state.moistDad+'")'}}>
          </div>
          <Button className="moist-modal-btn" variant="primary" onClick={this.handleOpen}>
            Upload a Moist Dad!
          </Button>
          <Modal show={this.state.modalOpen} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Upload a Moist Dad</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <FilePond maxFiles={3}
                      ref={ref => this.pond = ref}
                      server={{
                        url: 'http://'+this.dName+':4100/api/upload'
                      }}
                      onprocessfiles={(error,file) => {
                        this.updateDadOfDay()
                        this.updatePastDads()
                        this.setState({ alertOpen: true })
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