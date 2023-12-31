
import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator, addLocale } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import '../../../src/index.css'
import 'primeicons/primeicons.css';

import axios from 'axios';
import { useWordCount } from '../../Context/WordCountContext';
import ActionRequir from '../ActionRequir';
import NoActionRequir from '../NoActionRequir';
import { useLocation } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

let varQty = [];
let varDate = [];
let index = -1;
let index2 = -1;
let index3 = -1;

export default function CustomersDemo({ formId, setLoading, setError }) {


   const [selectedCustomers, setSelectedCustomers] = useState([]);
   const [updatedProducts, setUpdatedProducts] = useState([]);
   const [updatedQty, setUpdatedQty] = useState([]);
   const [updatedDate, setUpdatedDate] = useState([]);
   const [updatedProducts2, setUpdatedProducts2] = useState([]);
   const rowClass = (data) => {
      return {
         'bg-yellow-3': data.priority === 3,
         '': data.priority === 1,
      };
   };


   addLocale('es', {
      firstDayOfWeek: 1,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Hoy',
      clear: 'Limpiar',
   });
   const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
   });

   const renderHeader = () => {
      return (
         <div className="w-full flex flex-wrap gap-2 justify-between items-center">
            <h4 className="m-0 text-[1.5rem]">Data</h4>
         </div>
      );
   };

   const disableBodyTemplate = () => {
      return <InputText disabled className="p-column-filter my-2" />;
   };

   const desableBodyTemplate = () => {
      return <Calendar disabled className='calender-datatable' locale="es" />;
   };

   const textEditor = (options) => {
      return <Calendar className='!border-0 calender-datatable' value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
   };

   const statusEditor = (options) => {
      return (
         <InputText className='border-0 calender-datatable' value={options.value} />
      );
   };

   const priceEditor = (options) => {
      return <InputNumber className='calender-datatable' value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
   };

   const header = renderHeader();


   // Axois-API
   const [tableData, setTableData] = useState([]);
   const [table1Data, setTable1Data] = useState([]);
   const [table2Data, setTable2Data] = useState([]);
   const { updateWordCount, updateRecordsCount, apiData, visible, setVisible } = useWordCount();
   let location = useLocation();
   const baseurl = 'https://wmf-test.free.mockoapp.net';


   const getData = () => {
      if (formId !== null) {
         setLoading(true);
         axios.get(`${baseurl}/form/${formId}`)
            .then((res) => {
               return res.data.table_data;
            })
            .then(async (tblData) => {
               setTableData(tblData);
               await updateRecordsCount(tblData.length);
            })
            .finally(() => {
               setLoading(false);
            });

      }

   }


   useEffect(() => {
      if (tableData) {
         setTable1Data(tableData.filter(t => t.priority !== 1));
         setTable2Data(tableData.filter(t => t.priority === 1));
         updateRecordsCount(tableData.filter(t => t.priority !== 1).length);
      }
      setLoading(false)

   }, [tableData]);

   useEffect(() => {
      getData();
   }, [location]);



   // Edit row count
   const [inputValue, setInputValue] = useState('');
   const [emailData, setEmailData] = useState('');
   const { wordCount, recordCount } = useWordCount();
   // const isDisabled = wordCount > 5;
   const [postData, setPostData] = useState([]);
   const [value1, setValue1] = useState('');
   const today = new Date();


   useEffect(() => {

   }, [postData]);

   const exQtyBodyTemplate = (options) => {
      // first input
      return <InputNumber
         className='border-0 calender-datatable disabled xl:w-[100px]'
         useGrouping={false}
         onChange={async (e) => {

            setValue1(e.value);
            await updatePostData('qty', e.value, options.id);
            updateRecordCount(options.id, 'qty');
         }
         }
      />;
   };

   const exDateBodyTemplate = (options, rowData) => {
      // second input
      return <Calendar className='!border-0 calender-datatable w-[110px]'
         value={rowData.date}
         readOnlyInput
         minDate={today}
         locale="es"
         onChange={async (e) => {
            await updatePostData('date', e.target.value, options.id);
            updateRecordCount(options.id, 'date')
         }}
      />;
   };

   const noteBodyTemplate = (options) => {
      // third input
      return <>
         <InputText
            className='border-0 calender-datatable'
            onChange={async (e) => {
               await updatePostData('note', e.value, options.id);
               updateRecordCount(options.id, 'note')
            }} />
      </>
   };

   const handleInputChange = (e, id) => {
      setInputValue(e.target.value);
      updateRecordCount(id, '');
   };


   const updateRecordCount = async (id, field) => {

      let qty = 0;
      let date = 0;

      if (field == 'qty') {
         // field1
         const indexQty = varQty.findIndex(object => object === id);
         if (indexQty === -1) {
            varQty.push(id)

         }
      }
      if (field == 'date') {
         // field2
         const indexDate = varDate.findIndex(object => object === id);

         if (indexDate === -1) {
            varDate.push(id);
         }
      }

      index = updatedProducts.findIndex(object => object === id);
      index2 = varQty.findIndex(object2 => object2 === id);
      index3 = varDate.findIndex(object3 => object3 === id);
      if (index2 >= 0 && index3 >= 0) {
         if (index === -1) {
            console.log('index', index)
            setUpdatedProducts(updatedProducts => [...updatedProducts, id]);
            updateWordCount(wordCount + 1);
         }
      }
   }
   const updatePostData = async (field, val, id) => {
      if (field === 'date') {
         val = new Date(val).toISOString();
      }
      let curData = postData.filter(p => p.id === id);
      if (curData.length) {
         let curData_ = postData.filter(p => p.id === id)
            .map((d) => {
               if (d.id === id) {
                  return { ...d, [field]: val }
               }
               return d;
            })
         const postData_ = postData.map((np) => {
            if (np.id === curData_[0].id) {
               return np = curData_[0];
            }
            return np;
         })
         setPostData(postData_);
      } else {
         let newCurData = { ...curData, id: id, [field]: val };
         setPostData([...postData, newCurData]);

      }
   }

   const submitData = (e) => {
      // e.preventDefault();
      setVisible(false);
      if (formId !== null) {
         setLoading(true);
         const data = {
            "form-id": formId,
            "supplier_form_editor": emailData,
            "table_data": postData
         }
         axios.post(`${baseurl}/write_supplier_response_data`, data)
            .then((res) => {

            })
            .then((tblData) => {
               setTableData(tblData);
            })
            .finally(() => {
               setLoading(false);
            });
      }
   }

   return (
      <>
         <div>
            <div className=" data-table pb-[1.875rem]">
               <div className='border-t'>
                  <div className=''>
                     {table1Data &&
                        <div className='flex xl:gap-4 gap-3 w-full mt-[.625rem] xl:px-[1.875rem] lg:px-[1.25rem] px-[.9375rem]'>
                           <div>
                              <ActionRequir />
                              <NoActionRequir />
                           </div>
                           <div className='xl:w-[calc(100%_-_116px)] w-[calc(100%_-_92px)]'>
                              <DataTable id="first-table" rowClassName={rowClass} editMode="row" value={table1Data} header={header}
                                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                 rowsPerPageOptions={[10, 25, 50]} dataKey="id" selection={selectedCustomers} onSelectionChange={(e) => setSelectedCustomers(e.value)}
                                 filters={filters} filterDisplay="menu" globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']}
                                 emptyMessage="No Data found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" >
                                 <Column className="" field="plant_code" header="Plant Code" sortable showFilterMatchModes={false} />
                                 <Column className="" field="part_number" header="Part Number" sortable />
                                 <Column className="" field="tot_cum_required_at_day_1" header="Tot, Cum, Required at day-1" sortable dataType="date" />
                                 <Column className="" field="tot_cum_received_by_cfs" header="Tot, Cum, Received by CFS" sortable dataType="date" />
                                 <Column className="" field="balance_without_promise" header="Balance without Promises" sortable dataType="date" />
                                 <Column className="" field="balance" header="Balance" sortable dataType="date" />
                                 <Column editor={(options) => priceEditor(options)} className="" header="Exp Quanity" body={exQtyBodyTemplate} />
                                 <Column editor={(options) => textEditor(options)} className="" header="Exp delivery date" body={exDateBodyTemplate} />
                                 <Column editor={(options) => statusEditor(options)} header='Note' headerStyle={{ textAlign: 'center' }} body={noteBodyTemplate} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                 <Column className="" field="w_plus_1" header="W+1" sortable dataType="date" />
                                 <Column className="" field="w_plus_2" header="W+2" sortable dataType="date" />
                                 <Column className="" field="w_plus_3" header="W+3" sortable dataType="date" />
                                 <Column className="" field="material_description" header="Material Description" sortable />
                                 <Column className=" hidden" field="priority" header="Priority" sortable dataType="date" />
                              </DataTable>
                           </div>
                        </div>
                     }
                     {table2Data &&
                        <div className='flex xl:gap-4 gap-3 w-full xl:px-[1.875rem] lg:px-[1.25rem] px-[.9375rem] justify-end'>
                           {/* <NoActionRequir /> */}
                           <div className='xl:w-[calc(100%_-_116px)] w-[calc(100%_-_92px)]'>
                              <DataTable id="second-table" rowClassName={rowClass} editMode="row" value={table2Data} 
                                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                 rowsPerPageOptions={[10, 25, 50]} dataKey="id" selection={selectedCustomers} onSelectionChange={(e) => setSelectedCustomers(e.value)}
                                 filters={filters} filterDisplay="menu" globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']}
                                 emptyMessage="No Data found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" >
                                 <Column className=""  field="plant_code" header="Plant Code" sortable showFilterMatchModes={false} />
                                 <Column className="" field="part_number" header="Part Number" sortable />
                                 <Column className="" field="tot_cum_required_at_day_1" header="Tot, Cum, Required at day-1" sortable dataType="date" />
                                 <Column className="" field="tot_cum_received_by_cfs" header="Tot, Cum, Received by CFS" sortable dataType="date" />
                                 <Column className="" field="balance_without_promise" header="Balance without Promises" sortable dataType="date" />
                                 <Column className="" field="balance" header="Balance" sortable dataType="date" />
                                 <Column className="" field="" editor={(options) => priceEditor(options)} header="Exp Quanity" body={disableBodyTemplate} />
                                 <Column className="" field="" editor={(options) => textEditor(options)} header="Exp delivery date" showFilterMatchModes={false} body={desableBodyTemplate} />
                                 <Column className="" field="" editor={(options) => statusEditor(options)} header='Note' bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={disableBodyTemplate} />
                                 <Column className="" field="w_plus_1" header="W+1" sortable dataType="date" />
                                 <Column className="" field="w_plus_2" header="W+2" sortable dataType="date" />
                                 <Column className="" field="w_plus_3" header="W+3" sortable dataType="date" />
                                 <Column className="" field="material_description" header="Material Description" sortable />
                                 <Column className=" hidden" field="priority" header="Priority" sortable dataType="date" />
                              </DataTable>
                           </div>
                        </div>

                     }
                  </div>
               </div>
            </div>
            <div className="card flex justify-content-center mail-card">
               <Dialog className='' header="Enter Your Email" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                  <form action="" onSubmit={submitData} className='pt-3 pb-[1.5rem] mx-auto' >
                     <div>
                        <input type='email' onChange={(e) => { setEmailData(e.target.value) }} className='p-[10px] text-[16px] font-normal w-full focus:outline-0 border border-[#f1f1f1] rounded-sm' placeholder='Enter Email' required />
                     </div>

                     <div className='flex items-center justify-start gap-[.625rem] pt-[10px] '>
                        <input type="checkbox" id="confim" required />
                        <label htmlFor='confim' className='text-[14px] font-normal '>confirmed</label>
                     </div>
                     <button type='submit' className='w-full mt-2  bg-[#3b82f6] text-white font-medium py-[6px] px-[6px] rounded-md'>Send</button>
                  </form>
               </Dialog>
            </div>
         </div>

      </>
   );
}
