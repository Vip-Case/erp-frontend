'use client';
import React from 'react';
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Scrolling,
  GroupPanel,
  Editing,
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
} from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import MasterDetailGrid from './MasterDetailGrid';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

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

const saleAmountEditorOptions = {
  format: 'currency',
  showClearButton: true,
  inputAttr: {
    'aria-label': 'Filter cell',
  },
};

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
  ['Employee', '=', 'Clark Morgan'],
  'and',
  ['OrderDate', 'weekends'],
];

const App = () => (
  <DataGrid
    id="gridContainer"
    filterBuilder={filterBuilder}
    defaultFilterValue={filterValue}
    dataSource={dataSource}
    keyExpr="OrderID"
    showBorders={true}
    width="100%"
    height={600}
    remoteOperations={true}
  >
    {/* Master-Detail */}
    <MasterDetail enabled={true} component={MasterDetailGrid} />

    {/* Filtreler */}
    <FilterRow visible={true} />
    <HeaderFilter visible={true} />
    <FilterPanel visible={true} />
    <FilterBuilderPopup position={filterBuilderPopupPosition} />

    {/* Gruplama ve Düzenleme */}
    <GroupPanel visible={true} />
    <Editing
      mode="row"
      allowAdding={true}
      allowDeleting={true}
      allowUpdating={true}
    />
    <Grouping autoExpandAll={false} />

    {/* Sütunlar */}
    <Column dataField="OrderID" caption="Order ID" dataType="number" />
    <Column dataField="OrderNumber" caption="Invoice Number" dataType="number">
      <HeaderFilter groupInterval={10000} />
    </Column>
    <Column dataField="OrderDate" dataType="date">
      <RequiredRule message="The OrderDate field is required." />
    </Column>
    <Column
      dataField="SaleAmount"
      dataType="number"
      editorOptions={saleAmountEditorOptions}
      format="currency"
    >
      <HeaderFilter groupInterval={1000} />
    </Column>
    <Column dataField="Employee" caption="Employee" dataType="string" />
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
  </DataGrid>
);

export default App;