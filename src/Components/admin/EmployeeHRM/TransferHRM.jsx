import React, { useState, useEffect } from "react";
import AdminNavbar from "../../admin/Navbar/AdminNavbar";
import AdminSidebar from "../../admin/Sidebar/AdminSidebar";
import "react-calendar/dist/Calendar.css";
import chevron from "../../images/chevron_right.png";
import { useMain } from "../../../hooks/useMain";
import "./award.css";
import plusIcon from "../../images/plusIcon.png";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";



const HRMsystemSetup = ({ setAlert, pop, setPop }) => {
  const { user, allEmployee, getDepartments, createTransfer, getTransfer, getBranchs, deleteTransfer, updateTransfer } = useMain();


  const [open, setOpen] = useState(0);
  const [allTransfer, setAllTransfer] = useState([]);

  const [refreshFlag, setRefreshFlag] = useState(false);

  const [popup1, setPopup1] = useState(false);

  const [allEmp, setAllEmp] = useState([]);

  const [allDep, setAllDep] = useState([]);

  const [allBranch, setBranch] = useState([]);

  const [onEdit, setOnEdit] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchAllEmp = async () => {
    const ans = await allEmployee();
    setAllEmp(ans?.emp);
  }

  const fetchAllDep = async () => {
    const ans = await getDepartments();
    setAllDep(ans?.data);
  }

  const [formdata, setFormdata] = useState({
    branch: "", Employee: "", Department: "", TransferDate: "", Description: ""
  })

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const fetchTranfer = async () => {
    const ans = await getTransfer();
    setAllTransfer(ans?.data);
  }

  useEffect(() => {
    if (onEdit) {
      setFormdata({
        id: editData._id,
        branch: editData.branch,
        Employee: editData.Employee,
        Department: editData.Department,
        TransferDate: editData.TransferDate,
        Description: editData.Description,
      })
    }
  }, [editData])

  const submitHandler = async () => {
    if (onEdit) {
      const ans = await updateTransfer({ ...formdata });
      toast.success("update successfully");
      fetchTranfer();
      setRefreshFlag(!refreshFlag);
    }
    else {
      const ans = await createTransfer({ ...formdata });
      fetchTranfer();
      toast.success("Successfuly Created");
      setRefreshFlag(!refreshFlag);
    }
    setPopup1(false)
  }

  const fetchBranch = async () => {
    const ans = await getBranchs();
    setBranch(ans?.data);
  }

  const deleteProject = async (id) => {

    confirmAlert({
      title: 'Are you sure to delete this data?',
      message: 'All related data to this will be deleted',
      buttons: [
        {
          label: 'Yes, Go Ahead!',
          style: {
            background: "#FF5449"
          },
          onClick: async () => {
            await deleteTransfer(id);
            toast.success("delete Successfully");
            setRefreshFlag(!refreshFlag);
          }
        },
        {
          label: 'Cancel',

          onClick: () => null
        }
      ]
    });

  };

  useEffect(() => {
    fetchAllEmp();
    fetchAllDep();
    fetchTranfer();
    fetchBranch();
  }, [refreshFlag])

  return (
    <>
      <div className="employee-dash h-full">
        <AdminSidebar pop={pop} setPop={setPop} />

        <div className="tm awardtm">
          <AdminNavbar user={user} setAlert={setAlert} />

          <div className="em">
            <div className="flex-col">
              <div className="admin-main adminmain">


                <div className="plusSection">
                  <div className="adminFirt">
                    <h2 className="hrmShed">Manage Transfer</h2>

                    <div className="hrmDoHe">
                      <p>Dashboard</p>
                      <img src={chevron} alt="" />
                      <span>Transfer</span>
                    </div>
                  </div>


                  <img
                    onClick={() => {
                      if (open === 0) {
                        setPopup1(true);
                      }
                    }}
                    className="plusiCON"
                    src={plusIcon}
                    alt=""
                  />
                </div>

                <div className="relative   overflow-x-auto w-full">
                  <table className="w-full table1 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                    <thead className="text-xs uppercase textALLtITL ">
                      <tr>

                        <th scope="col" className="px-6 py-3 taskTitl ">
                        EMPLOYEE 
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        BRANCH
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        DEPARTMENT
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        TRANSFER DATE
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        DESCRIPTION
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        ACTION
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {allTransfer.map((item, index) => (
                        <tr key={index} className="bg-white border-b fdf">

                          <td className="px-6 py-4 taskAns">{item?.Employee}</td>
                          <td className="px-6 py-4 taskAns">
                            {item?.branch}
                          </td>
                          <td className="px-6 py-4 taskAns">{item?.Department}</td>
                          <td className="px-6 py-4 taskAns">{item?.TransferDate}</td>

                          <td className="px-6 py-4 taskAns">{item?.Description}</td>

                          <div className="viewOnwWRAP">

                            <td

                              className="px-6 py-4 taskAns cursor-pointer"
                            >
                              <div className="testok">

                                <svg className="cursor-pointer" onClick={() => {
                  setOnEdit(true);
                  setEditData(item);
                  setPopup1(true);
                }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.71569 5.51667L10.4824 6.28333L2.93236 13.8333H2.16569V13.0667L9.71569 5.51667ZM12.7157 0.5C12.5074 0.5 12.2907 0.583333 12.1324 0.741667L10.6074 2.26667L13.7324 5.39167L15.2574 3.86667C15.5824 3.54167 15.5824 3.01667 15.2574 2.69167L13.3074 0.741667C13.1407 0.575 12.9324 0.5 12.7157 0.5ZM9.71569 3.15833L0.499023 12.375V15.5H3.62402L12.8407 6.28333L9.71569 3.15833Z" fill="#383838" />
                                </svg>

                                <svg className="cursor-pointer" onClick={(e) => {
                  e.preventDefault()
                  deleteProject(item?._id);
                }}
                                  width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.33317 5.5V13.8333H2.6665V5.5H9.33317ZM8.08317 0.5H3.9165L3.08317 1.33333H0.166504V3H11.8332V1.33333H8.9165L8.08317 0.5ZM10.9998 3.83333H0.999837V13.8333C0.999837 14.75 1.74984 15.5 2.6665 15.5H9.33317C10.2498 15.5 10.9998 14.75 10.9998 13.8333V3.83333Z" fill="#DE3730" />
                                </svg>

                              </div>

                            </td>

                          </div>

                        </tr>
                      ))}
                    </tbody>


                  </table>
                </div>



              

              </div>
            </div>
          </div>
        </div>

        {popup1 && (
          <div className="allPopupWrap">
            <div className="awardpopupcont">

              <div className="allform_header">

              <h2>Create New Transfer</h2>

               <RxCross2      onClick={() => {
              setPopup1(false);
              setOnEdit(false);
              setEditData({});
              setFormdata({
                branch: "", Employee: "", Department: "", TransferDate: "", Description: ""
              })
            }}  className="RxCross2_form" />

              </div>


              <hr />

              <div className="popup_formdiv">

              

              <div className="lableawaiwrap">

                <label htmlFor="">
                  <p>Employee</p>
                  <select name="Employee" value={formdata?.Employee} onChange={changeHandler} id="">
                    <option value="Select Employee"> Select Employee</option>
                    {
                      allEmp.map((item, index) => (
                        <option value={item?.fullName} key={index}>{item?.fullName}</option>
                      ))
                    }
                  </select>

                </label>

                <label htmlFor="">
                  <p>Branch</p>
                  <select value={formdata?.branch} name="branch" onChange={changeHandler} id="">
            <option value="select Branch">select Branch</option>
            {
              allBranch?.map((item, index) => (
                <option value={item?.name} key={index}>{item?.name}</option>
              ))
            }
          </select>
                </label>

              </div>

              <div className="lableawaiwrap">

              <label htmlFor="">
          <p>Department</p>
          <select value={formdata?.Department} name="Department" onChange={changeHandler} id="">
            <option value="select Department">select Department</option>
            {
              allDep.map((item, index) => (
                <option value={item?.name} key={index}>{item.name}</option>
              ))
            }
          </select>

        </label>

        <label htmlFor="">
          <p>Transfer Date</p>
          <input
            type="date"
            value={formdata.TransferDate}
            onChange={changeHandler}
            name="TransferDate"
            placeholder="dd-mm-yyyy"
          />
        </label>

              </div>

              <div className="lableawaiwrap">

              <label htmlFor="">
          <p>Description</p>
          <textarea onChange={changeHandler}
            value={formdata.Description} id="w3review" name="Description" rows="8" cols="50" placeholder="Enter Description"></textarea>

                </label>

              </div>

              </div>

             

              <div className="btnWrap Award-popup-btn">
                <button onClick={() => {
                  setPopup1(false);
                  setOnEdit(false);
                  setEditData({});
                  setFormdata({
                    branch: "", Employee: "", Department: "", TransferDate: "", Description: ""
                  })
                }} className="cencel awd-cancel">
                  <span>Cancel</span>
                </button>

                <button className="create awd-create" onClick={() => {
                  submitHandler();
                  setPopup1(false);
                }}>
                  <span>{onEdit ? "Update" : "Create"}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default HRMsystemSetup;
