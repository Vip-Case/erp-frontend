'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Check } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for available properties
const availableProperties = [
    {
        id: 1,
        name: 'Renk',
        values: ['Kırmızı', 'Mavi', 'Yeşil', 'Siyah', 'Beyaz']
    },
    {
        id: 2,
        name: 'Beden',
        values: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        id: 3,
        name: 'Materyal',
        values: ['Pamuk', 'Polyester', 'Yün', 'Keten']
    }
];

interface SelectedProperty {
    propertyId: number;
    propertyName: string;
    selectedValues: string[];
}

const StockProperties: React.FC = () => {
    const [selectedProperties, setSelectedProperties] = useState<SelectedProperty[]>([]);
    const [valueDialogOpen, setValueDialogOpen] = useState(false);
    const [activePropertyId, setActivePropertyId] = useState<number | null>(null);

    const handleAddProperty = () => {
        const availableProperty = availableProperties.find(
            prop => !selectedProperties.some(selected => selected.propertyId === prop.id)
        );

        if (availableProperty) {
            setSelectedProperties([
                ...selectedProperties,
                {
                    propertyId: availableProperty.id,
                    propertyName: availableProperty.name,
                    selectedValues: []
                }
            ]);
        }
    };

    const handleRemoveProperty = (propertyId: number) => {
        setSelectedProperties(selectedProperties.filter(prop => prop.propertyId !== propertyId));
    };

    const handleValueChange = (propertyId: number, value: string) => {
        setSelectedProperties(selectedProperties.map(prop => {
            if (prop.propertyId === propertyId) {
                const newValues = prop.selectedValues.includes(value)
                    ? prop.selectedValues.filter(v => v !== value)
                    : [...prop.selectedValues, value];
                return { ...prop, selectedValues: newValues };
            }
            return prop;
        }));
    };

    const openValueDialog = (propertyId: number) => {
        setActivePropertyId(propertyId);
        setValueDialogOpen(true);
    };

    const getPropertyValues = (propertyId: number) => {
        const property = availableProperties.find(p => p.id === propertyId);
        return property ? property.values : [];
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Stok Özellikleri</h3>
                        <Button
                            variant="outline"
                            onClick={handleAddProperty}
                            disabled={selectedProperties.length === availableProperties.length}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Özellik Ekle
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Özellik</TableHead>
                                <TableHead>Değerler</TableHead>
                                <TableHead className="w-[100px]">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedProperties.map((property) => (
                                <TableRow key={property.propertyId}>
                                    <TableCell className="font-medium">
                                        <Select
                                            value={property.propertyId.toString()}
                                            onValueChange={(value) => {
                                                const newPropertyId = parseInt(value);
                                                const newProperty = availableProperties.find(p => p.id === newPropertyId);
                                                if (newProperty) {
                                                    setSelectedProperties(prev => prev.map(p =>
                                                        p.propertyId === property.propertyId
                                                            ? { ...p, propertyId: newPropertyId, propertyName: newProperty.name, selectedValues: [] }
                                                            : p
                                                    ));
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue>{property.propertyName}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableProperties
                                                    .filter(p => p.id === property.propertyId ||
                                                        !selectedProperties.some(sp => sp.propertyId === p.id))
                                                    .map(p => (
                                                        <SelectItem key={p.id} value={p.id.toString()}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog open={valueDialogOpen && activePropertyId === property.propertyId}
                                            onOpenChange={(open) => {
                                                if (!open) {
                                                    setValueDialogOpen(false);
                                                    setActivePropertyId(null);
                                                }
                                            }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                    onClick={() => openValueDialog(property.propertyId)}
                                                >
                                                    {property.selectedValues.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {property.selectedValues.map(value => (
                                                                <Badge key={value} variant="secondary">
                                                                    {value}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        "Değer seçin..."
                                                    )}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{property.propertyName} Değerleri</DialogTitle>
                                                </DialogHeader>
                                                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {getPropertyValues(property.propertyId).map((value) => (
                                                            <Button
                                                                key={value}
                                                                variant={property.selectedValues.includes(value) ? "default" : "outline"}
                                                                onClick={() => handleValueChange(property.propertyId, value)}
                                                                className="justify-start"
                                                            >
                                                                <Check className={`mr-2 h-4 w-4 ${property.selectedValues.includes(value) ? "opacity-100" : "opacity-0"
                                                                    }`} />
                                                                {value}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveProperty(property.propertyId)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {selectedProperties.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Henüz özellik eklenmemiş
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {selectedProperties.length > 0 && (
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline">
                                İptal
                            </Button>
                            <Button>
                                Kaydet
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StockProperties;