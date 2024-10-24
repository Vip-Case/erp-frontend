'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MovementsToolbar from './MovementsToolbar';
import MovementsGrid from './MovementsGrid';

const StockMovements: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all-movements');

    return (
        <div className="grid-container">
            <MovementsToolbar />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid grid-cols-6 w-full">
                    <TabsTrigger value="previous-purchases">Önceki Alışlar</TabsTrigger>
                    <TabsTrigger value="customer-purchases">İlgili Cariden Alışlar</TabsTrigger>
                    <TabsTrigger value="previous-sales">Önceki Satışlar</TabsTrigger>
                    <TabsTrigger value="customer-sales">İlgili Cariden Satışlar</TabsTrigger>
                    <TabsTrigger value="orders">Siparişler</TabsTrigger>
                    <TabsTrigger value="all-movements">Tüm Hareketler</TabsTrigger>
                </TabsList>

                <TabsContent value="previous-purchases">
                    <Card>
                        <MovementsGrid />
                    </Card>
                </TabsContent>

                <TabsContent value="customer-purchases">
                    <Card>
                        <MovementsGrid />
                    </Card>
                </TabsContent>

                <TabsContent value="previous-sales">
                    <Card>
                        <MovementsGrid />
                    </Card>
                </TabsContent>

                <TabsContent value="customer-sales">
                    <Card>
                        <MovementsGrid />
                    </Card>
                </TabsContent>

                <TabsContent value="orders">
                    <Card>
                        <MovementsGrid />
                    </Card>
                </TabsContent>

                <TabsContent value="all-movements">
                    <Card>
                        <MovementsGrid />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StockMovements;