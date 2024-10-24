export const movements = [{
    id: 1,
    date: new Date(2024, 2, 15),
    documentNo: "FT-2024-0001",
    documentType: "Satış Faturası",
    warehouse: "Ana Depo",
    customer: "ABC Ltd.",
    stockCode: "STK001",
    stockName: "Ürün A",
    unit: "Adet",
    quantity: 100,
    unitPrice: 150.00,
    currency: "TRY",
    totalAmount: 15000.00,
    vat: 2700.00,
    totalWithVat: 17700.00,
    description: "Standart satış",
    branch: "Merkez",
    user: "admin",
    createdAt: new Date(2024, 2, 15, 10, 30),
    status: "Tamamlandı"
}];

export const documentTypes = [
    "Satış Faturası",
    "Alış Faturası",
    "Satış İrsaliyesi",
    "Alış İrsaliyesi",
    "Sayım Fazlası",
    "Sayım Eksiği",
    "Transfer",
];

export const warehouses = [
    "Ana Depo",
    "Yedek Depo",
    "Satış Depo",
];

export const branches = [
    "Merkez",
    "Şube 1",
    "Şube 2",
];

export const currencies = ["TRY", "USD", "EUR"];