'use client';
import React from 'react';
import DataGrid, {
  Column,
  Export,
  Selection,
  DataGridTypes,
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
} from 'devextreme-react/data-grid';
import { ColumnResizeMode } from 'devextreme-react/common/grids';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import MasterDetailGrid from './MasterDetailGrid';

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

const dataSource = createStore({
  key: 'OrderID',
  loadUrl: `${url}/Orders`,
  insertUrl: `${url}/InsertOrder`,
  updateUrl: `${url}/UpdateOrder`,
  deleteUrl: `${url}/DeleteOrder`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const customersData = createStore({
  key: 'Value',
  loadUrl: `${url}/CustomersLookup`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const shippersData = createStore({
  key: 'Value',
  loadUrl: `${url}/ShippersLookup`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const searchEditorOptions = { placeholder: 'Search column' };


const filterBuilderPopupPosition = typeof window !== 'undefined' ? {
  of: window,
  at: 'top' as const,
  my: 'top' as const,
  offset: { y: 10 },
} : undefined;

const filterBuilder = {
  customOperations: [
    {
      name: 'weekends',
      caption: 'Weekends',
      dataTypes: ['date' as const],
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

const App = () => (
  <DataGrid
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
  >
    <Selection mode="multiple" />
    <ColumnChooser
          height='340px'
          enabled={true}
          mode='select'
        >
          <Position
            my="right top"
            at="right bottom"
            of=".dx-datagrid-column-chooser-button"
          />

          <ColumnChooserSearch
            enabled={true}
            editorOptions={searchEditorOptions} />

          <ColumnChooserSelection
            allowSelectAll={true}
            selectByClick={true}
            recursive={true} />
        </ColumnChooser>
    {/* Master-Detail */}
    <MasterDetail enabled={true} component={MasterDetailGrid} />

    {/* Filtreler */}
    <FilterRow visible={true} />
    <HeaderFilter visible={true} />
    <FilterPanel visible={true} />
    <FilterBuilderPopup position={filterBuilderPopupPosition} />

    {/* Gruplama ve Düzenleme */}
    <GroupPanel visible={true} />
    <Grouping autoExpandAll={false} />

    {/* Sütunlar */}
    <Column dataField="OrderID" caption="Order ID" dataType="number" />
    <Column dataField="OrderDate" dataType="date">
      <RequiredRule message="The OrderDate field is required." />
    </Column>
    <Column dataField="CustomerID" caption="Customer">
      <Lookup dataSource={customersData} valueExpr="Value" displayExpr="Text" />
      <StringLengthRule
        max={5}
        message="The field Customer must be a string with a maximum length of 5."
      />
    </Column>
    <Column dataField="Freight">
      <HeaderFilter groupInterval={100} />
      <RangeRule
        min={0}
        max={2000}
        message="The field Freight must be between 0 and 2000."
      />
    </Column>
    <Column dataField="ShipCountry" caption="Ship Country" dataType="string">
      <StringLengthRule
        max={15}
        message="The field ShipCountry must be a string with a maximum length of 15."
      />
    </Column>
    <Column dataField="ShipVia" caption="Shipping Company" dataType="number">
      <Lookup dataSource={shippersData} valueExpr="Value" displayExpr="Text" />
    </Column>

    {/* Toplam Bilgisi */}
    <Summary>
      <TotalItem column="Freight" summaryType="sum">
        <ValueFormat type="decimal" precision={2} />
      </TotalItem>
      <GroupItem column="Freight" summaryType="sum">
        <ValueFormat type="decimal" precision={2} />
      </GroupItem>
      <GroupItem summaryType="count" />
    </Summary>

    {/* Kaydırma */}
    <Scrolling mode="virtual" />
    <Export enabled={true} allowExportSelectedData={true} />
  </DataGrid>
);

export default App;