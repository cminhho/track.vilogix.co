export const PRICING_META = {
  id: 'international-express-undated-v1',
  title: 'International Express Delivery',
  currency: 'VND',
  effectiveDate: null,
  status: 'draft',
  vatIncluded: true,
  importDutiesIncluded: true,
  fuelSurchargeIncluded: false,
  volumetricDivisor: 500,
  sourceReceivedAt: '2026-09-23',
  regionalSampleReceivedAt: '2026-09-24',
  globalSampleReceivedAt: '2026-09-24',
} as const

export const SERVICE_TERMS = {
  transitTimeBasis: 'Thời gian toàn trình áp dụng cho hàng gửi từ TP. Hồ Chí Minh.',
  transitTimeExcludes: ['Ngày nhận', 'Ngày nghỉ', 'Thời gian thông quan chậm'],
  remoteAreaAdditionalDays: [2, 3],
  basePriceExcludes: ['Phụ phí xăng dầu', 'Phí phát vùng sâu, vùng xa', 'Phụ phí xử lý hàng đặc thù'],
  specialGoods: ['Mỹ phẩm', 'Thực phẩm', 'Chất bột', 'Chất lỏng', 'Pin', 'Máy tính xách tay', 'Điện thoại', 'Máy ảnh', 'Bản mạch', 'Thẻ nhớ', 'Máy nghe nhạc'],
  specialGoodsNote: 'Cần được tư vấn thủ tục, cách đóng gói và phụ phí hàng đặc thù theo thời điểm gửi và nước đến.',
} as const

export type Zone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type DataStatus = 'verified' | 'review_required' | 'unavailable'

export interface Destination {
  id: string
  name: string
  zone: Zone | null
  status: DataStatus
  note?: string
}

const DESTINATION_SOURCE = `
Afghanistan|11
Albania|11
Algeria|11
American Samoa|11
Andorra|10
Angola|11
Anguilla|11
Antigua And Barbuda|11
Argentina|11
Armenia|11
Aruba|11
Australia|5
Austria|7
Azerbaijan|11
Bahamas|11
Bahrain|10
Bangladesh|10
Barbados|11
Belarus|11
Belgium|6
Belize|11
Benin|11
Bermuda|11
Bhutan|11
Bolivia|11
Bonaire|11
Bosnia and Herzegovina|11
Botswana|11
Brazil|11
Brunei Darussalam|4
Bulgaria|8
Burkina Faso|11
Burundi|11
Cambodia|1
Cameroon|11
Canada|9
Canary Islands, The|
Cape Verde|11
Cayman Islands|11
Central African Republic|11
Chad|11
Chile|11
China, People’s Republic|3
Colombia|11
Comoros|
Congo|11
Congo, Democratic Rep. of|
Cook Islands|11
Costa Rica|11
Cote d’Ivoire|11
Croatia|11
Cuba|11
Curacao|11
Cyprus|11
Czech Republic, The|8
Denmark|7
Djibouti|
Dominica|11
Dominican Republic|11
Ecuador|11
Egypt|10
El Salvador|11
Eritrea|11
Estonia|11
Ethiopia|11
Falkland Islands|
Faroe Islands|11
Fiji|5
Finland|7
France|6
French Guyana|11
Gabon|11
Gambia|11
Georgia|11
Germany|6
Ghana|11
Gibraltar|11
Greece|8
Greenland|11
Grenada|11
Guadeloupe|11
Guam|11
Guatemala|11
Guernsey|
Guinea Republic|
Guinea-Bissau|11
Guinea-Equatorial|
Guyana (British)|11
Haiti|11
Honduras|11
Hong Kong|1
Hungary|8
Iceland|10
India|4
Indonesia|3
Iran, Islamic Rep. of|10
Iraq|10
Ireland, Rep. of|7
Israel|10
Italy|6
Jamaica|11
Japan|3
Jersey|
Jordan|10
Kazakhstan|11
Kenya|11
Kiribati|11
Korea, D.P.R. of (North)|
Korea, Rep. of (South)|3
Kosovo|11
Kuwait|10
Kyrgyzstan|11
Lao P.D.R.|4
Latvia|11
Lebanon|10
Lesotho|11
Liberia|11
Libya|11
Liechtenstein|10
Lithuania|8
Luxembourg|7
Macau|4
Macedonia, Rep. of|11
Madagascar|11
Malawi|11
Malaysia|2
Maldives|10
Mali|11
Malta|11
Marshall Islands|11
Martinique|11
Mauritania|11
Mauritius|11
Mayotte|11
Mexico|9
Micronesia, Fed. States of|11
Moldova, Rep. of|11
Monaco|11
Mongolia|11
Montenegro, Rep. of|11
Montserrat|11
Morocco|11
Mozambique|11
Myanmar|11
Namibia|11
Nauru, Rep. of|11
Nepal|10
Netherlands, The|6
Nevis|
New Caledonia|11
New Zealand|5
Nicaragua|11
Niger|11
Nigeria|11
Niue|
Northern Mariana Islands|11
Norway|8
Oman|10
Pakistan|10
Palau|10
Panama|11
Papua New Guinea|11
Paraguay|11
Peru|11
Philippines, The|3
Poland|8
Portugal|7
Puerto Rico|11
Qatar|10
Reunion, Island of|11
Romania|8
Russian Federation, The|8
Rwanda|11
Samoa|11
San Marino|11
Sao Tome & Principe|11
Saudi Arabia|10
Senegal|11
Serbia, Rep. of|11
Seychelles|11
Sierra Leone|11
Singapore|1
Slovakia|10
Slovenia|8
Solomon Islands|11
Somalia|11
Somaliland, Rep. of (N Somalia)|11
South Africa|10
South Sudan|11
Spain|7
Sri Lanka|10
Sudan|11
Suriname|11
Swaziland|11
Sweden|7
Switzerland|7
Syria|10
Tahiti|
Taiwan|2
Tajikistan|11
Tanzania|11
Thailand|1
Timor-Leste|11
Togo|11
Tonga|11
Trinidad and Tobago|11
Tunisia|11
Turkey|8
Turkmenistan NEW|
Turks and Caicos Islands|11
Tuvalu|11
Uganda|11
Ukraine|11
United Arab Emirates|10
United Kingdom|6
United States of America|9
Uruguay|11
Uzbekistan|11
Vanuatu|11
Vatican City|
Venezuela|11
Yemen, Rep. of|11
Zambia|11
Zimbabwe|1
`

