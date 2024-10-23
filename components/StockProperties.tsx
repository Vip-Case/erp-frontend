'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Edit2 } from 'lucide-react';
import { TagInput } from "@/components/ui/tag-input";
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
    DialogFooter,
} from "@/components/ui/dialog";

interface Property {
    id: number;
    name: string;
    values: string[];
}

const StockProperties: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [newProperty, setNewProperty] = useState<{ name: string; values: string[] }>({
        name: '',
        values: [],
    });

    const handleAddProperty = () => {
        if (newProperty.name && newProperty.values.length > 0) {
            if (editingProperty) {
                setProperties(properties.map(prop =>
                    prop.id === editingProperty.id
                        ? { ...prop, name: newProperty.name, values: newProperty.values }
                        : prop
                ));
            } else {
                setProperties([...properties, {
                    id: Date.now(),
                    name: newProperty.name,
                    values: newProperty.values
                }]);
            }
            handleDialogClose();
        }
    };

    const handleEditProperty = (property: Property) => {
        setEditingProperty(property);
        setNewProperty({ name: property.name, values: property.values });
        setIsDialogOpen(true);
    };

    const handleDeleteProperty = (id: number) => {
        setProperties(properties.filter(prop => prop.id !== id));
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setNewProperty({ name: '', values: [] });
        setEditingProperty(null);
    };

    const openNewPropertyDialog = () => {
        setEditingProperty(null);
        setNewProperty({ name: '', values: [] });
        setIsDialogOpen(true);
    };

    return (
        <Card className="h-auto">
            <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Özellikler</h3>
                    <Button variant="outline" size="sm" onClick={openNewPropertyDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Özellik Ekle
                    </Button>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingProperty ? 'Özellik Düzenle' : 'Yeni Özellik Ekle'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="propertyName">Özellik Adı</Label>
                                <Input
                                    id="propertyName"
                                    value={newProperty.name}
                                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                                    placeholder="Özellik adını giriniz"
                                />
                            </div>
                            <div>
                                <Label htmlFor="propertyValues">Özellik Değerleri</Label>
                                <TagInput
                                    id="propertyValues"
                                    placeholder="Değer girin ve Enter'a basın"
                                    tags={newProperty.values}
                                    className="mt-1"
                                    onTagsChange={(newTags) =>
                                        setNewProperty({ ...newProperty, values: newTags })
                                    }
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Her bir değeri girdikten sonra Enter tuşuna basın
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleDialogClose}>
                                İptal
                            </Button>
                            <Button
                                onClick={handleAddProperty}
                                disabled={!newProperty.name || newProperty.values.length === 0}
                            >
                                {editingProperty ? 'Güncelle' : 'Ekle'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Özellik Adı</TableHead>
                            <TableHead>Özellik Değerleri</TableHead>
                            <TableHead className="w-[100px]">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {properties.map((property) => (
                            <TableRow key={property.id}>
                                <TableCell>{property.name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {property.values.map((value, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                            >
                                                {value}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditProperty(property)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteProperty(property.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {properties.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    Henüz özellik eklenmemiş
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default StockProperties;