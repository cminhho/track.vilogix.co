import { DESTINATIONS } from './data/pricing'
import type { CargoType } from './lib/rates'

export { DESTINATIONS }

export const DESTINATION_SEARCH_ALIASES: Record<string, string[]> = {
  'united-states-of-america': ['Mỹ', 'Hoa Kỳ', 'USA', 'US'],
  australia: ['Úc'],
  'united-kingdom': ['Anh', 'Vương quốc Anh', 'UK'],
  'china-people-s-republic': ['Trung Quốc', 'China'],
  'korea-rep-of-south': ['Hàn Quốc', 'Nam Hàn', 'South Korea'],
  'korea-d-p-r-of-north': ['Triều Tiên', 'Bắc Triều Tiên', 'North Korea'],
  japan: ['Nhật Bản'],
  canada: ['Ca-na-đa'],
  germany: ['Đức'],
  france: ['Pháp'],
  italy: ['Ý'],
  spain: ['Tây Ban Nha'],
  'netherlands-the': ['Hà Lan'],
  switzerland: ['Thụy Sĩ'],
  sweden: ['Thụy Điển'],
  norway: ['Na Uy'],
  denmark: ['Đan Mạch'],
  finland: ['Phần Lan'],
  belgium: ['Bỉ'],
  austria: ['Áo'],
  'ireland-rep-of': ['Ireland', 'Ai-len'],
  'united-arab-emirates': ['UAE', 'Các Tiểu vương quốc Ả Rập Thống nhất'],
  singapore: ['Xin-ga-po'],
  malaysia: ['Ma-lai-xi-a'],
  thailand: ['Thái Lan'],
  cambodia: ['Campuchia', 'Cam-pu-chia'],
  'lao-p-d-r': ['Lào'],
  indonesia: ['In-đô-nê-xi-a'],
  'philippines-the': ['Philippines', 'Phi-líp-pin'],
  india: ['Ấn Độ'],
  'new-zealand': ['New Zealand', 'Niu Di-lân'],
  taiwan: ['Đài Loan'],
  'hong-kong': ['Hồng Kông'],
  macau: ['Ma Cao'],
  'south-africa': ['Nam Phi'],
  'russian-federation-the': ['Nga', 'Liên bang Nga'],
}

export const CARGO_TYPES: Array<{ value: CargoType; label: string }> = [
  { value: 'goods', label: 'Goods' },
  { value: 'document', label: 'Documents' },
]

export const labelFor = <T extends string>(items: Array<{ value: T; label: string }>, value: T) =>
  items.find((item) => item.value === value)?.label ?? value
