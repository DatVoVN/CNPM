import { AuthContext } from '../../context/app.context'
import { useState, useEffect, useRef, useContext } from 'react'
import './Customers.css'
import { AdminAPI } from '../../Api/admin'
import { ArrowRight2, Add, SearchNormal, Edit, Refresh, Eye, ArrowDown2 } from 'iconsax-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Table,
  Breadcrumb,
  Dropdown,
  Popconfirm,
  message,
  Modal,
  Tooltip,
  Pagination,
  Spin,
  DatePicker,
  ConfigProvider,
  Select
} from 'antd'
import { DashOutlined, DeleteOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons'
const { RangePicker } = DatePicker

// import { AuthContext } from '../../context/app.context'
const filterTheme = {
  token: {
    colorTextQuaternary: '#1D242E', // Disabled text color
    colorTextPlaceholder: '#1D242E', // Placeholder text color
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    controlOutline: 'none',
    colorBorder: '#e8ebed',
    borderRadius: '4px',
    colorPrimary: '#008f99'
  },
  components: {
    Select: {
      activeBorderColor: '#1D242E',
      hoverBorderColor: '#1D242E',
      optionActiveBg: 'rgb(0, 143, 153, 0.3)',
      optionSelectedBg: 'rgb(0, 143, 153, 0.3)',
      optionSelectedColor: '#1D242E'
    },
    TreeSelect: {
      nodeHoverBg: 'rgb(0, 143, 153, 0.3)',
      nodeSelectedBg: 'rgb(0, 143, 153, 0.3)'
    },
    DatePicker: {
      activeBorderColor: '#1D242E',
      hoverBorderColor: '#1D242E'
    }
  }
}
const Customers = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('accesstoken')
  const [status, setStatus] = useState(null)
  const [messageResult, setMessageResult] = useState('')
  // const { login, isProfile } = useContext(AuthContext)
  // console.log(isProfile)

  //#region filter data
  const [searchValue, setSearchValue] = useState('')
  const [selectedFrom, setSelectedFrom] = useState(null)
  const [selectedTo, setSelectedTo] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [roles, setRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState()
  const [adminStatus, setAdminStatus] = useState([])
  const [selectedAdminStatus, setSelectedAdminStatus] = useState()
  //#endregion

  //#region Table data and custom pagination
  // Date format options
  const optionsDateformat = {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }
  // Date format
  const DateFormat = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', optionsDateformat)
    return `${formattedDate}`
  }

  //Table columns
  const columns = [
    {
      title: '#',
      dataIndex: 'admin_id',
      key: 'admin_id',
      width: '10%',
      sorter: (a, b) => a.admin_id - b.admin_id,
      ellipsis: true
    },
    {
      title: 'Full name',
      dataIndex: 'admin_fullname',
      key: 'admin_fullname',
      width: '20%',
      sorter: (a, b) => a.admin_fullname.localeCompare(b.admin_fullname),
      ellipsis: true,
      render: (text, record) => (
        <div className='flex items-center gap-x-2 justify-start'>
          <img
            src={record.admin_avatar !== null ? record.admin_avatar : ''}
            alt={text}
            className='w-[48px] h-[48px] object-cover rounded-full'
          />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      sorter: (a, b) => a.email.localeCompare(b.email),
      ellipsis: true
    },
    {
      title: 'Create at',
      dataIndex: 'admin_created_at',
      key: 'admin_created_at',
      width: '25%',
      sorter: (a, b) => new Date(a.admin_created_at) - new Date(b.admin_created_at),
      ellipsis: true,
      render: (text) => <span className='text-[14px]'>{DateFormat(text)}</span>
    },
    {
      title: 'Role',
      dataIndex: 'admin_is_admin',
      key: 'admin_is_admin',
      width: '15%',
      render: (text, record) => {
        let color
        let backgroundColor
        let role = record.admin_is_admin
        let statusText
        switch (role) {
          case 0:
            color = 'green'
            backgroundColor = 'rgba(0, 255, 0, 0.1)'
            statusText = 'User'
            break
          case 1:
            color = 'red'
            backgroundColor = 'rgba(255, 0, 0, 0.1)'
            statusText = 'Admin'
            break
          case 2:
            color = 'rgb(249, 115, 22)'
            backgroundColor = 'rgba(255, 165, 0, 0.1)'
            statusText = 'Super Admin'
            break
        }
        return (
          <span
            style={{ color, backgroundColor }}
            className='inline-block py-1 px-4 rounded-xl whitespace-nowrap text-xs'
          >
            {statusText}
          </span>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'admin_is_delete',
      key: 'admin_is_delete',
      width: '10%',
      render: (text) => (
        <span style={{ color: Number(text) === 0 ? 'green' : 'red' }}>{Number(text) === 0 ? 'Active' : 'Deleted'}</span>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Dropdown
          trigger={['click']}
          placement='bottomRight'
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <button type='button' className='flex items-center gap-x-2 justify-center' onClick={() => {}}>
                    <Eye size='15' color='green' /> <span>View</span>
                  </button>
                )
              },
              {
                key: '2',
                label: (
                  <button
                    type='button'
                    className='flex items-center gap-x-2 justify-center'
                    onClick={() => {
                      setOpenModal(true)
                      setTypeModal('update')
                      setAdminFullName(record.admin_fullname)
                      setEmail(record.email)
                      setAvatar(record.admin_avatar)
                      setSelectedAdmin(record)
                    }}
                  >
                    <Edit size='15' color='green' /> <span>Update</span>
                  </button>
                )
              },
              {
                key: '3',
                label: (
                  <Popconfirm
                    align={{ offset: [20, 20] }}
                    placement='bottomRight'
                    title={`Delete record ${record.admin_id}`}
                    description='Are you sure to delete this record?'
                    onConfirm={() => handleDeleteAdmin(record)}
                    okText='Delete'
                    cancelText='Cancel'
                  >
                    <button
                      type='button'
                      className='flex items-center gap-x-2 justify-center'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DeleteOutlined className='text-[15px] text-[red]' /> <span>Delete</span>
                    </button>
                  </Popconfirm>
                )
              },
              {
                key: '4',
                label: (
                  <Popconfirm
                    align={{ offset: [20, 20] }}
                    placement='bottomRight'
                    title={`Restore record ${record.admin_id}`}
                    description='Are you sure to store this record?'
                    onConfirm={() => handleRestoreAdmin(record)}
                    okText='Restore'
                    cancelText='Cancel'
                  >
                    <button
                      type='button'
                      className='flex items-center gap-x-2 justify-center'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Refresh className='text-[green]' size={15} /> <span>Restore</span>
                    </button>
                  </Popconfirm>
                )
              }
            ]
          }}
          className='flex justify-center bg-[#fafafa] items-center px-2 rounded-md w-[50px] h-[40px] border-[1px] border-solid border-[#e8ebed]'
        >
          <button type='button' className='flex items-center'>
            <DashOutlined className='text-[15px]' />
          </button>
        </Dropdown>
      )
    }
  ]

  //Table data
  const [data, setData] = useState()
  const [filterData, setFilterData] = useState([])
  const [loading, setLoading] = useState()
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8
    }
  })

  const CustomPagination = ({ total, current, pageSize, onChange, pageSizeOptions }) => (
    <div className='flex justify-between items-center mt-3'>
      <span className='inline-block text-[14px]'>
        Showing {current - 1 < 1 ? 1 : (current - 1) * pageSize + 1} to{' '}
        {current * pageSize <= total ? current * pageSize : total} of {total} entries
      </span>
      <Pagination
        total={total}
        current={current}
        pageSize={pageSize}
        onChange={onChange}
        pageSizeOptions={pageSizeOptions || ['8', '10', '20']}
      />
    </div>
  )

  const handleTableChange = (pagination, filters, sorter) => {
    setLoading(true)
    const params = {
      pagination,
      filters,
      sortOrder: sorter ? sorter.order : undefined,
      sortField: sorter ? sorter.field : undefined
    }
    setTableParams(params)
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([])
      setFilterData([])
    }
    setLoading(false)
  }

  const searchAdmins = () => {
    setLoading(true)
    const formatDate = (date) => {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
      }

      // Check if the date is in ISO 8601 format
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/.test(date)) {
        const parsedDate = new Date(date)
        const day = String(parsedDate.getDate()).padStart(2, '0')
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
        const year = parsedDate.getFullYear()
        return `${year}-${month}-${day}`
      }

      // Check if the date is in the format "Wed Sep 25 2024 00:00:00 GMT+0700 (Indochina Time)"
      if (Date.parse(date)) {
        const parsedDate = new Date(date)
        const day = String(parsedDate.getDate()).padStart(2, '0')
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
        const year = parsedDate.getFullYear()
        return `${year}-${month}-${day}`
      }
      return ''
    }
    const result = data.filter((item) => {
      const matchesAdminFullName = item.admin_fullname.toLowerCase().includes(searchValue.toLowerCase())
      const matchesAdminEmail = item.email.toLowerCase().includes(searchValue.toLowerCase())
      const matchesRole = selectedRoles !== undefined ? item.admin_is_admin === selectedRoles : true
      const matchesStatus = selectedAdminStatus !== undefined ? item.admin_is_delete === selectedAdminStatus : true
      const matchesDateRange =
        selectedFrom && selectedTo
          ? formatDate(item.admin_created_at) >= formatDate(selectedFrom) &&
            formatDate(item.admin_created_at) <= formatDate(selectedTo)
          : true
      return (matchesAdminFullName || matchesAdminEmail) && matchesDateRange && matchesRole && matchesStatus
    })
    const tableData = result
    setFilterData(tableData)
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: result.length
      }
    })
    setLoading(false)
  }

  const handleUnauthenticated = () => {
    localStorage.removeItem('accesstoken')
    navigate('/login')
  }

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const response = await AdminAPI.getAllAdmin(token)
      if (!response.ok) {
        if (response.status === 401) {
          setStatus(401)
          setMessageResult('Unauthorized access. Please check your credentials.')
          handleUnauthenticated()
        } else {
          setStatus(response.status)
          setMessageResult(`Error fetching admin: with status ${response.status}`)
          setLoading(false)
        }
        return
      }
      const result = await response.json()
      const data = result.data.data
      const tableData = data
        .map((item) => ({
          key: item.admin_id,
          admin_id: item.admin_id,
          admin_fullname: item.admin_fullname,
          email: item.email,
          admin_avatar: item.admin_avatar,
          admin_is_admin: item.admin_is_admin,
          admin_is_delete: item.admin_is_delete,
          email_verified_at: item.email_verified_at,
          admin_created_at: item.admin_created_at,
          admin_updated_at: item.admin_updated_at
        }))
        .sort((a, b) => new Date(b.admin_created_at) - new Date(a.admin_created_at))
      const roles = Array.from(
        new Set(
          data.map((item) => {
            switch (item.admin_is_admin) {
              case 0:
                return 'User'
              case 1:
                return 'Admin'
              case 2:
                return 'Super Admin'
            }
          })
        )
      )
      const adminStatus = Array.from(new Set(data.map((item) => (item.admin_is_delete === 0 ? 'Active' : 'Deleted'))))
      setAdminStatus(adminStatus)
      setRoles(roles)
      setFilterData(tableData)
      setData(tableData)
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.length
        }
      })
      setLoading(false)
    } catch (e) {
      setStatus(400)
      setMessageResult('Error fetching admin: ' + e.message)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [tableParams.pagination?.pageSize])

  useEffect(() => {
    if (data) {
      searchAdmins()
    }
  }, [
    searchValue,
    tableParams.pagination?.current,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
    selectedFrom,
    selectedTo,
    selectedRoles,
    selectedAdminStatus
  ])
  //#endregion

  //#region Modal add or update
  //Modal setting
  const [openModal, setOpenModal] = useState(false)
  const [typeModal, setTypeModal] = useState('add')

  //#region Form data
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

  // handle delete admin record
  const handleDeleteAdmin = async (record) => {
    if (record.admin_is_delete === 1) {
      setStatus(400)
      setMessageResult("This record has been deleted. Can't delete again")
      return
    }
    let response = await AdminAPI.deleteAdmin(record.admin_id, token)
    setTypeModal('Delete')
    if (response.ok) {
      const result = await response.json()
      const { messages, status } = result
      setStatus(status)
      setMessageResult(messages)
    } else {
      if (response.status === 401) {
        setStatus(401)
        setMessageResult('Unauthorized access. Please check your credentials.')
      } else {
        setStatus(response.status)
        setMessageResult(`Error delete admin with status: ${response.status}, message: `, response.messages)
      }
      return
    }
  }

  const handleRestoreAdmin = async (record) => {
    if (record.admin_is_delete === 0) {
      setStatus(400)
      setMessageResult("This record has been restored. Can't restore again")
      return
    }
    let response = await AdminAPI.deleteAdmin(record.admin_id, token)
    setTypeModal('Restore')
    if (response.ok) {
      const result = await response.json()
      const { messages, status } = result
      setStatus(status)
      setMessageResult(messages)
    } else {
      if (response.status === 401) {
        setStatus(401)
        setMessageResult('Unauthorized access. Please check your credentials.')
      } else {
        setStatus(response.status)
        setMessageResult(`Error restore admin with status: ${response.status}, message: `, response.messages)
      }
      return
    }
  }

  // handle submit and or update admin
  const [submitLoading, setSubmitLoading] = useState(false) // loading submit state
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
      if (typeModal === 'add') {
        response = await AdminAPI.addAdmin(formData, token)
      }
      if (typeModal === 'update') {
        response = await AdminAPI.updateAdmin(formData, token)
      }
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
          setMessageResult(`Error ${typeModal} admin: ${data} with message: ${message}`)
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

  //handle cancel modal
  const handleCancelModal = () => {
    setAdminFullName('')
    setEmail('')
    setErrorAdminFullName('')
    setErrorEmail('')
    setAvatar(null)
    setSelectedFile(null)
    setOpenModal(false)
  }
  //#endregion

  //#endregion

  //#region status and message result of fetch api call
  useEffect(() => {
    if ([200, 201, 202, 204].includes(status)) {
      message.success(`${typeModal} admin was successfully`, 3)
      fetchAdmins()
      setStatus(null)
      setMessageResult(null)
      handleCancelModal()
    } else if (status >= 400) {
      message.error(messageResult, 3)
      setStatus(null)
      setMessageResult(null)
    }
  }, [status, messageResult])
  //#endregion

  return (
    <section className='w-full max-w-[100%] h-full'>
      <header className='flex justify-between animate-slideDown'>
        <div className='Breadcrumb'>
          <h1>
            <Breadcrumb
              separator={<ArrowRight2 size='15' color='#1D242E' />}
              className='font-bold text-[#848A91]'
              items={[
                { title: 'Users' },
                {
                  title: (
                    <Link to='/admin/customers' tabIndex='-1'>
                      List of customers ({data?.length})
                    </Link>
                  )
                }
              ]}
            ></Breadcrumb>
          </h1>
          <p className='mt-[11px]'>List of customers available</p>
        </div>
        {/* <button
          className='min-w-[162px] h-[46px] px-[18px] py-[16px] bg-[#F0483E] rounded-[4px] text-[#FFFFFF] flex gap-x-[10px] font-bold items-center text-[14px]'
          onClick={() => {
            setOpenModal(true)
            setTypeModal('add')
          }}
        >
          <Add size='20' />
          Add new customer
        </button> */}
      </header>
      <Modal
        destroyOnClose
        title={
          <span>
            {typeModal} new Admin (fields with <span className='text-[red]'>*</span> are required)
          </span>
        }
        centered
        open={openModal}
        width={800}
        footer={null}
        onCancel={handleCancelModal}
      >
        <div className='modal__content mt-7 relative'>
          <Spin spinning={submitLoading} tip='Loading...' size='large' fullscreen />
          <form action='' method='POST' onSubmit={handleSubmit} autoComplete='off'>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__group AddCategoryForm__WidthFull relative'>
                <label htmlFor='admin_avatar' className='AddCategoryForm__label mb-1'>
                  Avatar (only *.jpeg, *.jpg, *.png, *.gif and *.svg)
                </label>
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
                  <div className='' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                    <button
                      type='button'
                      onClick={() => document.getElementById('admin_avatar').click()}
                      className='AddCategoryForm__uploadBtn'
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
                        <>
                          <CloudUploadOutlined className='text-[green] text-[40px]' />{' '}
                          <span>Drag or upload your image here</span>
                        </>
                      )}
                    </button>
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
                  <span className='text-[red]'>* </span>Full Name
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
                    className='AddCategoryForm__input'
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
                  <span className='text-[red]'>* </span>Email
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
                    className='AddCategoryForm__input'
                    placeholder='minh32405@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setErrorEmail('')}
                  />
                </Tooltip>
              </div>
            </div>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__groupButton'>
                <button type='submit' className='AddCategoryForm__submitBtn'>
                  Save
                </button>
                <button type='button' className='AddCategoryForm__cancelBtn' onClick={handleCancelModal}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <div className='table__content my-[15px] bg-[#ffffff] border-[1px] border-solid border-[#e8ebed] rounded-md animate-slideUp'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center w-[250px] justify-between text-[14px] rounded-[4px] relative'>
            <input
              type='text'
              placeholder='Search for customers'
              className='searchBox__input border-[1px] border-solid border-[#e8ebed] bg-[#fafafa] outline-none bg-transparent w-[100%] py-[15px] px-[15px] rounded-[4px]'
              value={searchValue}
              autoFocus
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <button
              onClick={() => {
                fetchAdmins()
              }}
            >
              <SearchNormal size='20' className='absolute top-[50%] right-0 transform -translate-y-1/2 mr-3' />
            </button>
          </div>
          <div className='flex gap-x-[12px] items-center'>
            <ConfigProvider theme={filterTheme}>
              <Select
                suffixIcon={<ArrowDown2 size='15' color='#1D242E' />}
                allowClear
                placeholder='- Choose role -'
                placement='bottomLeft'
                options={roles.map((item) => {
                  switch (item) {
                    case 'User':
                      return { label: 'User', value: 0 }
                    case 'Admin':
                      return { label: 'Admin', value: 1 }
                    case 'Super Admin':
                      return { label: 'Super Admin', value: 2 }
                  }
                })}
                value={selectedRoles}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                  minWidth: '300px'
                }}
                className='w-[250px] h-[50px]'
                onChange={(value) => {
                  setSelectedRoles(value)
                }}
              />
            </ConfigProvider>
          </div>
          <div className='flex gap-x-[12px] items-center'>
            <ConfigProvider theme={filterTheme}>
              <Select
                suffixIcon={<ArrowDown2 size='15' color='#1D242E' />}
                allowClear
                placeholder='- Choose status -'
                placement='bottomLeft'
                options={adminStatus.map((item) => {
                  switch (item) {
                    case 'Active':
                      return { label: 'Active', value: 0 }
                    case 'Deleted':
                      return { label: 'Deleted', value: 1 }
                  }
                })}
                value={selectedAdminStatus}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                  minWidth: '300px'
                }}
                className='w-[250px] h-[50px]'
                onChange={(value) => {
                  setSelectedAdminStatus(value)
                }}
              />
            </ConfigProvider>
          </div>
          <div className='flex gap-x-[12px] items-center '>
            <ConfigProvider theme={filterTheme}>
              <RangePicker
                className='w-[250px] h-[50px]'
                format={'DD/MM/YYYY'}
                onChange={(date, dateString) => {
                  setSelectedFrom(dateString[0])
                  setSelectedTo(dateString[1])
                }}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className='pt-[15px]'>
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  rowHoverBg: '#f5f5f5',
                  headerSplitColor: 'transparent',
                  headerBg: '#f5f5f5',
                  sortField: '#f5f5f5',
                  sortOrder: '#f5f5f5',
                  borderColor: '#e8ebed'
                }
              }
            }}
          >
            <Table
              size='small'
              columns={columns}
              rowKey={(record) => record.admin_id}
              dataSource={filterData}
              pagination={{
                position: ['none'],
                ...tableParams.pagination
              }}
              loading={loading}
              onChange={handleTableChange}
              scroll={{
                y: '300px'
              }}
              style={{
                width: '1200px',
                minHeight: '350px',
                maxHeight: '450px',
                backgroundColor: '#ffffff'
              }}
            />
          </ConfigProvider>
          <CustomPagination
            total={tableParams.pagination.total}
            current={tableParams.pagination.current}
            pageSize={tableParams.pagination.pageSize}
            onChange={(page, pageSize) =>
              handleTableChange(
                {
                  ...tableParams.pagination,
                  current: page,
                  pageSize
                },
                tableParams.filters,
                tableParams.sortOrder
              )
            }
          />
        </div>
      </div>
    </section>
  )
}

export default Customers
