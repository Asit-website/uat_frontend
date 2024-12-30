import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { useMain } from "../../../hooks/useMain";
import "./lead.css"
import bxs from '../../images/bxs.svg'
import EmployeeSidebar from "../../Employee/Sidebar/EmployeeSidebar";
import EmployeeNavbar from "../../Employee/Navbar/EmployeeNavbar";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LeadFile2 = ({ setAlert, pop, setPop }) => {
  const navigate = useNavigate();
    const { user, allEmployee, createExcelLead } = useMain();

    const [selectedFiles , setSelectedFiles] = useState("");


    const [users, setUsers] = useState([]);
  
    let hrms_user = JSON.parse(localStorage.getItem("hrms_user"));

    // Excel sheet
    const [excelFile, setExcelFile] = useState(null);
  
    const [typeError, setTypeError] = useState(null);
  
    // submit state
    const [excelData, setExcelData] = useState(null);
  
    const getData = async () => {
      const ans1 = await allEmployee();
      setUsers(ans1?.emp);
    };
  
    useEffect(() => {
      getData();
    }, []);
  
    // onchange event
    const handleFile = (e) => {
      let fileTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
  
      let selectedFile = e.target.files[0];
  
      if (selectedFile) {
        setSelectedFiles(selectedFile);

        if (selectedFile && fileTypes.includes(selectedFile.type)) {
          setTypeError(null);
          let reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            setExcelFile(e.target.result);
          };
          toast.success("Successfuly Browse..");
        } else {
          setTypeError("please seelect only file type");
          setExcelFile(null);
        }
      } else {
        console.log("please select the file");
      }
    };
  
    // onsubmit event
    const handleFileSubmit = async (e) => {
      e.preventDefault();
  
      if (excelFile !== null) {
        const workbook = XLSX.read(excelFile, { type: "buffer" });
  
        const worksheetName = workbook.SheetNames[0];
  
        const worksheet = workbook.Sheets[worksheetName];
  
        const data = XLSX.utils.sheet_to_json(worksheet);
    
        let toastId;
  
        if (data?.length > 0) {
          toastId = toast.loading("Loading....");
        }
  
        setExcelData(data?.slice(0, 10));
  
        for (let i = 0; i < data?.length; i++) {

          const {
            CompanyName,
            Email,
            LeadStatus , 
            FirstName,
            LastName ,
            Website
          } = data[i];
  
      
        const ans = await createExcelLead({
          LeadOwner: hrms_user?._id,
          CompanyName,
          Email,
          Website , 
          LeadStatus , 
          FirstName,
          LastName ,
            });
  
          }
        
  
        toast.success("Successfuly uploaded");
        navigate("/adminDash/myLead");
  
        toast.dismiss(toastId);
      }
    };

    return (
        <>
            <div className="employee-dash h-full">
                <EmployeeSidebar pop={pop} setPop={setPop} />

                <div className="tm">
                    <EmployeeNavbar user={user} setAlert={setAlert} />

                    <div className="em">
                        <div className="importB">
                            <h2>Import Leads</h2>
                           <NavLink to="/employeeDash/myLead"><button className="refresh canlo">
                                <span className="ref1">Cancel</span>
                            </button></NavLink>
                        </div>
                        <div className="import_vhasa">
                            <div className="form_filel">
                                <img src={bxs} alt="bxs" />
                                <h3>From File</h3>
                            </div>

                            <div className="selis">
                                <h3 className="srop">Drag and drop your file here. <br />
                                    -  or  -</h3>
                                <div className="selis_inp">
                                    <div className="opd mt-4">
                                        <div className="browse">
                                            <h3>Browse Local Files</h3>
                                        </div>
                                        <input type="file"  onChange={handleFile} required />
                                    </div>
                                    {selectedFiles && <p className="text-center">{selectedFiles.name}</p>} 

                                </div>
                                <div className="download_gfg">
                                    <h2>Download sample file
                                        <span> CSV </span>
                                           or
                                        <span> XLSX </span>
                                    </h2>
                                </div>

                                <button onClick={handleFileSubmit} className="uplaodin">
                  <span>Upload</span>
                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeadFile2;
