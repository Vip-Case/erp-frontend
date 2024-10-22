'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Info, Printer, RefreshCcw } from 'lucide-react';

const StockForm: React.FC = () => {
    const [isActive, setIsActive] = useState(true);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Stok Formu</h2>
                <div className="flex space-x-2">
                    <Button variant="outline">
                        <Info className="mr-2 h-4 w-4" />
                        İşlemler
                    </Button>
                    <Button variant="default">
                        <Printer className="mr-2 h-4 w-4" />
                        KAYDET
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="genel">
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="genel">Genel</TabsTrigger>
                    <TabsTrigger value="diger">Diğer</TabsTrigger>
                    <TabsTrigger value="resmi-fatura">Resmi Fatura</TabsTrigger>
                    <TabsTrigger value="ozellikler">Özellikler</TabsTrigger>
                    <TabsTrigger value="uretciler">Üreticiler</TabsTrigger>
                    <TabsTrigger value="birimler">Birimler</TabsTrigger>
                    <TabsTrigger value="sube">Şube</TabsTrigger>
                </TabsList>

                <TabsContent value="genel">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex items-center space-x-2">
                                    <div className="flex-grow">
                                        <Label htmlFor="kategori">Kategori</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="- Seçiniz -" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="category1">Kategori 1</SelectItem>
                                                <SelectItem value="category2">Kategori 2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex space-x-2 self-end">
                                        <Button size="icon" variant="outline"><RefreshCcw className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="flex items-center space-x-2 self-end">
                                        <Switch
                                            checked={isActive}
                                            onCheckedChange={setIsActive}
                                        />
                                        <Label>Aktif</Label>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="stokAdi">Stok Adı</Label>
                                    <Input id="stokAdi" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label htmlFor="barkod">Barkod</Label>
                                        <Input id="barkod" />
                                    </div>
                                    <div>
                                        <Label htmlFor="stokKodu">Stok Kodu</Label>
                                        <Input id="stokKodu" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="birim">Birim</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Adet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="adet">Adet</SelectItem>
                                            <SelectItem value="kg">Kg</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="ureticiKodu">Üretici Kodu</Label>
                                    <Input id="ureticiKodu" />
                                </div>

                                {/* Price inputs */}
                                <div className="col-span-2 grid grid-cols-4 gap-2">
                                    <div>
                                        <Label>Fiyat</Label>
                                        <Input placeholder="0,00" />
                                    </div>
                                    <div>
                                        <Label>Döviz</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="₺" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tl">₺</SelectItem>
                                                <SelectItem value="usd">$</SelectItem>
                                                <SelectItem value="eur">€</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Kdv</Label>
                                        <Input placeholder="20,00" />
                                    </div>
                                    <div className="flex items-center space-x-2 mt-6">
                                        <Switch id="kdvDahil" />
                                        <Label htmlFor="kdvDahil">Kdv Dahil</Label>
                                    </div>
                                </div>

                                {/* More price inputs */}
                                <div className="col-span-2 grid grid-cols-4 gap-2">
                                    <div>
                                        <Label>Alış</Label>
                                        <Input placeholder="0,00" />
                                    </div>
                                    <div>
                                        <Label>Döviz</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="₺" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tl">₺</SelectItem>
                                                <SelectItem value="usd">$</SelectItem>
                                                <SelectItem value="eur">€</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Kdv</Label>
                                        <Input placeholder="20,00" />
                                    </div>
                                    <div className="flex items-center space-x-2 mt-6">
                                        <Switch id="kdvDahilAlis" />
                                        <Label htmlFor="kdvDahilAlis">Kdv Dahil</Label>
                                    </div>
                                </div>

                                <div className="col-span-2 grid grid-cols-4 gap-2">
                                    <div>
                                        <Label>Web</Label>
                                        <Input placeholder="0,00" />
                                    </div>
                                    <div>
                                        <Label>Döviz</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="₺" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tl">₺</SelectItem>
                                                <SelectItem value="usd">$</SelectItem>
                                                <SelectItem value="eur">€</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Kdv Dahil Fiyat</Label>
                                        <Input placeholder="0,00" />
                                    </div>
                                </div>

                                {/* Stock Type Properties */}
                                <div className="col-span-2 space-y-2">
                                    <h3 className="font-semibold">Stok Tipi Özellikleri</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label>Stok Tipi</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Ticari Mal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ticari">Ticari Mal</SelectItem>
                                                    <SelectItem value="hizmet">Hizmet</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Depo</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="HAZIRDAĞLI > 1.2 depo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="depo1">HAZIRDAĞLI {'>'} 1.2 depo</SelectItem>
                                                    <SelectItem value="depo2">Depo 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Image upload area */}
                                <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <p>Resim yüklemek için (+) butonuna tıklayınız.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Add content for other tabs as needed */}
                <TabsContent value="diger">Diğer sekmesi içeriği</TabsContent>
                <TabsContent value="resmi-fatura">Resmi Fatura sekmesi içeriği</TabsContent>
                <TabsContent value="ozellikler">Özellikler sekmesi içeriği</TabsContent>
                <TabsContent value="uretciler">Üreticiler sekmesi içeriği</TabsContent>
                <TabsContent value="birimler">Birimler sekmesi içeriği</TabsContent>
                <TabsContent value="sube">Şube sekmesi içeriği</TabsContent>
            </Tabs>
        </div>
    );
};

export default StockForm;