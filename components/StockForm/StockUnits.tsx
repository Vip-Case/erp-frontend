'use client';

import React from 'react';
import DataGrid, {
    Column,
    Export,
    Editing,
    Lookup,
    FilterRow,
    HeaderFilter,
    Selection,
    Toolbar,
    Item,
    ColumnChooser,
    Button as DxButton,
} from 'devextreme-react/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Card, CardContent } from '@/components/ui/card';

interface StockUnit {
    id: number;
    group: string;
    unit: string;
    ratio: number;
    value: number;
    priceType: string;
    salePriceIncludeVat: number;
    salePriceExcludeVat: number;
    purchasePriceIncludeVat: number;
    purchasePriceExcludeVat: number;
    barcode: string;
}

const priceTypes = [
    { id: 'fixedPrice', name: 'Sabit Fiyat' },
    { id: 'addAmountSale', name: 'Tutar Ekle (Satış Fiyatına)' },
    { id: 'addRateSale', name: 'Oran Ekle (Satış Fiyatına)' },
    { id: 'addAmountPurchase', name: 'Tutar Ekle (Alış Fiyatına)' },
    { id: 'addRatePurchase', name: 'Oran Ekle (Alış Fiyatına)' },
];

const groups = [
    { id: 'retail', name: 'Dış Müşteri' },
    { id: 'wholesale', name: 'TOPTAN' },
    { id: 'cashPrice', name: 'Özel Fiyat' },
    { id: 'installmentPrice', name: 'Taban Fiyat' },
];

const units = [
    { id: 'piece', name: 'Koli' },
    { id: 'box', name: 'Adet' },
    { id: 'kg', name: 'KG' },
];

const generateBarcode = () => {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000;
};

const defaultNewRow = {
    group: 'retail',
    unit: 'piece',
    ratio: 1,
    value: 100.00,
    priceType: 'fixedPrice',
    salePriceIncludeVat: 100.00,
    salePriceExcludeVat: 83.33,
    purchasePriceIncludeVat: 0.00,
    purchasePriceExcludeVat: 0.00,
    barcode: generateBarcode().toString(),
};

const onExporting = (e: any) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Birimler.xlsx');
        });
    });
};

const StockUnits: React.FC = () => {
    const renderPriceIndicators = () => {
        return (
            <div className="flex items-center gap-4">
                <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md whitespace-nowrap">
                    ↓ 0,00 • %20 Kdv = 0,00
                </div>
                <div className="bg-[#68B92E] text-white px-4 py-2 rounded-md whitespace-nowrap">
                    ↑ 83,33 • %20 Kdv = 100,00
                </div>
            </div>
        );
    };

    const customizePriceCell = (cellData: any) => {
        const value = parseFloat(cellData.value);
        return {
            text: value.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            color: value > 0 ? '#059669' : '#DC2626',
        };
    };

    const onInitNewRow = (e: any) => {
        e.data = { ...defaultNewRow };
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <DataGrid
                    dataSource={[]}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    rowAlternationEnabled={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    onExporting={onExporting}
                    onInitNewRow={onInitNewRow}
                >
                    <Selection mode="multiple" />
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <Export enabled={true} />
                    <ColumnChooser enabled={true} mode="select" />
                    <Editing
                        mode="cell"
                        allowUpdating={true}
                        allowAdding={true}
                        allowDeleting={true}
                    />

                    <Toolbar>
                        <Item name="addRowButton" location="before" showText="always" />
                        <Item location="before" render={renderPriceIndicators} />
                        <Item name="exportButton" location="after" />
                        <Item name="columnChooserButton" location="after" />
                    </Toolbar>

                    <Column type="buttons" width={70} caption="Sil">
                        <DxButton name="delete" />
                    </Column>
                    <Column caption="Tanımlar" alignment='center'>
                        <Column
                            dataField="group"
                            caption="Grup"
                            allowEditing={true}
                        >
                            <Lookup dataSource={groups} valueExpr="id" displayExpr="name" />
                        </Column>

                        <Column
                            dataField="unit"
                            caption="Birim"
                            allowEditing={true}
                        >
                            <Lookup dataSource={units} valueExpr="id" displayExpr="name" />
                        </Column>

                        <Column
                            dataField="ratio"
                            caption="Çarpan"
                            dataType="number"
                            format="#,##0.##"
                            allowEditing={true}
                        />

                        <Column
                            dataField="value"
                            caption="Değer"
                            dataType="number"
                            format="#,##0.00"
                            allowEditing={true}
                        />

                        <Column
                            dataField="priceType"
                            caption="Fiyat Tipi"
                            allowEditing={true}
                        >
                            <Lookup dataSource={priceTypes} valueExpr="id" displayExpr="name" />
                        </Column>
                    </Column>
                    <Column caption="Satış Fiyatı" alignment='center'>
                        <Column
                            dataField="salePriceIncludeVat"
                            caption="Kdv Dahil"
                            dataType="number"
                            allowEditing={true}
                            cellRender={(cellData) => {
                                const style = customizePriceCell(cellData);
                                return (
                                    <span style={{ color: style.color, fontWeight: 500 }}>
                                        {style.text}
                                    </span>
                                );
                            }}
                        />

                        <Column
                            dataField="salePriceExcludeVat"
                            caption="Kdv Hariç"
                            dataType="number"
                            allowEditing={true}
                            cellRender={(cellData) => {
                                const style = customizePriceCell(cellData);
                                return (
                                    <span style={{ color: style.color, fontWeight: 500 }}>
                                        {style.text}
                                    </span>
                                );
                            }}
                        />
                    </Column>
                    <Column caption="Alış Fiyatı" alignment='center'>
                        <Column
                            dataField="purchasePriceIncludeVat"
                            caption="Kdv Dahil"
                            dataType="number"
                            allowEditing={true}
                            cellRender={(cellData) => {
                                const style = customizePriceCell(cellData);
                                return (
                                    <span style={{ color: style.color, fontWeight: 500 }}>
                                        {style.text}
                                    </span>
                                );
                            }}
                        />

                        <Column
                            dataField="purchasePriceExcludeVat"
                            caption="Kdv Hariç"
                            dataType="number"
                            allowEditing={true}
                            cellRender={(cellData) => {
                                const style = customizePriceCell(cellData);
                                return (
                                    <span style={{ color: style.color, fontWeight: 500 }}>
                                        {style.text}
                                    </span>
                                );
                            }}
                        />
                    </Column>
                    <Column
                        dataField="barcode"
                        caption="Barkod"
                        allowEditing={true}
                    />
                </DataGrid>
            </CardContent>
        </Card>
    );
};

export default StockUnits;