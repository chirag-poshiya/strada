import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { ProductService } from "./Products";

export default function RowEditingDemo() {
  const [products, setProducts] = useState(null);
  const [statuses] = useState(["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"]);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSeverity = (value) => {
    switch (value) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const onRowEditComplete = (e) => {
    console.log(products);
    let _products = [...products];
    console.log(_products);

    let { newData, index } = e;
    console.log(index, newData);

    _products[index] = newData;

    setProducts(_products);
    console.log("products", products);
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const priceEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        // mode="currency"
        // currency="USD"
        // locale="en-US"
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.inventoryStatus}
        severity={getSeverity(rowData.inventoryStatus)}
      ></Tag>
    );
  };

  const priceBodyTemplate = (options, rowData) => {
    return <>
      {/* {console.log(options, rowData)} */}
      <InputText
          value={options.price}
          onChange={(e) => {
            let _data = [...products];
            console.log(_data);
            _data[rowData.rowIndex].price = e.target.value
            setProducts(_data);
            console.log(e.target.value, rowData)
            console.log(products)
            // options.editorCallback(e.value)
          }}
          // mode="currency"
          // currency="USD"
          // locale="en-US"
        />
    </>
      ;
  };

  return (
    <div className="card p-fluid">
      <DataTable
        value={products}
        editMode="row"
        dataKey="id"
        onRowEditComplete={onRowEditComplete}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="code"
          header="Code"
          editor={(options) => textEditor(options)}
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="name"
          header="Name"
          editor={(options) => textEditor(options)}
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="inventoryStatus"
          header="Status"
          body={statusBodyTemplate}
          editor={(options) => statusEditor(options)}
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="price"
          header="Price"
          body={priceBodyTemplate}
          editor={(options) => priceEditor(options)}
          style={{ width: "20%" }}
        ></Column>
        <Column
          rowEditor
          headerStyle={{ width: "10%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        ></Column>
      </DataTable>
    </div>
  );
}