const destinationId = (name: string) => name
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

const DESTINATION_NOTES: Record<string, string> = {
  'china-people-s-republic': 'Nguồn liệt kê China ở Zone 3. Phân nhóm China North/South được lưu làm ghi chú vì không có zone hoặc mức giá thay thế.',
  zimbabwe: 'Nguồn ghi Zone 1; cần xác minh trước khi báo giá.',
}

export const DESTINATIONS: Destination[] = DESTINATION_SOURCE.trim().split('\n').map((line) => {
  const [name, rawZone] = line.split('|')
  const id = destinationId(name)
  const zone = rawZone ? Number(rawZone) as Zone : null
  const status: DataStatus = zone === null ? 'unavailable' : id === 'zimbabwe' ? 'review_required' : 'verified'
  return { id, name, zone, status, note: DESTINATION_NOTES[id] }
}).sort((a, b) => a.name.localeCompare(b.name, 'en'))

export const CHINA_REGION_NOTE = {
  south: ['Guangdong', 'Jiang Su', 'An Hui', 'Hu Nam', 'Hu Bei', 'Si Chuan', 'Yun Nan', 'Gui Zhow', 'Guang Xi', 'Fu Jian', 'Jiang Xi', 'Zhe Jiang', 'Hai Nam', 'Chong Qing', 'Shang Hai'],
  north: 'Phần còn lại của Trung Quốc không thuộc danh sách China South.',
} as const

export type CargoType = 'document' | 'goods'
export type PricingModel = 'fixed' | 'per_kg'

export interface RateBand {
  cargoType: CargoType
  pricingModel: PricingModel
  minWeightKg: number
  maxWeightKg: number | null
  prices: ReadonlyArray<number | null>
}

export const REGIONAL_RATE_COLUMNS = ['malaysia', 'thailand-cambodia', 'south-korea', 'china', 'india'] as const
export type RegionalRateColumn = (typeof REGIONAL_RATE_COLUMNS)[number]

export interface RegionalFixedRateRow {
  maxWeightKg: number
  prices: ReadonlyArray<number>
}

export interface RegionalPerKgRateRow {
  minWeightKg: number
  maxWeightKg: number | null
  prices: ReadonlyArray<number>
}

