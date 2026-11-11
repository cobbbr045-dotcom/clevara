export interface ProvinceData {
  id: string;
  name: string;
  districts: string[];
}

export const NEPAL_PROVINCES: ProvinceData[] = [
  {
    id: 'koshi',
    name: 'Koshi Province',
    districts: [
      'Bhojpur',
      'Dhankuta',
      'Ilam',
      'Jhapa',
      'Khotang',
      'Morang',
      'Okhaldhunga',
      'Panchthar',
      'Sankhuwasabha',
      'Solukhumbu',
      'Sunsari',
      'Taplejung',
      'Terhathum',
      'Udayapur'
    ]
  },
  {
    id: 'madhesh',
    name: 'Madhesh Province',
    districts: [
      'Bara',
      'Dhanusha',
      'Mahottari',
      'Parsa',
      'Rautahat',
      'Saptari',
      'Sarlahi',
      'Siraha'
    ]
  },
  {
    id: 'bagmati',
    name: 'Bagmati Province',
    districts: [
      'Bhaktapur',
      'Chitwan',
      'Dhading',
      'Dolakha',
      'Kathmandu',
      'Kavrepalanchok',
      'Lalitpur',
      'Makwanpur',
      'Nuwakot',
      'Ramechhap',
      'Rasuwa',
      'Sindhuli',
      'Sindhupalchok'
    ]
  },
  {
    id: 'gandaki',
    name: 'Gandaki Province',
    districts: [
      'Baglung',
      'Gorkha',
      'Kaski',
      'Lamjung',
      'Manang',
      'Mustang',
      'Myagdi',
      'Nawalpur',
      'Parbat',
      'Syangja',
      'Tanahun'
    ]
  },
  {
    id: 'lumbini',
    name: 'Lumbini Province',
    districts: [
      'Arghakhanchi',
      'Banke',
      'Bardiya',
      'Dang',
      'Gulmi',
      'Kapilvastu',
      'Palpa',
      'Parasi',
      'Pyuthan',
      'Rolpa',
      'Rukum East',
      'Rupandehi'
    ]
  },
  {
    id: 'karnali',
    name: 'Karnali Province',
    districts: [
      'Dailekh',
      'Dolpa',
      'Humla',
      'Jajarkot',
      'Jumla',
      'Kalikot',
      'Mugu',
      'Rukum West',
      'Salyan',
      'Surkhet'
    ]
  },
  {
    id: 'sudurpashchim',
    name: 'Sudurpashchim Province',
    districts: [
      'Achham',
      'Baitadi',
      'Bajhang',
      'Bajura',
      'Dadeldhura',
      'Darchula',
      'Doti',
      'Kailali',
      'Kanchanpur'
    ]
  }
];

export const ALL_DISTRICTS: string[] = NEPAL_PROVINCES.flatMap(p => p.districts);

export function getDistrictsByProvince(provinceName: string): string[] {
  const province = NEPAL_PROVINCES.find(
    p => p.name.toLowerCase() === provinceName.trim().toLowerCase() ||
         p.id.toLowerCase() === provinceName.trim().toLowerCase()
  );
  return province ? province.districts : [];
}

export function isValidNepalDistrict(districtName: string, provinceName?: string): boolean {
  if (!districtName) return false;
  const dTrimmed = districtName.trim().toLowerCase();
  if (provinceName) {
    const districts = getDistrictsByProvince(provinceName);
    return districts.some(d => d.toLowerCase() === dTrimmed);
  }
  return ALL_DISTRICTS.some(d => d.toLowerCase() === dTrimmed);
}

export function isValidNepalProvince(provinceName: string): boolean {
  if (!provinceName) return false;
  const pTrimmed = provinceName.trim().toLowerCase();
  return NEPAL_PROVINCES.some(
    p => p.name.toLowerCase() === pTrimmed || p.id.toLowerCase() === pTrimmed
  );
}
