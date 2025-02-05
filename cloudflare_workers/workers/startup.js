//-----------------------------------------用于本地开发的启动代码---------------------------------------
const globalThis = require("./env")
const DVDFAB_KV = require("./workers_kv")

function addEventListener(method, callback) {
  const headers = {
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'max-age=0',
    'Cookie': '_EA_GUID=134dae57-90b1e413-58e393b68da4f631; _EA_FID=6029821191ca0081b53398622191d9ad; _gcl_au=1.1.1412646710.1732519044; _EA_WID=c2Vydm9fdXMuMTczMjUxOTA0My41ZTQxNWUyMC45MDAx; _FP_VD=791f0ec74ff7d45fc647308a0fcf619c; __stripe_mid=e7a423ce-86ef-4485-980b-37f8c53babd28763d7; g_state={"i_l":0}; elk_user_email=xiezhuangping@gmail.com; _EA_TID=1685356194_uwz8L25Faq8c; close_resource=close; resource_inquiry_starttime=1733113318930; _ga_J41B5VY1SE=GS1.1.1733113233.1.1.1733113320.0.0.0; _T_EA_TID=1733369548_vYPvrmnfpRnZ; _T_EA_WID=c2Vydm9fdGVzdC4xNzMzMzY5NTQ4LjVlNDE1ZTIwLjg5Mzg%3D; _YY_V3_TID_1685356194_uwz8L25Faq8c=1685356194_uwz8L25Faq8c; is_online_user=true; country_info_name=Hong Kong; country_info_code=HK; referer=https://cn.bing.com/; elk_mac=7c-8a-e1-a6-9e-b2%3Aa8-93-4a-70-b0-f9; ad=playerfab_client_promotion_try_exit; _gid=GA1.2.310499933.1733709307; hasCurrentLFT=0; user_portrait={"dfAllW":0,"dfAllM":0,"dfW":0,"dfM":0,"dfAio":0,"sfAio":0,"pfAio":0,"hP":0,"isDfPW":0,"isDfPM":0}; recommend_dvdfab=1; serve_api=https://servo-slave-ja.dvdfab.cn; _ga_WQ0QLD8KS7=GS1.1.1733804740.3.1.1733804747.0.0.0; _ga_CRJD2WYD2G=GS1.1.1733804758.6.0.1733804763.0.0.0; change_lang=1; _ET_AF=eyJsYW5kaW5nIjp7InVybCI6eyJmdWxsIjoiaHR0cHMlM0ElMkYlMkZ3d3cuZHZkZmFiLmNuJTJGJTNGdHJhY2tpZCUzRGRlZmF1bHQtZHZkLWNvcHklMkNoZWFkbWVudTIlMjZfY3V0XyUzRE1UY3pNelUyTkRJek9WOUVhR3RwY25CNVpFSnNkRzAlM0QlMjZfY3VzXyUzRFRWUmplazE2WjNkT1JHTXhUVVk0ZDAweE9XdGtiVkp0V1ZkS1ptSXpTbTVZZW1oRVlqSk9WbGxzWkdsU1NFazklMjZfY3NyY18lM0RleUp5Y2lJNkltaDBkSEJ6T2k4dlpIWmtabUZpTG05eVp5OWtkbVF0WTI5d2VTNW9kRzBpZlElM0QlM0QifX0sInJlZmVyZXIiOnsidXJsIjp7ImZ1bGwiOiJodHRwcyUzQSUyRiUyRmR2ZGZhYi5vcmclMkYifX0sInRpbWUiOnsiY3VycmVudCI6IjIwMjQtMTItMTBUMDQ6MjY6MDguMjE0WiJ9fQ==; _ga_TMQEL44HTJ=GS1.1.1733823932.36.0.1733823932.60.0.0; _ga=GA1.1.8080276.1732519044; _ga_NMPGKRWJB0=GS1.1.1733823932.36.0.1733823932.60.0.0; _EA_DID=80e10d80-b6db-11ef-b581-0242c0a8a808; _EA_SID=MTczMzgyMzkzNF8wM19kdmRmYWJfY25fcjBuSGJYY2t5ZA%3D%3D; _EA_VT_TS=1733823934; _uetsid=9da07bb0b5d011ef840be147b802f7cf; _uetvid=cb1a79b092ae11ef82763bf11a61df7c',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  }  
  // const request = new Request('https://www.dvdfab.cn/-cloudflare-worker/list-module-version', {headers})
  // const request = new Request('https://www.dvdfab.cn/resource/?trackId=nav&_original=1', {headers})
  const request = new Request('https://www.dvdfab.cn/resource/?trackId=nav', {headers})
  request.cf = {
    colo: 'HKG',
    city: 'HK',
    country: 'China',
  }

  const event = new Event(request)
  event.request = request
  event.passThroughOnException = () => {}
  event.respondWith = async (response) => {
    const result = await response
    console.log(result.status)
  }

  callback(event)
}