export const REGIONAL_FIXED_RATE_ROWS: RegionalFixedRateRow[] = [
  { maxWeightKg: 1, prices: [588560, 1143000, 498332, 455000, 620869] },
  { maxWeightKg: 1.5, prices: [669630, 1148000, 724138, 585000, 1241739] },
  { maxWeightKg: 2, prices: [750700, 1153000, 734138, 780000, 1241739] },
  { maxWeightKg: 2.5, prices: [831770, 1158000, 828680, 975000, 1862608] },
  { maxWeightKg: 3, prices: [884412, 1163000, 838680, 1170000, 1862608] },
  { maxWeightKg: 3.5, prices: [951268, 1322500, 982168, 1365000, 2204019] },
  { maxWeightKg: 4, prices: [1018124, 1327500, 992168, 1560000, 2204019] },
  { maxWeightKg: 4.5, prices: [1084980, 1487000, 1135656, 1755000, 2755024] },
  { maxWeightKg: 5, prices: [1151836, 1492000, 1145656, 1950000, 2755024] },
  { maxWeightKg: 5.5, prices: [1218692, 1651500, 1289144, 2145000, 3096435] },
  { maxWeightKg: 6, prices: [1285548, 1656500, 1299144, 2340000, 3096435] },
  { maxWeightKg: 6.5, prices: [1352404, 1816000, 1442632, 2535000, 3612507] },
  { maxWeightKg: 7, prices: [1419260, 1821000, 1452632, 2730000, 3612507] },
  { maxWeightKg: 7.5, prices: [1486116, 1980500, 1596120, 2990000, 4128580] },
  { maxWeightKg: 8, prices: [1552972, 1985500, 1606120, 3120000, 4128580] },
  { maxWeightKg: 8.5, prices: [1619828, 2145000, 1749608, 3315000, 4644652] },
  { maxWeightKg: 9, prices: [1686684, 2150000, 1759608, 3510000, 4644652] },
  { maxWeightKg: 9.5, prices: [1753540, 2309500, 1903096, 3705000, 5160725] },
  { maxWeightKg: 10, prices: [1820396, 2314500, 1913096, 3900000, 5160725] },
  { maxWeightKg: 10.5, prices: [1887252, 2474000, 2056584, 4095000, 5292542] },
  { maxWeightKg: 11, prices: [1954108, 2479000, 2066584, 4160000, 5292542] },
  { maxWeightKg: 11.5, prices: [2020964, 2638500, 2210072, 4225000, 5773682] },
  { maxWeightKg: 12, prices: [2087820, 2643500, 2220072, 4290000, 5773682] },
  { maxWeightKg: 12.5, prices: [2154676, 2803000, 2363560, 4420000, 6254822] },
  { maxWeightKg: 13, prices: [2221532, 2808000, 2373560, 4550000, 6254822] },
  { maxWeightKg: 13.5, prices: [2288388, 2967500, 2517048, 4745000, 6735963] },
  { maxWeightKg: 14, prices: [2355244, 2972500, 2527048, 4940000, 6735963] },
  { maxWeightKg: 14.5, prices: [2422100, 3132000, 2670536, 5135000, 7217103] },
  { maxWeightKg: 15, prices: [2488956, 3137000, 2680536, 5330000, 7217103] },
  { maxWeightKg: 15.5, prices: [2555812, 3296500, 2824024, 5460000, 7698243] },
  { maxWeightKg: 16, prices: [2622668, 3301500, 2834024, 5655000, 7698243] },
  { maxWeightKg: 16.5, prices: [2689524, 3461000, 2977512, 5850000, 8179383] },
  { maxWeightKg: 17, prices: [2756380, 3466000, 2987512, 5980000, 8179383] },
  { maxWeightKg: 17.5, prices: [2823236, 3625500, 3131000, 6175000, 8660523] },
  { maxWeightKg: 18, prices: [2890092, 3630500, 3141000, 6370000, 8660523] },
  { maxWeightKg: 18.5, prices: [2956948, 3790000, 3284488, 6500000, 9141663] },
  { maxWeightKg: 19, prices: [3023804, 3795000, 3294488, 6695000, 9141663] },
  { maxWeightKg: 19.5, prices: [3090660, 3954500, 3437976, 6890000, 9622804] },
  { maxWeightKg: 20, prices: [3157516, 3959500, 3447976, 7020000, 9622804] },
]

