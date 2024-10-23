'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Manufacturer {
    id: number;
    cari: string;
    stokAdi: string;
    kod: string;
    barkod: string;
    marka: string;
}

const StockManufacturers: React.FC = () => {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

    const addManufacturer = () => {
        const newManufacturer: Manufacturer = {
            id: Date.now(),
            cari: '',
            stokAdi: '',
            kod: '',
            barkod: '',
            marka: '',
        };
        setManufacturers([...manufacturers, newManufacturer]);
    };

    const removeManufacturer = (id: number) => {
        setManufacturers(manufacturers.filter(m => m.id !== id));
    };

    const updateManufacturer = (id: number, field: keyof Manufacturer, value: string) => {
        setManufacturers(manufacturers.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        ));
    };

    return (
        <div className="space-y-4 p-4">
            {manufacturers.map((manufacturer, index) => (
                <Card key={manufacturer.id} className="relative">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-primary">Üretici {index + 1}</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeManufacturer(manufacturer.id)}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <X className="h-4 w-4" />
                                <span className="ml-2">Sil</span>
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <Select
                                    value={manufacturer.cari}
                                    onValueChange={(value) => updateManufacturer(manufacturer.id, 'cari', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Cari seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cari1">Cari 1</SelectItem>
                                        <SelectItem value="cari2">Cari 2</SelectItem>
                                        <SelectItem value="cari3">Cari 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Input
                                        placeholder="Stok Adı"
                                        value={manufacturer.stokAdi}
                                        onChange={(e) => updateManufacturer(manufacturer.id, 'stokAdi', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input
                                        placeholder="Kod"
                                        value={manufacturer.kod}
                                        onChange={(e) => updateManufacturer(manufacturer.id, 'kod', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input
                                        placeholder="Barkod"
                                        value={manufacturer.barkod}
                                        onChange={(e) => updateManufacturer(manufacturer.id, 'barkod', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Input
                                    placeholder="Marka"
                                    value={manufacturer.marka}
                                    onChange={(e) => updateManufacturer(manufacturer.id, 'marka', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button
                className="w-full"
                variant="outline"
                onClick={addManufacturer}
            >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Üretici Ekle
            </Button>
        </div>
    );
};

export default StockManufacturers;