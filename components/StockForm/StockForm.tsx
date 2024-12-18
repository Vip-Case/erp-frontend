'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tag, TagInput } from 'emblor';
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RefreshCcw, AlertCircle, Loader2, ImagePlus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import StockProperties from './StockProperties';
import StockManufacturers from './StockManufacturers';
import StockUnits from './StockUnits';
import CategorySelector from './CategorySelector';
import { Alert, AlertDescription } from '../ui/alert';
import { useWarehouses } from './hooks/useWarehouses';
import { useBrands } from './hooks/useBrands';
import { useCategories } from './hooks/useCategories';
import ImagePreview from './ImagePreview';
import { useStockForm } from './hooks/useStockForm';

const currencies = [
  { value: 'TRY', label: '₺ TRY' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' }
];

const productTypes = [
  { value: 'BasitUrun', label: 'Basit Ürün' },
  { value: 'VaryasyonluUrun', label: 'Varyasyonlu Ürün' },
  { value: 'DijitalUrun', label: 'Dijital Ürün' },
  { value: 'Hizmet', label: 'Hizmet' }
];

const units = [
  { value: 'Adet', label: 'Adet' },
  { value: 'Kg', label: 'Kg' },
  { value: 'Lt', label: 'Lt' },
  { value: 'M', label: 'M' },
  { value: 'M2', label: 'M2' },
  { value: 'M3', label: 'M3' },
  { value: 'Paket', label: 'Paket' },
  { value: 'Koli', label: 'Koli' },
  { value: 'Kutu', label: 'Kutu' },
  { value: 'Ton', label: 'Ton' }
];

interface FormErrors {
  productName?: string;
  productCode?: string;
  unit?: string;
  brandId?: string;
  maliyetFiyat?: string;
  categories?: string;
}

const StockForm: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('genel');
  const [isActive, setIsActive] = useState(true);
  const [isSerili, setIsSerili] = useState(false);
  const [isYerli, setIsYerli] = useState(false);
  const [barcodes, setBarcodes] = useState<Tag[]>([]);
  const [marketNames, setMarketNames] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { warehouses, loading: warehousesLoading, error: warehousesError } = useWarehouses();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();
  const { refreshCategories, loading: categoriesLoading } = useCategories();

  const {
    formState,
    loading: saveLoading,
    error: saveError,
    updateStockCard,
    updateBarcodes,
    updateMarketNames,
    updateCategories,
    updateWarehouse,
    updateEFatura,
    saveStockCard
  } = useStockForm();

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formState.stockCard.productName.trim()) {
      errors.productName = 'Stok adı zorunludur';
    }

    if (!formState.stockCard.productCode.trim()) {
      errors.productCode = 'Stok kodu zorunludur';
    }

    if (!formState.stockCard.unit) {
      errors.unit = 'Birim seçimi zorunludur';
    }

    if (!formState.stockCard.brandId) {
      errors.brandId = 'Marka seçimi zorunludur';
    }

    if (formState.stockCard.maliyetFiyat < 0) {
      errors.maliyetFiyat = 'Maliyet fiyatı 0\'dan küçük olamaz';
    }

    if (selectedCategories.length === 0) {
      errors.categories = 'En az bir kategori seçilmelidir';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Lütfen zorunlu alanları doldurun",
      });
      return;
    }

    try {
      updateBarcodes(barcodes.map(tag => tag.text));
      updateMarketNames(marketNames.map(tag => tag.text));
      updateCategories(selectedCategories);

      await saveStockCard();
      
      toast({
        title: "Başarılı",
        description: "Stok kartı başarıyla kaydedildi",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Stok kartı kaydedilirken bir hata oluştu",
      });
    }
  };

  const handleImageUpload = async () => {
    try {
      setImageUploadLoading(true);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          const newImages: string[] = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            await new Promise((resolve) => {
              reader.onload = (e) => {
                if (e.target?.result) {
                  newImages.push(e.target.result as string);
                }
                resolve(null);
              };
              reader.readAsDataURL(file);
            });
          }
          setImages((prev) => [...prev, ...newImages]);
        }
      };

      input.click();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Resimler yüklenirken bir hata oluştu",
      });
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleNavigatePreview = (direction: 'prev' | 'next') => {
    if (previewImage === null) return;

    if (direction === 'prev' && previewImage > 0) {
      setPreviewImage(previewImage - 1);
    } else if (direction === 'next' && previewImage < images.length - 1) {
      setPreviewImage(previewImage + 1);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Stok Formu</h2>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => {
                setIsActive(checked);
                updateStockCard('stockStatus', checked);
              }}
              id="active-status"
            />
            <Label htmlFor="active-status" className="font-medium">
              {isActive ? 'Aktif' : 'Pasif'}
            </Label>
          </div>
        </div>
        <Button 
          variant="default"
          onClick={handleSave}
          disabled={saveLoading}
        >
          {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Kaydet
        </Button>
      </div>

      {saveError && (
        <Alert variant="destructive" className="mx-4 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <div className="flex-grow overflow-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            <TabsTrigger value="genel">Genel</TabsTrigger>
            <TabsTrigger value="diger">Diğer</TabsTrigger>
            <TabsTrigger value="resmi-fatura">Resmi Fatura</TabsTrigger>
            <TabsTrigger value="ozellikler">Özellikler</TabsTrigger>
            <TabsTrigger value="uretciler">Üreticiler</TabsTrigger>
            <TabsTrigger value="birimler">Birimler</TabsTrigger>
          </TabsList>

          <TabsContent value="genel">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Categories Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Kategoriler</Label>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={refreshCategories}
                          disabled={categoriesLoading}
                        >
                          <RefreshCcw className={`h-4 w-4 mr-2 ${categoriesLoading ? 'animate-spin' : ''}`} />
                          Yenile
                        </Button>
                      </div>
                    </div>
                    <CategorySelector
                      selectedCategories={selectedCategories}
                      onCategoryChange={setSelectedCategories}
                    />
                    {formErrors.categories && (
                      <p className="text-sm text-destructive mt-1">{formErrors.categories}</p>
                    )}
                  </div>

                  {/* Basic Info Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Stok Adı</Label>
                      <Input
                        id="productName"
                        value={formState.stockCard.productName}
                        onChange={(e) => updateStockCard('productName', e.target.value)}
                        placeholder="Stok adını giriniz"
                        className={formErrors.productName ? 'border-destructive' : ''}
                      />
                      {formErrors.productName && (
                        <p className="text-sm text-destructive mt-1">{formErrors.productName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="productCode">Stok Kodu</Label>
                      <Input
                        id="productCode"
                        value={formState.stockCard.productCode}
                        onChange={(e) => updateStockCard('productCode', e.target.value)}
                        placeholder="Stok kodunu giriniz"
                        className={formErrors.productCode ? 'border-destructive' : ''}
                      />
                      {formErrors.productCode && (
                        <p className="text-sm text-destructive mt-1">{formErrors.productCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="unit">Birim</Label>
                      <Select
                        value={formState.stockCard.unit}
                        onValueChange={(value) => updateStockCard('unit', value)}
                      >
                        <SelectTrigger className={formErrors.unit ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Birim seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.unit && (
                        <p className="text-sm text-destructive mt-1">{formErrors.unit}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="brand">Marka</Label>
                      {brandsLoading ? (
                        <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-muted-foreground">Yükleniyor...</span>
                        </div>
                      ) : brandsError ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{brandsError}</AlertDescription>
                        </Alert>
                      ) : (
                        <Select
                          value={formState.stockCard.brandId}
                          onValueChange={(value) => updateStockCard('brandId', value)}
                        >
                          <SelectTrigger className={formErrors.brandId ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Marka seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.brandName} ({brand.brandCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {formErrors.brandId && (
                        <p className="text-sm text-destructive mt-1">{formErrors.brandId}</p>
                      )}
                    </div>
                    <div>
                      <Label>Stok Tipi</Label>
                      <Select
                        value={formState.stockCard.productType}
                        onValueChange={(value) => updateStockCard('productType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Stok tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="maliyetFiyat">Maliyet</Label>
                      <Input
                        id="maliyetFiyat"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formState.stockCard.maliyetFiyat}
                        onChange={(e) => updateStockCard('maliyetFiyat', parseFloat(e.target.value))}
                        className={`text-right ${formErrors.maliyetFiyat ? 'border-destructive' : ''}`}
                      />
                      {formErrors.maliyetFiyat && (
                        <p className="text-sm text-destructive mt-1">{formErrors.maliyetFiyat}</p>
                      )}
                    </div>
                    <div>
                      <Label>Maliyet Dövizi</Label>
                      <Select
                        value={formState.stockCard.maliyetDoviz}
                        onValueChange={(value) => updateStockCard('maliyetDoviz', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Depo</Label>
                      {warehousesLoading ? (
                        <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-muted-foreground">Yükleniyor...</span>
                        </div>
                      ) : warehousesError ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{warehousesError}</AlertDescription>
                        </Alert>
                      ) : (
                        <Select
                          value={formState.stockCardWarehouse[0]?.id}
                          onValueChange={(value) => updateWarehouse(value, formState.stockCardWarehouse[0]?.quantity || 0)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Depo seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id}>
                                {warehouse.warehouseName} ({warehouse.warehouseCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="quantity">Stok Miktarı</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={formState.stockCardWarehouse[0]?.quantity || 0}
                        onChange={(e) => {
                          const warehouseId = formState.stockCardWarehouse[0]?.id;
                          if (warehouseId) {
                            updateWarehouse(warehouseId, parseInt(e.target.value));
                          }
                        }}
                        className="text-right"
                      />
                    </div>
                  </div>

                  {/* Images Section */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Resimler</Label>
                    <div className="flex items-start space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleImageUpload}
                        disabled={imageUploadLoading}
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Ekle
                      </Button>
                    </div>
                  </div>

                  {images.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-muted-foreground">
                          Resim yüklemek için yukarıdaki butonları kullanın
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewImage(index)}
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newImages = [...images];
                              newImages.splice(index, 1);
                              setImages(newImages);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <ImagePreview
                    images={images}
                    currentIndex={previewImage ?? 0}
                    isOpen={previewImage !== null}
                    onClose={() => setPreviewImage(null)}
                    onNavigate={handleNavigatePreview}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diger">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Switches Section */}
                  <div className="flex items-center justify-end space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isSerili}
                        onCheckedChange={(checked) => {
                          setIsSerili(checked);
                          updateStockCard('hasExpirationDate', checked);
                        }}
                        id="serili"
                      />
                      <Label htmlFor="serili">Serili</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isYerli}
                        onCheckedChange={(checked) => {
                          setIsYerli(checked);
                          updateStockCard('allowNegativeStock', checked);
                        }}
                        id="eksiSeviye"
                      />
                      <Label htmlFor="eksiSeviye">Eksi Seviye Satış</Label>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Sıra</Label>
                      <Input
                        value={formState.stockCard.siraNo}
                        onChange={(e) => updateStockCard('siraNo', e.target.value)}
                        placeholder="Sıra numarası giriniz"
                      />
                    </div>
                    <div>
                      <Label>Raf</Label>
                      <Input
                        value={formState.stockCard.raf}
                        onChange={(e) => updateStockCard('raf', e.target.value)}
                        placeholder="Raf numarası giriniz"
                      />
                    </div>
                  </div>

                  {/* Codes Section */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Barkodlar</Label>
                      <TagInput
                        tags={barcodes}
                        setTags={setBarcodes}
                        placeholder="Barkod girin ve Enter'a basın"
                        styleClasses={{
                          input: 'w-full',
                          tag: { body: 'bg-red-500/10 text-red-500' },
                        }}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Piyasa Adları</Label>
                      <TagInput
                        tags={marketNames}
                        setTags={setMarketNames}
                        placeholder="Piyasa adı girin ve Enter'a basın"
                        styleClasses={{
                          input: 'w-full',
                          tag: { body: 'bg-blue-500/10 text-blue-500' },
                        }}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label>GTIP</Label>
                      <Input
                        value={formState.stockCard.gtip}
                        onChange={(e) => updateStockCard('gtip', e.target.value)}
                        placeholder="GTIP kodunu giriniz"
                      />
                    </div>
                    <div>
                      <Label>PLU Kodu</Label>
                      <Input
                        value={formState.stockCard.pluCode}
                        onChange={(e) => updateStockCard('pluCode', e.target.value)}
                        placeholder="PLU kodunu giriniz"
                      />
                    </div>
                    <div>
                      <Label>Kar Marjı (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formState.stockCard.karMarji}
                        onChange={(e) => updateStockCard('karMarji', parseFloat(e.target.value))}
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label>Desi</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formState.stockCard.desi}
                        onChange={(e) => updateStockCard('desi', parseFloat(e.target.value))}
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label>Adet Böleni</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formState.stockCard.adetBoleni}
                        onChange={(e) => updateStockCard('adetBoleni', parseInt(e.target.value))}
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label>Kritik Seviye Miktar</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formState.stockCard.riskQuantities}
                        onChange={(e) => updateStockCard('riskQuantities', parseInt(e.target.value))}
                        className="text-right"
                      />
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-4">
                    <div>
                      <Label>Kısa Açıklama</Label>
                      <Input
                        value={formState.stockCard.shortDescription}
                        onChange={(e) => updateStockCard('shortDescription', e.target.value)}
                        placeholder="Kısa açıklama giriniz"
                      />
                    </div>
                    <div>
                      <Label>Açıklama</Label>
                      <Textarea
                        value={formState.stockCard.description}
                        onChange={(e) => updateStockCard('description', e.target.value)}
                        placeholder="Detaylı açıklama giriniz"
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resmi-fatura">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resmi Fatura</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="eFaturaProductName">Ürün Adı</Label>
                        <Input
                          id="eFaturaProductName"
                          value={formState.eFatura[0]?.productName || ''}
                          onChange={(e) => updateEFatura(
                            formState.eFatura[0]?.productCode || '',
                            e.target.value,
                            formState.eFatura[0]?.stockCardPriceListId || ''
                          )}
                          placeholder="Ürün adını giriniz"
                        />
                      </div>

                      <div>
                        <Label htmlFor="eFaturaProductCode">Ürün Kodu</Label>
                        <Input
                          id="eFaturaProductCode"
                          value={formState.eFatura[0]?.productCode || ''}
                          onChange={(e) => updateEFatura(
                            e.target.value,
                            formState.eFatura[0]?.productName || '',
                            formState.eFatura[0]?.stockCardPriceListId || ''
                          )}
                          placeholder="Ürün kodunu giriniz"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ozellikler">
            <StockProperties />
          </TabsContent>

          <TabsContent value="uretciler">
            <StockManufacturers />
          </TabsContent>

          <TabsContent value="birimler">
            <StockUnits />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StockForm;