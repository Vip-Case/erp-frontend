'use client';
import React, { useRef, useState, useEffect } from 'react';
import DataGrid, {
  Column,
  Export,
  Selection,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Scrolling,
  GroupPanel,
  Grouping,
  MasterDetail,
  Lookup,
  Summary,
  TotalItem,
  GroupItem,
  ValueFormat,
  RequiredRule,
  RangeRule,
  StringLengthRule, 
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
  Position,
  DataGridTypes,
  SearchPanel,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import MasterDetailGrid from './MasterDetailGrid';
import { Settings, X } from 'lucide-react';
import { DataType, HorizontalAlignment, VerticalAlignment } from 'devextreme/common';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

const onExporting = (e: DataGridTypes.ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Main sheet');

  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
    });
  });
};

const createDataSource = (key: string, loadUrl: string) => createStore({
  key,
  loadUrl,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const dataSource = createDataSource('OrderID', `${url}/Orders`);
const customersData = createDataSource('Value', `${url}/CustomersLookup`);
const shippersData = createDataSource('Value', `${url}/ShippersLookup`);

const searchEditorOptions = { placeholder: 'Search column' };

const filterBuilder = {
  customOperations: [
    {
      name: 'weekends',
      dataTypes: ['date' as DataType],
      icon: 'check',
      hasValue: false,
      calculateFilterExpression: () => [
        ['OrderDate', '=', 0],
        'or',
      ],
    },
  ],
};

const filterValue = [
  ['OrderID', '=', 10248],
];

const StockList: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dataGridRef = useRef<DataGrid>(null);
  const [filterBuilderPopupPosition, setFilterBuilderPopupPosition] = useState({});

  useEffect(() => {
    setFilterBuilderPopupPosition({
      of: window,
      at: { x: 'center' as HorizontalAlignment, y: 'top' as VerticalAlignment },
      my: { x: 'center' as HorizontalAlignment, y: 'top' as VerticalAlignment },
      offset: { y: 10 },
    });
  }, []);

  const clearFilters = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearFilter();
    }
  };

  const renderSettingsButton = () => {
    return (
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
            <button 
              className="dx-button dx-button-normal dx-button-mode-contained dx-widget dx-button-has-icon" 
              title="Ayarlar"
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Settings size={18} />
              <span>Ayarlar</span>
            </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stok Listesi Görünüm Formatları</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-medium">Görünüm Ayarları</h3>
            <p className="text-sm text-gray-500">
              Stok listesi görünümünü özelleştirin.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderClearFiltersButton = () => {
    return (
      <button 
        className="dx-button dx-button-normal dx-button-mode-contained dx-widget" 
        onClick={clearFilters}
        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <X size={18} />
        <span>Filtreleri Temizle</span>
      </button>
    );
  };

  return (
    <div className="p-4">
      <DataGrid
        ref={dataGridRef}
        id="gridContainer"
        filterBuilder={filterBuilder}
        defaultFilterValue={filterValue}
        dataSource={dataSource}
        keyExpr="OrderID"
        showBorders={true}
        showRowLines={true}
        showColumnLines={true}
        width="100%"
        height={600}
        remoteOperations={true}
        onExporting={onExporting}
        columnHidingEnabled={true}
        allowColumnResizing={true}
        columnResizingMode='widget'
        allowColumnReordering={true}
        columnWidth={100}
      >
        <SearchPanel visible={true} width={240} placeholder="Genel arama..." />
        <Selection mode="multiple" />
        <ColumnChooser height={340} enabled={true} mode="select">
          <Position my="right top" at="right bottom" of=".dx-datagrid-column-chooser-button" />
          <ColumnChooserSearch enabled={true} editorOptions={searchEditorOptions} />
          <ColumnChooserSelection allowSelectAll={true} selectByClick={true} recursive={true} />
        </ColumnChooser>
        <MasterDetail enabled={true} component={MasterDetailGrid} />
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <FilterPanel visible={true} />
        <FilterBuilderPopup position={filterBuilderPopupPosition} />
        <GroupPanel visible={true} />
        <Grouping autoExpandAll={false} />
        <Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column><Column dataField="OrderID" caption="Order ID" dataType="number" />
        <Column dataField="OrderDate" dataType="date">
          <RequiredRule message="The OrderDate field is required." />
        </Column>
        <Column dataField="CustomerID" caption="Customer">
          <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
          <StringLengthRule max={5} message="The field Customer must be a string with a maximum length of 5." />
        </Column>
        <Column dataField="Freight">
          <HeaderFilter groupInterval={100} />
          <RangeRule min={0} max={2000} message="The field Freight must be between 0 and 2000." />
        </Column>
        <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
          <StringLengthRule max={15} message="The field ShipCountry must be a string with a maximum length of 15." />
        </Column>
        <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
          <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
        </Column>
        <Summary>
          <TotalItem column="Freight" summaryType="sum">
            <ValueFormat type="decimal" precision={2} />
          </TotalItem>
          <GroupItem column="Freight" summaryType="sum">
            <ValueFormat type="decimal" precision={2} />
          </GroupItem>
          <GroupItem summaryType="count" />
        </Summary>
        <Scrolling mode="virtual" columnRenderingMode='virtual' rowRenderingMode='virtual' />
        <Export enabled={true} allowExportSelectedData={true} />
        <Toolbar>
          <Item name="searchPanel" location="before" />
          <Item location="before" render={renderClearFiltersButton} />
          <Item location="before" render={renderSettingsButton} />
          <Item name="exportButton" location="after" />
          <Item name="columnChooserButton" location="after" />
        </Toolbar>
      </DataGrid>
    </div>
  );
};

export default StockList;
