export interface BrandSupport {
  phone: string;
  url: string;
}

export const brandSupport: Record<string, BrandSupport> = {
  Apple: { phone: '000800 1009009', url: 'https://support.apple.com/en-in' },
  Samsung: { phone: '1800 5726 7864', url: 'https://www.samsung.com/in/support/' },
  Sony: { phone: '1800 103 7799', url: 'https://web.sony-asia.com/in/contact-us/' },
  LG: { phone: '1800 315 9999', url: 'https://www.lg.com/in/support' },
  OnePlus: { phone: '1800 102 8411', url: 'https://www.oneplus.in/support' },
  Xiaomi: { phone: '1800 103 6286', url: 'https://www.mi.com/in/support/' },
  Dyson: { phone: '1800 258 6688', url: 'https://www.dyson.in/support' },
  HP: { phone: '1800 200 0047', url: 'https://support.hp.com/in-en' },
  Dell: { phone: '1800 425 2067', url: 'https://www.dell.com/support/home/en-in' },
  Logitech: { phone: '1800 572 4730', url: 'https://support.logi.com/hc/en-in' },
};
