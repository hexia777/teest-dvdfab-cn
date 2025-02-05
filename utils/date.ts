// 日期转换  2024-05-14 => May 14, 2024
export const transformDate = (date: string, lang: string): string => {
  const inputDate = new Date(date)
  if (inputDate.toString() === 'Invalid Date') {
    return ''
  }
  // en,
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (lang === 'de') {
    months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ]
  } else if (lang === 'fr') {
    months = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ]
  } else if (lang === 'zh') {
    months = []
    for (let i = 1; i <= 12; i++) {
      months.push(i.toString())
    }
  }
  const day = inputDate.getDate() || ''
  const dayWithZero = ('0' + day).slice(-2)
  const month = months[inputDate.getMonth()] || ''
  const year = inputDate.getFullYear() || ''
  return lang === 'de'
    ? `${day}. ${month} ${year}`
    : lang === 'fr'
    ? `${day} ${month} ${year}`
    : lang === 'zh'
    ? `${month}/${dayWithZero}/${year}`
    : `${month} ${day}, ${year}`
}
