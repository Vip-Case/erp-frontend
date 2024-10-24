'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tag, TagInput } from 'emblor';
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Info, Printer, RefreshCcw, CloudDownload, DownloadCloud } from 'lucide-react';
import StockProperties from './StockProperties';
import StockManufacturers from './StockManufacturers';
import StockBranch from './StockBranch';
import StockUnits from './StockUnits';

const StockForm: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [isSerili, setIsSerili] = useState(false);
  const [isYerli, setIsYerli] = useState(false);
  const [barcodes, setBarcodes] = useState<Tag[]>([]);
  const [codes, setCodes] = useState<Tag[]>([]);
  const [marketNames, setMarketNames] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [faturaAd, setFaturaAd] = useState('');
  const [satisFiyat, setSatisFiyat] = useState('0,00');
  const [satisFiyatKdv, setSatisFiyatKdv] = useState('0,00');
  const [kdvOrani, setKdvOrani] = useState('20,00');

  return (
    <div className="flex flex-col h-auto">
      <div className="flex justify-between items-center mb-4 p-4">
        <h2 className="text-2xl font-bold">Stok Formu</h2>
        <div className="flex space-x-2">
          <Button variant="default">
            <Printer className="mr-2 h-4 w-4" />
            KAYDET
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <div className="flex h-auto">
            <Tabs defaultValue="genel" className="h-auto flex flex-col">
              <TabsList className="grid w-full grid-cols-9 mb-4">
                <TabsTrigger value="genel">Genel</TabsTrigger>
                <TabsTrigger value="diger">Diğer</TabsTrigger>
                <TabsTrigger value="resmi-fatura">Resmi Fatura</TabsTrigger>
                <TabsTrigger value="ozellikler">Özellikler</TabsTrigger>
                <TabsTrigger value="uretciler">Üreticiler</TabsTrigger>
                <TabsTrigger value="birimler">Birimler</TabsTrigger>
                <TabsTrigger value="sube">Şube</TabsTrigger>
                <TabsTrigger value="pazaryeri">Pazaryerleri</TabsTrigger>
                <TabsTrigger value="hareket">Hareketler</TabsTrigger>
              </TabsList>

              <TabsContent value="genel" className="h-[calc(100%-3rem)] overflow-auto">
                <Card className="h-auto">
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
                      <div className="col-span-2 flex items-center space-x-2">
                        <div className="flex-grow col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <p>Resim yüklemek için (+) butonuna tıklayınız.</p>
                        </div>
                        <div className="flex space-x-2 self-end">
                          <Button size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
                          <Button size="icon" variant="outline"><DownloadCloud className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="diger" className="h-[calc(100%-3rem)] overflow-auto">
                <Card className="h-auto">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* First Row */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Hızlı Satış Grubu</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Örn: Muhtelif" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="muhtelif">Örn: Muhtelif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Raf</Label>
                          <Input placeholder="" />
                        </div>
                        <div className="flex items-center space-x-4 pt-6">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={isSerili}
                              onCheckedChange={setIsSerili}
                            />
                            <Label>Serili</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={isYerli}
                              onCheckedChange={setIsYerli}
                            />
                            <Label>Yerli</Label>
                          </div>
                        </div>
                      </div>

                      {/* Barkodlar, Kodlar, Piyasa Adları */}
                      <div className="space-y-4">
                        <Label>Barkodlar</Label>
                        <TagInput
                          tags={barcodes}
                          setTags={setBarcodes}
                          placeholder="Barkod Ekle"
                          styleClasses={{
                            input: 'w-full sm:max-w-[350px]',
                          }}
                          activeTagIndex={activeTagIndex}
                          setActiveTagIndex={setActiveTagIndex}
                        />
                        <br />
                        <Label>Kodlar</Label>
                        <TagInput
                          tags={codes}
                          setTags={setCodes}
                          placeholder="Kod Ekle"
                          styleClasses={{
                            input: 'w-full sm:max-w-[350px]',
                          }}
                          activeTagIndex={activeTagIndex}
                          setActiveTagIndex={setActiveTagIndex}
                        />
                        <br />
                        <Label>Piyasa Adları</Label>
                        <TagInput
                          tags={marketNames}
                          setTags={setMarketNames}
                          placeholder="Piyasa Adı Ekle"
                          styleClasses={{
                            input: 'w-full sm:max-w-[350px]',
                          }}
                          activeTagIndex={activeTagIndex}
                          setActiveTagIndex={setActiveTagIndex}
                        />
                      </div>

                      {/* GTIP and PLU Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>GTIP</Label>
                          <Input />
                        </div>
                        <div>
                          <Label>PLU Kodu</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="plu1">PLU 1</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Kar Marjı and PLU No Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Kar Marjı (%)</Label>
                          <Input placeholder="0" />
                        </div>
                        <div>
                          <Label>PLU No</Label>
                          <Input placeholder="0" />
                        </div>
                      </div>

                      {/* Desi and Adet Böleni Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Desi</Label>
                          <Input placeholder="1" />
                        </div>
                        <div>
                          <Label>Adet Böleni</Label>
                          <Input placeholder="1" />
                        </div>
                      </div>

                      {/* Açıklamalar */}
                      <div className="space-y-4">
                        <div>
                          <Label>Kısa Açıklama</Label>
                          <Input />
                        </div>
                        <div>
                          <Label>Açıklama</Label>
                          <Textarea className="min-h-[100px]" />
                        </div>
                      </div>

                      {/* Gruplar */}
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label>Grup 1</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Grup 1" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="group1">Grup 1</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Grup 2</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Grup 2" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="group2">Grup 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Grup 3</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Grup 3" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="group3">Grup 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Grup 4</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Grup 4" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="group4">Grup 4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Kritik Seviye Miktar */}
                      <div>
                        <Label>Kritik Seviye Miktar</Label>
                        <Input placeholder="0" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resmi-fatura" className="h-[calc(100%-3rem)] overflow-auto">
                <Card className="h-auto">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Resmi Fatura</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="faturaAd">Fatura Ad</Label>
                            <Input
                              id="faturaAd"
                              value={faturaAd}
                              onChange={(e) => setFaturaAd(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="satisFiyat">Satış Fiyat TRY</Label>
                              <Input
                                id="satisFiyat"
                                value={satisFiyat}
                                onChange={(e) => setSatisFiyat(e.target.value)}
                                className="text-right"
                              />
                            </div>
                            <div>
                              <Label htmlFor="satisFiyatKdv">Satış Fiyat (KDV'li) TRY</Label>
                              <Input
                                id="satisFiyatKdv"
                                value={satisFiyatKdv}
                                onChange={(e) => setSatisFiyatKdv(e.target.value)}
                                className="text-right"
                              />
                            </div>
                            <div>
                              <Label htmlFor="kdv">Kdv</Label>
                              <Input
                                id="kdv"
                                value={kdvOrani}
                                onChange={(e) => setKdvOrani(e.target.value)}
                                className="text-right"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ozellikler" className="h-[calc(100%-3rem)] overflow-auto">
                <StockProperties />
              </TabsContent>
              <TabsContent value="uretciler" className="h-[calc(100%-3rem)] overflow-auto">
                <StockManufacturers />
              </TabsContent>
              <TabsContent value="birimler" className="h-[calc(100%-3rem)] overflow-auto">
                <StockUnits />
              </TabsContent>
              <TabsContent value="sube" className="h-[calc(100%-3rem)] overflow-auto">
                <StockBranch />
              </TabsContent>
              <TabsContent value="pazaryeri" className="h-[calc(100%-3rem)] overflow-auto">
                <Card className="h-auto">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Pazaryerleri</h3>
                    <p>Pazaryeri işlemleri yapabilmek için stok formunu kayıt ediniz.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="hareket" className="h-[calc(100%-3rem)] overflow-auto">
                <Card className="h-auto">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Hareketler</h3>
                    <p>Stok hareketlerini görmek için stok formunu kayıt ediniz.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StockForm;