export const REGIONAL_PER_KG_RATE_ROWS: RegionalPerKgRateRow[] = [
  { minWeightKg: 21, maxWeightKg: 44, prices: [153900, 164500, 170174, 325000, 418600] },
  { minWeightKg: 45, maxWeightKg: 99, prices: [148750, 143900, 164612, 312000, 387400] },
  { minWeightKg: 100, maxWeightKg: null, prices: [138450, 133600, 159050, 309400, 364000] },
]

export const DESTINATION_RATE_OVERRIDES: Record<string, {
  column: RegionalRateColumn
  transitTime: string
}> = {
  malaysia: { column: 'malaysia', transitTime: '8–10 ngày' },
  thailand: { column: 'thailand-cambodia', transitTime: '7–10 ngày' },
  cambodia: { column: 'thailand-cambodia', transitTime: '7–10 ngày' },
  'korea-rep-of-south': { column: 'south-korea', transitTime: '6–8 ngày' },
  'china-people-s-republic': { column: 'china', transitTime: '5–7 ngày' },
  india: { column: 'india', transitTime: '7–10 ngày' },
}

const band = (
  cargoType: CargoType,
  pricingModel: PricingModel,
  minWeightKg: number,
  maxWeightKg: number | null,
  prices: ReadonlyArray<number | null>,
): RateBand => ({ cargoType, pricingModel, minWeightKg, maxWeightKg, prices })

