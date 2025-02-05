export const routes = [
  'pcgo',
  'pcgo_giveaway',
  'pcgo_geschenk',
  'pcgo_leser',
  'pcgo_angebot',
  'pcmagazin',
  'pcmagazin_giveaway',
  'pcmagazin_geschenk',
  'pcmagazin_leser',
  'pcmagazin_angebot',
  'chip',
  'chip_giveaway',
  'chip_geschenk',
  'chip_angebot',
  'hardware_gaming_guide',
  'pc_welt',
  'pc_welt_leser',
  'pc_welt_angebot',
  'pc_welt_giveaway',
  'pc_welt_geschenk',
  'computerbild',
]
export const pages: string[] = []
for (const item of routes) {
  pages.push(`/${item.replace(/_/, '-')}.htm`)
}
