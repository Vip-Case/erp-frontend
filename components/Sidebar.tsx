'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from "next-themes";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  ShoppingBag,
  ClipboardList,
  BarChart2,
  Settings,
  Server,
  File,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onMenuItemClick: (itemName: string) => void;
}

const menuItems = [
  {
    name: 'İşlemler',
    icon: <LayoutDashboard className="h-5 w-5" />,
    subItems: [
      'Cari İşlemleri',
      'Kasa İşlemleri',
      'Banka İşlemleri',
      'Kredi Kartı İşlemleri',
      'POS İşlemleri',
      'Çek/Senet İşlemleri',
      'Hizmet/Masraf İşlemleri',
      'Evrak Yönetimi',
      'Online Banka İşlemleri',
    ],
  },
  {
    name: 'Stoklar',
    icon: <Package className="h-5 w-5" />,
    subItems: [
      'Stok Listesi',
      'Stok Formu',
      'Hizmet - Masraflar',
      'Hareketler',
      'Kategoriler',
      'Özellikler',
      'Fişler',
      'Bundle/Set Stoklar',
      'Bundle/Set Stok Formu',
      'Hızlı Stok',
      'Kampanyalar',
    ],
  },
  {
    name: 'Cariler',
    icon: <Users className="h-5 w-5" />,
    subItems: [
      'Cari Listesi',
      'Cari Kategorileri',
      'Hesap Özeti',
      'Ödeme/Tahsilat Plan',
    ],
  },
  {
    name: 'Hızlı Satış',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    name: 'Depolar',
    icon: <Warehouse className="h-5 w-5" />,
    subItems: ['Depo Tanımlama', 'Depo Listesi', 'Mal Kabul', 'Mal Çıkış', 'Stok Sayım', 'Sipariş Paketleme'],
  },
  {
    name: 'Pazaryerleri',
    icon: <ShoppingBag className="h-5 w-5" />,
    subItems: ['Siparişler', 'Servisler', 'İşlem Geçmişi'],
  },
  {
    name: 'Fatura / İrsaliye',
    icon: <File className="h-5 w-5" />,
    subItems: [
      'Fatura Listesi',
      'İrsaliye Listesi',
      'Planlı Fatura',
      'BA/BS',
      'Gelen E-Faturalar',
      'Gelen E-İrsaliyeler',
    ],
  },
  {
    name: 'Kartlar',
    icon: <ClipboardList className="h-5 w-5" />,
    subItems: ['Şubeler'],
  },
  {
    name: 'Raporlar',
    icon: <BarChart2 className="h-5 w-5" />,
    subItems: [
      'Cari Bakiye',
      'Cari Satışlar',
      'Banka Bakiye',
      'Kasa Bakiye',
      'Stok Devir Hiz',
      'Stok',
      'Envanter',
      'Fatura Hareketleri',
      'Sipariş Hareketleri',
      'Sipariş Stokları',
      'Pazaryeri Hakediş',
      'Fatura Karlılık',
      'Günlük Rapor',
      'Sayım Rapor Liste',
      'Stok Hareketleri',
      'Stok Bakiyeleri',
      'Kdv Rapor',
      'Firma/Şube Durum Raporu',
    ],
  },
  {
    name: 'Ayarlar',
    icon: <Settings className="h-5 w-5" />,
    subItems: [
      'Kullanıcılar',
      'Rol Grupları',
      'Tanımlar',
      'Firma',
      'Günlükler',
      'Servis Şablonları',
      'Yedekleme',
      'Bildirimler',
      'Queue Workers',
    ],
  },
  {
    name: 'Servisler',
    icon: <Server className="h-5 w-5" />,
    subItems: [
      'Xml Stok Servisi',
      'NetGsm Sms',
      'Mail Servisi',
      'PayTR Ödeme Servisi',
    ],
  },
  {
    name: 'Yazdırma Şablonları',
    icon: <FileText className="h-5 w-5" />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onMenuItemClick }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    );
  };

  const logoSrc = mounted && (theme === 'dark' || resolvedTheme === 'dark') ? '/logo-light.svg' : '/logo-dark.svg';

  if (!mounted) {
    return null; // or a loading placeholder
  }

  return (
    <aside
      className={`bg-sidebar-bg text-sidebar-text transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex justify-center items-center">
        <Image
          src={logoSrc}
          alt="Logo"
          width={isCollapsed ? 64 : 240}
          height={isCollapsed ? 32 : 40}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-4rem-64px)]">
        <nav className="p-2">
          {menuItems.map((item) => (
            <div key={item.name} className="mb-1">
              <Button
                variant="ghost"
                className={`w-full justify-start text-sm text-sidebar-text hover:bg-sidebar-hover ${
                  isCollapsed ? 'px-2' : 'px-3'
                }`}
                onClick={() => {
                  if (item.subItems && !isCollapsed) {
                    toggleExpand(item.name);
                  } else {
                    onMenuItemClick(item.name);
                  }
                }}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="ml-2 truncate">{item.name}</span>
                    {item.subItems && (
                      <span className="ml-auto">
                        {expandedItems.includes(item.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </>
                )}
              </Button>
              {!isCollapsed &&
                item.subItems &&
                expandedItems.includes(item.name) && (
                  <div className="ml-4 mt-1">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem}
                        variant="ghost"
                        className="w-full justify-start text-sm py-1 px-2 mb-1 text-sidebar-text hover:bg-sidebar-hover"
                        onClick={() => onMenuItemClick(subItem)}
                      >
                        <span className="truncate">{subItem}</span>
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;