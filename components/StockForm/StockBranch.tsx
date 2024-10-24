"use client";

import React from "react";
import DataGrid, {
    Column,
    Export,
    Editing,
    Lookup,
    FilterRow,
    DataGridTypes,
    HeaderFilter,
    Selection,
    Item,
    Toolbar,
} from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Card, CardContent } from "@/components/ui/card";

interface BranchPrice {
    id: number;
    branch: string;
    priceType: string;
    value: number;
    branchSalePrice: number;
}

const priceTypes = [
    { id: "addRateSale", name: "Oran Ekle (Satış Fiyatına)" },
    { id: "addRatePurchase", name: "Oran Ekle (Alış Fiyatına)" },
    { id: "addAmountSale", name: "Tutar Ekle (Satış Fiyatına)" },
    { id: "addAmountPurchase", name: "Tutar Ekle (Alış Fiyatına)" },
];

const branches = [
    { id: "HAZARDAGLI", name: "HAZARDAĞLI" },
    { id: "ATASEHIR", name: "ATAŞEHİR" },
    { id: "CARSILISE", name: "ÇARŞI LİSE" },
    { id: "CARSILGS", name: "ÇARŞI LGS" },
    { id: "CAYDACIRA", name: "ÇAYDAÇIRA" },
    { id: "MARINA", name: "MARİNA" },
    { id: "MERKEZ", name: "MERKEZ" },
    { id: "HLTMERKEZ", name: "HLT MERKEZ" },
    { id: "HDSUBE", name: "HD ŞUBE" },
];

const initialData: BranchPrice[] = branches.map((branch, index) => ({
    id: index + 1,
    branch: branch.id,
    priceType: "addRateSale",
    value: branch.id === "HAZARDAGLI" ? 10 : 0,
    branchSalePrice:
        branch.id === "HAZARDAGLI"
            ? 110.0
            : branch.id === "CARSILISE" ||
                branch.id === "MARINA" ||
                branch.id === "MERKEZ"
                ? 100.0
                : 0.0,
}));

const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                "DataGrid.xlsx"
            );
        });
    });
};

const StockBranch: React.FC = () => {
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

    const customizeBranchCell = (cellData: any) => {
        const branch = branches.find((b) => b.id === cellData.value);
        if (branch) {
            return {
                text: branch.name,
                color: "#D97706", // Amber-600 for branch names
            };
        }
        return cellData;
    };

    const customizeSalePriceCell = (cellData: any) => {
        return {
            text: cellData.value.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            color: cellData.value > 0 ? "#059669" : "#DC2626", // Green for positive, red for zero/negative
        };
    };

    const onEditingStart = (e: any) => {
        // Only allow editing of priceType and value columns
        if (e.column.dataField !== "priceType" && e.column.dataField !== "value") {
            e.cancel = true;
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <DataGrid
                    dataSource={initialData}
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    rowAlternationEnabled={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    onEditingStart={onEditingStart}
                    onExporting={onExporting}
                >
                    <Selection mode="multiple" />
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <Export enabled={true} allowExportSelectedData={true} />
                    <Editing mode="cell" allowUpdating={true} />

                    <Toolbar>
                        <Item location="before" render={renderPriceIndicators} />
                        <Item name="exportButton" location="after" />
                    </Toolbar>

                    <Column
                        dataField="branch"
                        caption="Şube"
                        allowFiltering={true}
                        allowEditing={false}
                        cellRender={(cellData) => {
                            const style = customizeBranchCell(cellData);
                            return (
                                <span style={{ color: style.color, fontWeight: 500 }}>
                                    {style.text}
                                </span>
                            );
                        }}
                    >
                        <Lookup dataSource={branches} valueExpr="id" displayExpr="name" />
                    </Column>

                    <Column
                        dataField="priceType"
                        caption="Fiyat Tipi"
                        allowFiltering={true}
                        allowEditing={true}
                    >
                        <Lookup dataSource={priceTypes} valueExpr="id" displayExpr="name" />
                    </Column>

                    <Column
                        dataField="value"
                        caption="Değer"
                        dataType="number"
                        format="#,##0.00"
                        allowEditing={true}
                    />

                    <Column
                        dataField="branchSalePrice"
                        caption="Şube Satış Fiyatı"
                        dataType="number"
                        allowEditing={false}
                        cellRender={(cellData) => {
                            const style = customizeSalePriceCell(cellData);
                            return (
                                <span style={{ color: style.color, fontWeight: 500 }}>
                                    {style.text}
                                </span>
                            );
                        }}
                    />
                </DataGrid>
            </CardContent>
        </Card>
    );
};

export default StockBranch;