import React, { Component } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CRow,
  CImage,
  CProgress,
  CProgressBar,
  CCardFooter,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

class Analysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disablePasswd: true,
      hidePasswd: true,
      checked_Username: false,
      Username: '',
      Passwd: '',
      Imagefile: '',
      Runstate: false,
      result: {
        Comment: false,
        Image: '',
        Memo: '',
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },
    }
  }

  componentDidMount() {}

  inputHandler = (e) => {
    this.setState((prevState) => ({
      [e.target.name]: e.target.value,
    }))
  }

  checkDisable = (e) => {
    this.setState((prevstate) => ({
      disablePasswd: !prevstate.disablePasswd,
    }))
  }

  checkHide = (e) => {
    this.setState((prevstate) => ({
      hidePasswd: !prevstate.hidePasswd,
    }))
  }

  checkDuplicate = (e) => {
    e.preventDefault()
    if (this.state.Username === '') {
      this.sendToast('Input_Name')
      return
    }
    axios
      .post('http://XXX.XXX.XX.X:31000/DB/check_duplicate', { Username: this.state.Username })
      .then((res) => {
        if (res.data === false) {
          this.setState({
            checked_Username: 'Passwd',
            disablePasswd: false,
          })
          this.sendToast('Passwd')
        } else {
          this.setState({
            checked_Username: true,
          })
          this.sendToast('checked')
        }
      })
  }

  bindFile = (e) => {
    this.setState({
      Imagefile: e.target.files[0],
    })
  }
  onSubmit = async (e) => {
    e.preventDefault()
    if (this.state.checked_Username === false) {
      this.sendToast('Require_Check')
      return
    } else if (this.state.checked_Username === 'Passwd') {
      axios
        .post('http://XXX.XXX.XX.X:31000/DB/use_passwd', {
          Username: this.state.Username,
          Passwd: this.state.Passwd,
        })
        .then((res) => {
          if (res.data === false) {
            this.sendToast('Wrong_Passwd')
            return false
          } else {
            this.imageSend()
          }
        })
    } else if (this.state.checked_Username === true) {
      this.imageSend()
    }
  }

  imageSend = () => {
    const formData = new FormData()
    formData.append('Username', this.state.Username)
    formData.append('disablePasswd', this.state.disablePasswd)
    formData.append('Passwd', this.state.Passwd)
    formData.append('head_skin', this.state.Imagefile)
    axios
      .post('http://XXX.XXX.XX.X:31000/run/upload_image', formData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((res) => {
        this.setState((prevState) => ({
          Runstate: 0,
          result: {
            ...prevState.result,
            Image: res.data.Imagepath,
          },
        }))
        this.sendToast('Uploaded')
        return axios.post('http://fkdnsem.iptime.org:31000/model_1', {
          Image: this.state.result.Image,
        })
      })
      .then((res) => {
        this.setState((prevState) => ({
          Runstate: 1,
          result: {
            ...prevState.result,
            0: res.data,
          },
        }))
        this.sendToast('1')
        return axios.post('http://fkdnsem.iptime.org:31000/model_2', {
          Image: this.state.result.Image,
        })
      })
      .then((res) => {
        this.setState((prevState) => ({
          Runstate: 2,
          result: {
            ...prevState.result,
            1: res.data,
          },
        }))
        this.sendToast('2')
        return axios.post('http://fkdnsem.iptime.org:31000/model_3', {
          Image: this.state.result.Image,
        })
      })
      .then((res) => {
        this.setState((prevState) => ({
          Runstate: 3,
          result: {
            ...prevState.result,
            2: res.data,
          },
        }))
        this.sendToast('3')
        return axios.post('http://fkdnsem.iptime.org:31000/model_4', {
          Image: this.state.result.Image,
        })
      })
      .then((res) => {
        this.setState((prevState) => ({
          Runstate: 4,
          result: {
            ...prevState.result,
            3: res.data,
          },
        }))
        this.sendToast('4')
        return axios.post('http://fkdnsem.iptime.org:31000/model_5', {
          Image: this.state.result.Image,
        })
      })
      .then((res) => {
        this.setState((prevState) => ({
          Runstate: 5,
          result: {
            ...prevState.result,
            4: res.data,
          },
        }))
        this.sendToast('5')
        return axios.post('http://fkdnsem.iptime.org:31000/model_6', {
          Image: this.state.result.Image,
        })
      })
      .then((res) => {
        this.setState((prevState) => ({
          Runstate: 6,
          result: {
            ...prevState.result,
            5: res.data,
          },
        }))
        this.sendToast('6')
        this.sendToast('')
        return axios.post('http://XXX.XXX.XX.X:31000/run/define_result', {
          r0: this.state.result[0],
          r1: this.state.result[1],
          r2: this.state.result[2],
          r3: this.state.result[3],
          r4: this.state.result[4],
          r5: this.state.result[5],
        })
      })
      .then((res) => {
        this.setState((prevState) => ({
          result: {
            ...prevState.result,
            Comment: res.data,
          },
        }))
      })
  }

  sendToast = (action) => {
    let color = 'info'
    let mention = ''
    switch (action) {
      case 'Uploaded':
        color = 'success'
        mention = '????????? ????????????????????????.'
        break
      case 'Passwd':
        color = 'warning'
        mention = '????????? ??????????????????.'
        break
      case 'Input_Name':
        color = 'warning'
        mention = '????????? ??????????????????.'
        break
      case 'Require_Check':
        color = 'warning'
        mention = '??????????????? ????????????.'
        break
      case 'Wrong_Passwd':
        color = 'danger'
        mention = '?????? ???????????????.'
        break
      case 'checked':
        color = 'success'
        mention = '??????????????? ???????????????.'
        break
      case '1':
        mention = '??????????????? ?????? ????????? ???????????????.'
        break
      case '2':
        mention = '??????????????? ?????? ????????? ???????????????.'
        break
      case '3':
        mention = '????????????????????? ?????? ????????? ???????????????.'
        break
      case '4':
        mention = '????????????????????? ?????? ????????? ???????????????.'
        break
      case '5':
        mention = '????????? ?????? ????????? ???????????????.'
        break
      case '6':
        mention = '????????? ?????? ????????? ???????????????.'
        break
      default:
        color = 'success'
        mention = '?????? ??? ????????? ???????????????.'
    }
    this.setState({
      toast: (
        <CToast
          autohide={true}
          delay={3500}
          color={color}
          className="text-white align-items-center"
        >
          <div className="d-flex">
            <CToastBody>{mention}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      ),
    })
  }

  render() {
    if (this.state.result.Comment !== false) {
      return (
        <Redirect
          to={{
            pathname: '/head_skin/result',
            state: {
              Username: this.state.Username,
              result: this.state.result,
              disablePasswd: this.state.disablePasswd,
              Passwd: this.state.Passwd,
            },
          }}
        />
      )
    }
    return (
      <div className="bg-light h-auto d-flex flex-row align-items-center">
        <CToaster ref={this.toaster} push={this.state.toast} placement="top-end" />
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={this.onSubmit}>
                    <h1>?????? ??????</h1>
                    <p className="text-medium-emphasis">
                      ????????? 60?????? ??????????????? ?????? ????????? ????????? ????????? ??? ?????? ????????? ????????? ??????
                      ??? ????????????. ????????? ????????? ????????? ????????? ?????? ???????????? ?????? ????????????
                      ??????????????????
                    </p>
                    <CInputGroup className="mb-3">
                      <CImage
                        align={'center'}
                        rounded
                        thumbnail
                        src="/sample.jpg"
                        width={250}
                        height={250}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                      <CFormControl
                        placeholder="Username"
                        autoComplete="username"
                        id="Username"
                        name="Username"
                        onChange={this.inputHandler}
                        value={this.state.ID}
                        disabled={this.state.checked_Username}
                        required
                      />
                      <CButton
                        type="submit"
                        color="info"
                        id="check_duplicated"
                        variant={'outline'}
                        onClick={this.checkDuplicate}
                      >
                        ????????????
                      </CButton>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormControl
                        readOnly={this.state.disablePasswd}
                        required
                        type={this.state.hidePasswd ? 'password' : 'text'}
                        placeholder="Password"
                        autoComplete="current-password"
                        name="Passwd"
                        id="Passwd"
                        onChange={this.inputHandler}
                        value={this.state.Passwd}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol md={4}>
                        <CInputGroup>
                          <CFormCheck
                            id="flexCheckDefault1"
                            label="?????? ??????"
                            onChange={this.checkDisable}
                            disabled={this.state.checked_Username === 'Passwd'}
                          />
                        </CInputGroup>
                      </CCol>

                      {this.state.disablePasswd === false ? (
                        <CCol>
                          <CInputGroup>
                            <CFormCheck
                              id="flexCheckDefault2"
                              label="?????? ?????????"
                              onChange={this.checkHide}
                            />
                          </CInputGroup>
                        </CCol>
                      ) : (
                        <div />
                      )}
                    </CRow>
                    <p className="text-medium-emphasis">?????? ??????????????? ???????????? ?????????.</p>
                    <CInputGroup>
                      <CFormControl
                        type="file"
                        accept="image/jpg,image/png,image/jpeg,image/gif"
                        id="inputGroupFile04"
                        aria-describedby="inputGroupFileAddon04"
                        aria-label="Upload"
                        onChange={this.bindFile}
                      />
                      <CButton type="submit" color="success" id="inputGroupFileAddon04">
                        ?????????
                      </CButton>
                    </CInputGroup>
                  </CForm>
                </CCardBody>
                {this.state.Runstate !== false ? (
                  <CCardFooter>
                    <CRow>
                      <CCol md={10}>
                        <CProgress className="mb-3" height={30}>
                          <CProgressBar
                            color="success"
                            variant="striped"
                            animated
                            value={(100 / 6) * this.state.Runstate}
                          />
                        </CProgress>
                      </CCol>
                      <CCol md={2}>
                        <h5>{Math.round((100 / 6) * this.state.Runstate)}%</h5>
                      </CCol>
                    </CRow>
                  </CCardFooter>
                ) : (
                  <div />
                )}
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default Analysis
