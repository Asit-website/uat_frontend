import React, { useState, useEffect } from "react";
import AdminNavbar from "../../admin/Navbar/AdminNavbar";
import AdminSidebar from "../../admin/Sidebar/AdminSidebar";
import "react-calendar/dist/Calendar.css";
import chevron from "../../images/chevron_right.png";
import { useMain } from "../../../hooks/useMain";

import "./award.css";

import plusIcon from "../../images/plusIcon.png";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import toast from "react-hot-toast";
import EmployeeNavbar from "../../Employee/Navbar/EmployeeNavbar";
import EmployeeSidebar from "../../Employee/Sidebar/EmployeeSidebar";

import { RxCross2 } from "react-icons/rx";



const HRMsystemSetup = ({ setAlert, pop, setPop }) => {
  const { user, createComplain, getComplain, updateComplain, deleteComplain, allEmployee } = useMain();
  const [popup1, setPopup1] = useState(false);

  let hrms_user = JSON.parse(localStorage.getItem("hrms_user"));

  const { role } = hrms_user;

  const [employee, setEmployee] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);

  const [formdata, setFormdata] = useState({
    complainFrom: "",
    complainAgain: "",
    title: "",
    complainDate: "",
    description: ""
  })

  const fetchEmployee = async () => {
    const ans = await allEmployee();
    setEmployee(ans?.emp);

  }

  const changeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value
    }))

  }

  const getData = async () => {
    const ans = await getComplain();
    setData(ans?.data);
  }

  useEffect(() => {
    if (onEdit) {
      setFormdata({
        id: editData._id,
        complainFrom: editData.complainFrom,
        complainAgain: editData.complainAgain,
        title: editData.title,
        complainDate: editData.complainDate,
        description: editData.description
      })
    }
  }, [editData])

  const submitHandler = async () => {
    try {
      if (onEdit) {
        await updateComplain({ ...formdata });
        toast.success("update successfully");
        setRefreshFlag(!refreshFlag);
      }
      else {
        await createComplain({ ...formdata });
        toast.success("Successfuly Created");
        setRefreshFlag(!refreshFlag);
      }
      setPopup1(false);
    } catch (error) {
      console.log(error);
    }
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
            await deleteComplain(id);
            toast.success("delete Successfully");
            setRefreshFlag(!refreshFlag);
            getData();
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
    fetchEmployee();
    getData();
  }, [refreshFlag])

  return (
    <>
      <div className="employee-dash h-full">
        {role === "EMPLOYEE" ? (
          <EmployeeSidebar pop={pop} setPop={setPop} />
        ) : (
          <AdminSidebar pop={pop} setPop={setPop} />
        )}

        <div className="tm awardtm">
          {role === "EMPLOYEE" ? (
            <EmployeeNavbar user={user} setAlert={setAlert} />
          ) : (
            <AdminNavbar user={user} setAlert={setAlert} />
          )}

          <div className="em">
            <div className="flex-col">
              <div className="admin-main adminmain">


                <div className="plusSection">
                  <div className="adminFirt">
                    <h2 className="hrmShed">Manage Complain</h2>

                    <div className="hrmDoHe">
                      <p>Dashboard</p>
                      <img src={chevron} alt="" />
                      <span>Complain</span>
                    </div>
                  </div>


                  <img
                    onClick={() => {
                      setPopup1(true);
                    }}
                    className="plusiCON"
                    src={plusIcon}
                    alt=""
                  />
                </div>


                <div className="relative overflow-x-auto w-full">
                  <table className="w-full table1 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                    <thead className="text-xs uppercase textALLtITL ">
                      <tr>

                        <th scope="col" className="px-6 py-3 taskTitl ">
                        COMPLAIN FROM
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        COMPLAIN TO
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        TITLE
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                        COMPLAIN DATE
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
                      {data.map((item, index) => (
                        <tr key={index} className="bg-white border-b fdf">

                          <td className="px-6 py-4 taskAns">{item?.complainFrom}</td>
                          <td className="px-6 py-4 taskAns">
                            {item?.complainAgain}
                          </td>
                          <td className="px-6 py-4 taskAns">{item?.title}</td>
                          <td className="px-6 py-4 taskAns">{item?.complainDate}</td>
                          <td className="px-6 py-4 taskAns">{item?.description}</td>

                          <div className="viewOnwWRAP">
                            <td

                              className="px-6 py-4 taskAns cursor-pointer"
                            >
                              <div className="testok">

                                <svg className="cursor-pointer" onClick={() => {
                    setOnEdit(true);
                    setEditData(item);
                    setPopup1(true)
                  }}  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.71569 5.51667L10.4824 6.28333L2.93236 13.8333H2.16569V13.0667L9.71569 5.51667ZM12.7157 0.5C12.5074 0.5 12.2907 0.583333 12.1324 0.741667L10.6074 2.26667L13.7324 5.39167L15.2574 3.86667C15.5824 3.54167 15.5824 3.01667 15.2574 2.69167L13.3074 0.741667C13.1407 0.575 12.9324 0.5 12.7157 0.5ZM9.71569 3.15833L0.499023 12.375V15.5H3.62402L12.8407 6.28333L9.71569 3.15833Z" fill="#383838" />
                                </svg>

                                <svg className="cursor-pointer" onClick={() => {
                    deleteProject(item?._id)
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

              <h2>Create New Complaint</h2>

              <RxCross2  onClick={() => {
            setPopup1(false);
            setOnEdit(false);
            setEditData({});
            setFormdata({
              complainFrom: "",
              complainAgain: "",
              title: "",
              complainDate: "",
              description: ""
            })
          }} className="RxCross2_form" />
              </div>

           

              <hr />

              <div className="popup_formdiv">

             

              <div className="lableawaiwrap">

              <label htmlFor="complainFrom">
            <p>Complaint Form</p>
            <select onChange={changeHandler} value={formdata?.complainFrom} name="complainFrom" >
              {
                employee?.map((val, index) => {
                  return <option key={index} value={val?.fullName}>{val?.fullName}</option>
                })
              }
            </select>
          </label>

          <label htmlFor="complainAgain">
            <p>Complaint Against</p>
            <select onChange={changeHandler} name="complainAgain" value={formdata?.complainAgain} >
              {
                employee?.map((val, index) => {
                  return <option key={index} value={val?.fullName}>{val?.fullName}</option>
                })
              }
            </select>
          </label>


              </div>

              <div className="lableawaiwrap">

              <label htmlFor="title">
            <p>Title</p>
            <input
              type="text"
              name="title"
              onChange={changeHandler}
              value={formdata?.title}
              placeholder=""
            />
          </label>


          <label htmlFor="complainDate">
            <p>Complaint Date</p>
            <input
              type="date"
              value={formdata?.complainDate}
              name="complainDate"
              onChange={changeHandler}
            />
          </label>

              </div>

              <div className="lableawaiwrap">

         <label htmlFor="description">
            <p>Description</p>
            <textarea onChange={changeHandler} value={formdata?.description}  name="description" rows="8" cols="50" placeholder="Enter Description"></textarea>
          </label>

              </div>

              </div>
      
              <div className="btnWrap Award-popup-btn">
                <button  onClick={() => {
            setPopup1(false);
            setOnEdit(false);
            setEditData({});
            setFormdata({
              complainFrom: "",
              complainAgain: "",
              title: "",
              complainDate: "",
              description: ""
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

