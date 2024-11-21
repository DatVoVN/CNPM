import './Setting.css'
import { useState, useEffect, useRef, useContext } from 'react'
import { ArrowRight2, Personalcard, TickCircle, Lock } from 'iconsax-react'
import { Link } from 'react-router-dom'
import { Breadcrumb, message, Modal, Tooltip, Spin, ConfigProvider } from 'antd'
import { DeleteOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { AdminAPI } from '../../Api/admin'
import { AuthContext } from '../../context/app.context'
const AdminSetting = () => {
  const token = localStorage.getItem('accesstoken')
  const [typeForm, setTypeForm] = useState('profile') // type form profile or change password
  const [submitLoading, setSubmitLoading] = useState(false) // loading submit state
  const [status, setStatus] = useState(null)
  const [messageResult, setMessageResult] = useState('')

  const { login, isProfile } = useContext(AuthContext)
  console.log(isProfile)

  //#region Form profile data
  const [adminFullName, setAdminFullName] = useState('')
  const [errorAdminFullName, setErrorAdminFullName] = useState('')
  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [Avatar, setAvatar] = useState(null)
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorFileUpload, setErrorFileUpload] = useState('')

  //handle drag and drop image file
  const [dragging, setDragging] = useState(false)
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setSelectedFile(droppedFile)
      setAvatar(URL.createObjectURL(droppedFile))
      fileInputRef.current.value = null
    }
  }

  //handle upload Avatar
  const handleUploadAvatar = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setAvatar(URL.createObjectURL(file))
      setSelectedFile(file)
      fileInputRef.current.value = null
    }
  }

  //handle clear Avatar
  const handleClearAvatar = (e) => {
    e.stopPropagation()
    setAvatar(null)
    setSelectedFile(null)
  }

  const handleErrorFullName = (admin_fullname) => {
    if (admin_fullname === '') {
      setErrorAdminFullName('Full name is required')
      return false
    }
    return true
  }

  const handleErrorEmail = (email) => {
    if (email === '') {
      setErrorEmail('Email is required')
      return false
    }
    return true
  }

  //handle cancel
  const handleCancel = () => {
    setAdminFullName('')
    setEmail('')
    setErrorAdminFullName('')
    setErrorEmail('')
    setAvatar(null)
    setSelectedFile(null)
  }
  //#endregion

  //#region Form change password data
  const [currentPassword, setCurrentPassword] = useState('')
  const [errorCurrentPassword, setErrorCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errorNewPassword, setErrorNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('')
  //#endregion
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    const formData = new FormData()
    const admin_fullname = adminFullName
    const adminEmail = email
    const isValidEmail = handleErrorEmail(adminEmail)
    const isValidFullName = handleErrorFullName(admin_fullname)
    if (!isValidEmail || !isValidFullName) {
      setSubmitLoading(false)
      return
    }
    formData.append('admin_fullname', adminFullName)
    formData.append('email', adminEmail)
    if (selectedFile) formData.append('admin_avatar', selectedFile)
    console.log('data', Object.fromEntries(formData))
    let response = null
    try {
      response = await AdminAPI.updateAdmin(formData, token)
      if (!response.ok) {
        setSubmitLoading(false)
        const { message, data } = await response.json()
        if (response.status === 401) {
          setStatus(401)
          setMessageResult('Unauthorized access. Please check your credentials.')
        } else if (response.status === 422) {
          setStatus(422)
          setMessageResult(`Invalid data: ${data} with message: ${message}`)
        } else {
          setStatus(response.status)
          setMessageResult(`Error update profile: ${data} with message: ${message}`)
        }
        return
      }
      const result = await response.json()
      const { messages, status } = result
      setStatus(status)
      setMessageResult(messages)
      setSubmitLoading(false)
    } catch (e) {
      setSubmitLoading(false)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <section className='w-full max-w-[100%] h-full'>
      <header className='flex justify-between'>
        <div className='Breadcrumb animate-[slideLeftToRight_1s_ease]'>
          <h1>
            <Breadcrumb
              separator={<ArrowRight2 size='15' color='#1D242E' />}
              className='font-bold text-[#848A91]'
              items={[{ title: 'Settings' }]}
            ></Breadcrumb>
          </h1>
        </div>
      </header>
      <div className='mt-10 flex gap-x-6 h-max'>
        <div className='w-[380px] bg-[#ffffff] rounded-xl border-[1px] border-solid border-[#ebedf0] p-6 animate-slideLeftToRight h-max'>
          <div className='setting__information flex flex-col gap-y-6 items-center justify-center w-[100%]'>
            <img
              src='/assets/images/person.png'
              alt='setting'
              className='w-40 h-40 rounded-full border border-dashed border-[rgb(102, 181, 163)] object-cover'
            />
            <div className='gap-2 flex flex-col justify-center items-center'>
              <span className='text-sm font-semibold'>Minh đẹp trai</span>
              <span className='text-xs text-[rgb(160,160,160)]'>minh32405@gmail.com</span>
              <span className='text-xs text-[#d6b80d]'>super admin</span>
            </div>
            <div className='w-full text-lg flex flex-col gap-4 px-12'>
              <button
                autoFocus
                type='button'
                className='setting__information__button'
                onClick={() => {
                  setTypeForm('profile')
                  handleCancel()
                }}
              >
                <Personalcard size={16} />
                <span>Personal information</span>
              </button>
              <button
                type='button'
                className='setting__information__button'
                onClick={() => setTypeForm('changePassword')}
              >
                <Lock size={16} />
                <span>Change password</span>
              </button>
            </div>
          </div>
        </div>
        <div className='w-[780px] bg-[#ffffff] rounded-xl border-[1px] border-solid border-[#ebedf0] p-6 animate-slideRightToLeft overflow-hidden h-max'>
          <form action='' onSubmit={handleSubmit} autoComplete='off' className='w-full'>
            <div
              className={`setting_content_profile`}
              style={{
                height: typeForm === 'profile' ? '470px' : 0,
                opacity: typeForm === 'profile' ? 1 : 0
              }}
            >
              <div className='w-full'>
                <div className='AddCategoryForm__row'>
                  <div className='AddCategoryForm__group AddCategoryForm__WidthFull relative'>
                    <label htmlFor='admin_avatar'>Avatar</label>
                    <input
                      type='file'
                      accept='image/jpg, image/jpeg, image/png, image/gif, image/svg'
                      name='admin_avatar'
                      id='admin_avatar'
                      className='hidden'
                      placeholder='Choose file'
                      onChange={handleUploadAvatar}
                      ref={fileInputRef}
                      onClick={() => setErrorFileUpload('')}
                    />
                    <Tooltip
                      title={errorFileUpload}
                      open={errorFileUpload !== ''}
                      placement='top'
                      align={{
                        offset: [0, 100]
                      }}
                    >
                      <div
                        className='mt-4 flex gap-x-4'
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <button
                          type='button'
                          onClick={() => document.getElementById('admin_avatar').click()}
                          className='AddCategoryForm__uploadBtn setting__uploadBtn grow'
                          style={{
                            border: Avatar !== null ? 'None' : '3px dashed #e8ebed'
                          }}
                        >
                          {Avatar ? (
                            <>
                              <img src={Avatar} alt='Avatar' className='w-full h-[300px] object-cover' />
                              <CloseCircleOutlined
                                className='absolute top-0 right-0 text-red-500 text-[20px] cursor-pointer'
                                onClick={handleClearAvatar}
                              />
                            </>
                          ) : (
                            <div className='flex flex-col gap-y-2 justify-center items-center'>
                              <CloudUploadOutlined className='text-[#008f99] text-3xl' />
                              <span className='text-base'>Drag or upload your image here</span>
                              <em className='text-sm text-gray-400'>
                                (Only *.jpeg, *.jpg, *.png, *.gif and *.svg will be accepted)
                              </em>
                            </div>
                          )}
                        </button>
                        <div className='bg-[#cccccc] h-32 w-32 rounded-md flex'>
                          <p className='m-auto text-gray-600 text-sm'>300x300</p>
                        </div>
                      </div>
                    </Tooltip>
                    {selectedFile && (
                      <div>
                        <span>{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className='AddCategoryForm__row'>
                  <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                    <label htmlFor='admin_fullname' className='AddCategoryForm__label'>
                      Full Name
                    </label>
                    <Tooltip
                      title={errorAdminFullName}
                      open={errorAdminFullName !== ''}
                      placement='bottomLeft'
                      align={{
                        offset: [60, -8]
                      }}
                    >
                      <input
                        type='text'
                        name='admin_fullname'
                        id='admin_fullname'
                        className='AddCategoryForm__input setting__input'
                        placeholder='Lam Nhat Minh'
                        value={adminFullName}
                        onChange={(e) => setAdminFullName(e.target.value)}
                        onFocus={() => setErrorAdminFullName('')}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className='AddCategoryForm__row'>
                  <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                    <label htmlFor='email' className='AddCategoryForm__label'>
                      Email
                    </label>
                    <Tooltip
                      title={errorEmail}
                      open={errorEmail !== ''}
                      placement='bottomLeft'
                      align={{
                        offset: [60, -8]
                      }}
                    >
                      <input
                        type='email'
                        name='email'
                        id='email'
                        className='AddCategoryForm__input setting__input'
                        placeholder='minh32405@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setErrorEmail('')}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <div className='flex gap-4 w-full'>
                    <button
                      type='submit'
                      className='bg-[#008f99] text-[#ffffff] px-2 py-4 w-full text-sm font-medium rounded flex items-center justify-center gap-4 hover:opacity-80'
                    >
                      <span>Save Changes</span>
                      <TickCircle size={20} />
                    </button>
                    <button
                      type='button'
                      className='bg-[#008f99] text-[#ffffff] px-2 py-4 w-full text-sm font-medium rounded flex items-center justify-center gap-4 hover:opacity-80'
                      onClick={handleCancel}
                    >
                      <span>Cancel</span>
                      <DeleteOutlined className='text-base' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`setting_content_changePassword`}
              style={{
                height: typeForm === 'changePassword' ? '400px' : 0,
                opacity: typeForm === 'changePassword' ? 1 : 0
              }}
            >
              <div className='w-full'>
                <div className='AddCategoryForm__row'>
                  <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                    <label htmlFor='current_password' className='AddCategoryForm__label'>
                      Current password
                    </label>
                    <Tooltip
                      title={errorCurrentPassword}
                      open={errorCurrentPassword !== ''}
                      placement='bottomLeft'
                      align={{
                        offset: [60, -8]
                      }}
                    >
                      <input
                        type='password'
                        name='current_password'
                        id='current_password'
                        className='AddCategoryForm__input setting__input'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        onFocus={() => setErrorCurrentPassword('')}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className='AddCategoryForm__row'>
                  <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                    <label htmlFor='new_password' className='AddCategoryForm__label'>
                      New password
                    </label>
                    <Tooltip
                      title={errorNewPassword}
                      open={errorNewPassword !== ''}
                      placement='bottomLeft'
                      align={{
                        offset: [60, -8]
                      }}
                    >
                      <input
                        type='password'
                        name='new_password'
                        id='new_password'
                        className='AddCategoryForm__input setting__input'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setErrorNewPassword('')}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className='AddCategoryForm__row'>
                  <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                    <label htmlFor='new_password_confirmation' className='AddCategoryForm__label'>
                      Confirm password
                    </label>
                    <Tooltip
                      title={errorConfirmPassword}
                      open={errorConfirmPassword !== ''}
                      placement='bottomLeft'
                      align={{
                        offset: [60, -8]
                      }}
                    >
                      <input
                        type='password'
                        name='new_password_confirmation'
                        id='new_password_confirmation'
                        className='AddCategoryForm__input setting__input'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setErrorConfirmPassword('')}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <div className='flex gap-4 w-full'>
                    <button
                      type='submit'
                      className='bg-[#008f99] text-[#ffffff] px-2 py-4 w-full text-sm font-medium rounded flex items-center justify-center gap-4 hover:opacity-80'
                    >
                      <span>Save Changes</span>
                      <TickCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AdminSetting