export const RATE_BANDS: RateBand[] = [
  band('document', 'fixed', 0, 0.5, [264000,264000,336000,539000,553000,580000,630000,638000,758000,716000,970000]),
  band('document', 'fixed', 0.5, 1, [344000,344000,452000,648000,667000,722000,785000,795000,955000,892000,1172000]),
  band('document', 'fixed', 1, 1.5, [500000,500000,629000,758000,782000,865000,939000,952000,1142000,1068000,1374000]),
  band('document', 'fixed', 1.5, 2, [589000,589000,778000,867000,896000,1008000,1097000,1109000,1329000,1245000,1576000]),
  band('goods', 'fixed', 0, 0.5, [295000,295000,554000,635000,642000,648000,720000,789000,865000,870000,1055000]),
  band('goods', 'fixed', 0.5, 1, [388000,388000,645000,737000,753000,798000,884000,961000,1031000,1045000,1272000]),
  band('goods', 'fixed', 1, 1.5, [564000,564000,735000,837000,860000,937000,1038000,1127000,1195000,1215000,1487000]),
  band('goods', 'fixed', 1.5, 2, [612000,612000,826000,937000,967000,1075000,1192000,1294000,1358000,1385000,1703000]),
  band('goods', 'fixed', 2, 2.5, [745000,745000,916000,1037000,1074000,1214000,1346000,1460000,1521000,1556000,1918000]),
  band('goods', 'fixed', 2.5, 3, [793000,755000,1003000,1136000,1180000,1337000,1483000,1624000,1666000,1725000,2122000]),
  band('goods', 'fixed', 3, 3.5, [846000,783000,1073000,1236000,1286000,1460000,1621000,1788000,1811000,1894000,2326000]),
  band('goods', 'fixed', 3.5, 4, [900000,844000,1158000,1335000,1392000,1583000,1758000,1951000,1956000,2064000,2530000]),
  band('goods', 'fixed', 4, 4.5, [953000,923000,1243000,1435000,1498000,1707000,1896000,2115000,2101000,2233000,2733000]),
  band('goods', 'fixed', 4.5, 5, [1006000,986000,1327000,1535000,1603000,1830000,2033000,2279000,2246000,2402000,2937000]),
  band('goods', 'fixed', 5, 5.5, [1054000,1177000,1408000,1634000,1712000,1940000,2153000,2425000,2388000,2564000,3130000]),
  band('goods', 'fixed', 5.5, 6, [1101000,1247000,1490000,1733000,1821000,2050000,2272000,2572000,2529000,2725000,3322000]),
  band('goods', 'fixed', 6, 6.5, [1149000,1305000,1570000,1832000,1930000,2161000,2392000,2718000,2670000,2886000,3515000]),
  band('goods', 'fixed', 6.5, 7, [1197000,1360000,1651000,1931000,2039000,2271000,2511000,2865000,2812000,3047000,3708000]),
  band('goods', 'fixed', 7, 7.5, [1245000,1415000,1732000,2030000,2148000,2382000,2631000,3012000,2953000,3208000,3900000]),
  band('goods', 'fixed', 7.5, 8, [1292000,1470000,1813000,2129000,2257000,2492000,2750000,3158000,3094000,3369000,4093000]),
  band('goods', 'fixed', 8, 8.5, [1340000,1525000,1894000,2228000,2366000,2602000,2869000,3305000,3235000,3530000,4286000]),
  band('goods', 'fixed', 8.5, 9, [1388000,1579000,1975000,2327000,2475000,2713000,2989000,3451000,3377000,3692000,4478000]),
  band('goods', 'fixed', 9, 9.5, [1436000,1634000,2056000,2426000,2584000,2823000,3108000,3598000,3518000,3853000,4671000]),
  band('goods', 'fixed', 9.5, 10, [1483000,1689000,2137000,2525000,2693000,2933000,3228000,3744000,3659000,4014000,4863000]),
  band('goods', 'fixed', 10, 10.5, [1512000,1748000,2185000,2620000,2763000,2998000,3321000,3866000,3771000,4119000,5010000]),
  band('goods', 'fixed', 10.5, 11, [1541000,1808000,2232000,2714000,2832000,3062000,3414000,3988000,3883000,4225000,5156000]),
  band('goods', 'fixed', 11, 11.5, [1570000,1867000,2280000,2809000,2902000,3126000,3508000,4110000,3995000,4330000,5303000]),
  band('goods', 'fixed', 11.5, 12, [1598000,1926000,2327000,2903000,2972000,3190000,3601000,4231000,4107000,null,5449000]),
  band('goods', 'fixed', 12, 12.5, [1627000,1985000,2375000,2998000,3042000,3254000,3695000,4353000,4219000,4541000,5595000]),
  band('goods', 'fixed', 12.5, 13, [1656000,2045000,2423000,3092000,3112000,3319000,3788000,4475000,4331000,4646000,5742000]),
  band('goods', 'fixed', 13, 13.5, [1684000,2104000,2471000,3187000,3181000,3383000,3881000,4596000,4443000,4751000,5888000]),
  band('goods', 'fixed', 13.5, 14, [1713000,2163000,2518000,3282000,3251000,3447000,3975000,4718000,4554000,null,6035000]),
  band('goods', 'fixed', 14, 14.5, [1742000,2222000,2566000,3376000,3321000,3511000,4068000,4840000,4666000,4962000,6181000]),
  band('goods', 'fixed', 14.5, 15, [1770000,2282000,2614000,3471000,3391000,3575000,4161000,4961000,4778000,5068000,6328000]),
  band('goods', 'fixed', 15, 15.5, [1799000,2341000,2661000,3523000,3446000,3639000,4234000,5073000,4880000,5171000,6467000]),
  band('goods', 'fixed', 15.5, 16, [1828000,2400000,2709000,3576000,3501000,3704000,4307000,5185000,4982000,5275000,6606000]),
  band('goods', 'fixed', 16, 16.5, [1856000,2459000,2756000,3628000,3556000,3768000,4380000,5297000,5084000,5379000,6745000]),
  band('goods', 'fixed', 16.5, 17, [1885000,2518000,2804000,3681000,3610000,3832000,4453000,5409000,5186000,5482000,6884000]),
  band('goods', 'fixed', 17, 17.5, [1914000,2578000,2852000,3733000,3665000,3896000,4526000,5521000,5288000,5586000,7023000]),
  band('goods', 'fixed', 17.5, 18, [1942000,2637000,2899000,3786000,3720000,3960000,4599000,5633000,5390000,5690000,7162000]),
  band('goods', 'fixed', 18, 18.5, [1971000,2696000,2947000,3838000,3775000,4025000,4672000,5745000,5492000,5793000,7302000]),
  band('goods', 'fixed', 18.5, 19, [2000000,2755000,2995000,3891000,3830000,4089000,4745000,5857000,5594000,5897000,7441000]),
  band('goods', 'fixed', 19, 19.5, [2028000,2815000,3042000,3943000,3885000,4153000,4818000,5969000,5696000,6001000,7580000]),
  band('goods', 'fixed', 19.5, 20, [2057000,2874000,3090000,3996000,3940000,4217000,4891000,6081000,5798000,6105000,7719000]),
  band('goods', 'per_kg', 20, 30, [97000,136000,151000,195000,192000,208000,239000,null,284000,300000,380000]),
  band('goods', 'per_kg', 30, 44, [92800,133000,141400,180200,175900,203000,224700,291000,254800,289700,371000]),
  band('goods', 'per_kg', 44, 69, [77000,104000,127000,137000,143000,175000,194000,253000,217000,265000,344000]),
  band('goods', 'per_kg', 69, 99, [73000,104000,119000,135000,143000,160000,184000,218000,187000,231000,309000]),
  band('goods', 'per_kg', 99, 249, [73000,104000,119000,135000,143000,160000,184000,218000,187000,231000,309000]),
  band('goods', 'per_kg', 249, null, [72000,91000,118000,126000,135000,159000,183000,217000,186000,231000,308000]),
]

export const TRANSIT_TIMES: Record<CargoType, ReadonlyArray<string>> = {
  document: ['1–2 ngày','2–3 ngày','2–3 ngày','3–4 ngày','3–4 ngày','2–3 ngày','2–3 ngày','2–3 ngày','3–4 ngày','4–6 ngày','5–7 ngày'],
  goods: ['2–3 ngày','2–3 ngày','3–4 ngày','3–4 ngày','4–5 ngày','2–3 ngày','3–4 ngày','4–5 ngày','3–5 ngày','4–7 ngày','5–8 ngày'],
}

export interface Surcharge {
  id: string
  name: string
  amountVnd: number | null
  unit: string
  status: DataStatus
  note?: string
  includedInBasePrice?: boolean
}

export const SURCHARGES: Surcharge[] = [
  { id: 'tax-advancement', name: 'Nộp hộ thuế và lệ phí tại nước nhập', amountVnd: 525000, unit: 'lô hàng', status: 'verified', includedInBasePrice: true, note: 'Đã nằm trong nguồn cước express; không cộng riêng vào giá khách.' },
  { id: 'remote-area', name: 'Phụ phí vùng xa', amountVnd: 500000, unit: 'bưu phẩm', status: 'review_required', note: 'Nguồn kèm “Từ 50kg × 8.400 VNĐ” nhưng chưa rõ công thức.' },
  { id: 'overweight', name: 'Phụ phí hàng quá tải trọng', amountVnd: 980000, unit: 'bưu phẩm', status: 'review_required', note: 'Chưa có ngưỡng quá tải trọng.' },
  { id: 'oversize', name: 'Phụ phí hàng ngoại cỡ', amountVnd: 1960000, unit: 'lô hàng', status: 'review_required', note: 'Chưa có ngưỡng ngoại cỡ.' },
  { id: 'wrong-address', name: 'Phí sai địa chỉ', amountVnd: 300000, unit: 'bưu phẩm', status: 'verified' },
  { id: 'high-risk', name: 'Phí rủi ro cao', amountVnd: null, unit: 'bưu phẩm', status: 'unavailable', note: 'Nguồn không cung cấp mức phí.' },
  { id: 'difficult-goods', name: 'Phụ phí hàng khó vận chuyển', amountVnd: 980000, unit: 'bưu phẩm', status: 'verified' },
  { id: 'dangerous-goods', name: 'Phụ phí hàng hóa nguy hiểm', amountVnd: 800000, unit: 'bưu phẩm', status: 'verified' },
  { id: 'address-correction', name: 'Phụ phí hiệu chỉnh địa chỉ phát', amountVnd: 300000, unit: 'bưu phẩm', status: 'verified' },
  { id: 'storage', name: 'Phụ phí lưu kho', amountVnd: 150000, unit: 'ngày', status: 'verified' },
]

export const RATE_REVIEW_NOTES = [
  { cargoType: 'goods', minWeightKg: 11.5, maxWeightKg: 12, zone: 10, rawValue: '4.353.000', note: 'Bước tăng giá lệch khỏi chuỗi lân cận; cần xác minh.' },
  { cargoType: 'goods', minWeightKg: 13.5, maxWeightKg: 14, zone: 10, rawValue: '4.857.00', note: 'Giá trị nguồn sai định dạng.' },
  { cargoType: 'goods', minWeightKg: 20, maxWeightKg: 30, zone: 8, rawValue: '3000.000', note: 'Đơn giá/kg cao bất thường; có thể là 300.000.' },
] as const
