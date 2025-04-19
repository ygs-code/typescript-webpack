HA = JSON.parse('
    {
        "MineProduction": [
            { "code": "ca", "value": 191.86598334796 },
            { "code": "us", "value": 166.7 },
            { "code": "mx", "value": 126.6075 },
            { "code": "pe", "value": 128.814289289126 },
            { "code": "br", "value": 86.3046932992932 },
            { "code": "co", "value": 67.39 },
            { "code": "bo", "value": 48.4327996256281 },
            { "code": "ar", "value": 39.1014964218203 },
            { "code": "cl", "value": 35.358 },
            { "code": "ve", "value": 30 },
            { "code": "sr", "value": 26.8134634610399 },
            { "code": "ec", "value": 23.0892944925976 },
            { "code": "do", "value": 17.5660262555942 },
            { "code": "gy", "value": 17.4025073435308 },
            { "code": "bg", "value": 9.70894615932271 },
            { "code": "fi", "value": 8.96049164891877 },
            { "code": "se", "value": 6.67556098588592 },
            { "code": "gh", "value": 135.112613238312 },
            { "code": "ml", "value": 105.02450142216 },
            { "code": "bf", "value": 98.5800581382349 },
            { "code": "za", "value": 104.2884 },
            { "code": "sd", "value": 72.4564842863527 },
            { "code": "gn", "value": 64.9044334905389 },
            { "code": "tz", "value": 51.9693026727156 },
            { "code": "zw", "value": 46.6462944 },
            { "code": "ci", "value": 51.4883914646213 },
            { "code": "cd", "value": 45.3838697278169 },
            { "code": "ne", "value": 33.4465525 },
            { "code": "lr", "value": 19.8762196939818 },
            { "code": "sn", "value": 17.1142112110179 },
            { "code": "mr", "value": 21.7742373966731 },
            { "code": "mg", "value": 15.902875 },
            { "code": "ru", "value": 321.75 },
            { "code": "uz", "value": 119.644918 },
            { "code": "kz", "value": 86.2686990517805 },
            { "code": "kg", "value": 25.5199781025455 },
            { "code": "cn", "value": 378.155 },
            { "code": "id", "value": 132.473074910019 },
            { "code": "ph", "value": 40.79 },
            { "code": "tr", "value": 36.45880923 },
            { "code": "mn", "value": 14.85538 },
            { "code": "la", "value": 8.81437293455386 },
            { "code": "au", "value": 293.843028368754 },
            { "code": "pg", "value": 41.3061966953239 },
            { "code": "nz", "value": 6.14467096052232 }
        ]
    }'), UA = () => { const t = P(), { t: n } = Zi(); return e.useEffect((() => { t(os(HA)) }), []), e.createElement(Cf, { direction: Ef.VERTICAL, space: "2-5", className: "homepage" }, e.createElement(cu, { regions: R }), e.createElement(Af, { regions: R }), e.createElement(Us, null), e.createElement(VA, null), e.createElement("div", { className: "homepage__source" }, e.createElement("div", null, "Source: Metals Focus; World Gold Council"), e.createElement("div", null, `\n\t\t\t\t${n("Data as of")} \n\t\t\t\t${((e, t, n, r) => { switch (M()) { case L.ENGLISH: return j()("2023-12-31").format("D MMMM, YYYY"); case L.CHINESE: return ((e, t, n, r) => `2023${r("year")}12${r("month")}31${r("day")}`)(0, 0, 0, r); default: return j()("2023-12-31").format("D MMMM, YYYY") } })(0, 0, 0, n)}`))) }, $A = JSON.parse('{ "UU": "wgc-global-mine-app", "rE": "1.4.3" }'), WA = () => { const [t, n] = e.useState(void 0), r = { [L.ENGLISH]: Al, [L.CHINESE]: El }, o = e.useMemo((() => ({ chartRef: t, setChartRef: n })), [t, n]); return e.createElement(e.Fragment, null, e.createElement(rr, { appName: "Gold Mine Production Map" }, e.createElement(ha, { lang: M() }, e.createElement(A, { store: cs }, e.createElement(rl, { lang: M(), additionalTranslations: r }, e.createElement(N.Provider, { value: o }, e.createElement(al.v, { theme: "gold-org-v2" }, e.createElement(il.B, { palette: ll.e.BLUE }, e.createElement(UA, null))))))), e.createElement(wl, { name: $A.UU, version: $A.rE }))) }, GA = Boolean(null === window || void 0 === window ? void 0 : window.drupalSettings); GA || (window.FS_ChartEmbed.prototype = { build_chart() { var e, t; const n = null !== (t = null === (e = this.settings) || void 0 === e ? void 0 : e.chart_id) && void 0 !== t ? t : "wgc-container-chart"; a(WA, document.getElementById(n)) } }), GA && (window.FsAppObject.prototype.buildApp = function () { var e, t; const n = null !== (t = null === (e = this.settings) || void 0 === e ? void 0 : e.AppEmbedId) && void 0 !== t ? t : "wgc-container-chart"; a(WA, document.getElementById(n)) })}) ()}) ();




El = JSON.parse('{"Africa":"非洲","Albania":"阿尔巴尼亚","Algeria":"阿尔及利亚","All Regions":"所有地区","Argentina":"阿根廷","Asia":"亚洲","Australia":"澳大利亚","Bolivia":"玻利维亚","Brazil":"巴西","Bulgaria":"保加利亚","Burkina Faso":"布基纳法索","Cambodia":"柬埔寨","Cameroon":"喀麦隆","Canada":"加拿大","Chile":"智利","Colombia":"哥伦比亚","Côte d\'Ivoire":"科特迪瓦","Country":"国家","Central & South America":"中美和南美","CIS":"独联体国家","Dem. Rep. of the Congo":"刚果民主共和国","Democratic Republic of the Congo":"刚果民主共和国","Dominican Republic":"多米尼加共和国","Ecuador":"厄瓜多尔","Europe":"欧洲","Finland":"芬兰","Ghana":"加纳","Guinea":"几内亚","Guyana":"圭亚那","Indonesia":"印尼","Ivory Coast":"科特迪瓦","Kazakhstan":"哈萨克斯坦","Kyrgyzstan":"吉尔吉斯斯坦","Kyrgyz Republic":"吉尔吉斯共和国","Laos":"老挝","Liberia":"利比里亚","Madagascar":"马达加斯加","Mali":"马里","Mauritania":"毛里塔尼亚","Mexico":"墨西哥","Mine production":"金矿生产","Mongolia":"蒙古","New Zealand":"新西兰","Niger":"尼日尔","North America":"北美","Oceania":"大洋洲","Papua New Guinea":"巴布亚新几内亚","Peru":"秘鲁","Philippines":"菲律宾","Russia":"俄罗斯","Russian Federation":"俄罗斯","Senegal":"塞内加尔","South Africa":"南非","Sudan":"苏丹","Suriname":"苏里南","Sweden":"瑞典","Tanzania":"坦桑尼亚","Turkey":"土耳其","United Republic of Tanzania":"坦桑尼亚","United States":"美国","United States of America":"美国","Uzbekistan":"乌兹别克斯坦","Venezuela":"委内瑞拉","Zimbabwe":"津巴布韦"}');
function Cl(e) {



    const _ = {
        ar: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Argentina",
            country_zh: "阿根廷",
            country_code: "ar"
        },
        bo: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Bolivia",
            country_zh: "玻利维亚",
            country_code: "bo"
        },
        br: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Brazil",
            country_zh: "巴西",
            country_code: "br"
        },
        cl: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Chile",
            country_zh: "智利",
            country_code: "cl"
        },
        co: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Colombia",
            country_zh: "哥伦比亚",
            country_code: "co"
        },
        do: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Dominican Republic",
            country_zh: "多明尼加共和国",
            country_code: "do"
        },
        ec: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Ecuador",
            country_zh: "厄瓜多尔",
            country_code: "ec"
        },
        gy: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Guyana",
            country_zh: "圭亚那",
            country_code: "gy"
        },
        pe: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Peru",
            country_zh: "秘鲁",
            country_code: "pe"
        },
        sr: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Suriname",
            country_zh: "苏里南",
            country_code: "sr"
        },
        ve: {
            region_code: O.SAM,
            region_en: "Central & South America",
            region_zh: "中美和南美",
            country_en: "Venezuela",
            country_zh: "委内瑞拉",
            country_code: "ve"
        },
        au: {
            region_code: O.OCE,
            region_en: "Oceania",
            region_zh: "大洋洲",
            country_en: "Australia",
            country_zh: "澳大利亚",
            country_code: "au"
        },
        nz: {
            region_code: O.OCE,
            region_en: "Oceania",
            region_zh: "大洋洲",
            country_en: "New Zealand",
            country_zh: "新西兰",
            country_code: "nz"
        },
        pg: {
            region_code: O.OCE,
            region_en: "Oceania",
            region_zh: "大洋洲",
            country_en: "Papua New Guinea",
            country_zh: "巴布亚新几内亚",
            country_code: "pg"
        },
        bg: {
            region_code: O.EUR,
            region_en: "Europe",
            region_zh: "欧洲",
            country_en: "Bulgaria",
            country_zh: "保加利亚",
            country_code: "bg"
        },
        fi: {
            region_code: O.EUR,
            region_en: "Europe",
            region_zh: "欧洲",
            country_en: "Finland",
            country_zh: "芬兰",
            country_code: "fi"
        },
        se: {
            region_code: O.EUR,
            region_en: "Europe",
            region_zh: "欧洲",
            country_en: "Sweden",
            country_zh: "瑞典",
            country_code: "se"
        },
        bf: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Burkina Faso",
            country_zh: "布基纳法索",
            country_code: "bf"
        },
        ci: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Côte d'Ivoire",
            country_zh: "科特迪瓦",
            country_code: "ci"
        },
        cd: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Dem. Rep. of the Congo",
            country_zh: "刚果民主共和国",
            country_code: "cd"
        },
        gh: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Ghana",
            country_zh: "加纳",
            country_code: "gh"
        },
        gn: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Guinea",
            country_zh: "几内亚",
            country_code: "gn"
        },
        lr: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Liberia",
            country_zh: "利比里亚",
            country_code: "lr"
        },
        ml: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Mali",
            country_zh: "马里",
            country_code: "ml"
        },
        mg: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Madagascar",
            country_zh: "马达加斯加",
            country_code: "mg"
        },
        mr: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Mauritania",
            country_zh: "毛里塔尼亚",
            country_code: "mr"
        },
        ne: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Niger",
            country_zh: "尼日利亚",
            country_code: "ne"
        },
        sn: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Senegal",
            country_zh: "塞内加尔",
            country_code: "sn"
        },
        za: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "South Africa",
            country_zh: "南非",
            country_code: "za"
        },
        sd: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Sudan",
            country_zh: "苏丹",
            country_code: "sd"
        },
        tz: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Tanzania",
            country_zh: "坦桑尼亚",
            country_code: "tz"
        },
        zw: {
            region_code: O.AFR,
            region_en: "Africa",
            region_zh: "非洲",
            country_en: "Zimbabwe",
            country_zh: "津巴布韦",
            country_code: "zw"
        },
        ca: {
            region_code: O.NAM,
            region_en: "North America",
            region_zh: "北美",
            country_en: "Canada",
            country_zh: "加拿大",
            country_code: "ca"
        },
        mx: {
            region_code: O.NAM,
            region_en: "North America",
            region_zh: "北美",
            country_en: "Mexico",
            country_zh: "墨西哥",
            country_code: "mx"
        },
        us: {
            region_code: O.NAM,
            region_en: "North America",
            region_zh: "北美",
            country_en: "United States",
            country_zh: "美国",
            country_code: "us"
        },
        cn: {
            region_code: O.ASI,
            region_en: "Asia",
            region_zh: "亚洲",
            country_en: "China",
            country_zh: "中国",
            country_code: "cn"
        },
        id: {
            region_code: O.ASI,
            region_en: "Asia",
            region_zh: "亚洲",
            country_en: "Indonesia",
            country_zh: "印尼",
            country_code: "id"
        },
        la: {
            region_code: O.ASI,
            region_en: "Asia",
            region_zh: "亚洲",
            country_en: "Laos",
            country_zh: "老挝",
            country_code: "la"
        },
        mn: {
            region_code: O.ASI,
            region_en: "Asia",
            region_zh: "亚洲",
            country_en: "Mongolia",
            country_zh: "蒙古",
            country_code: "mn"
        },
        ph: {
            region_code: O.ASI,
            region_en: "Asia",
            region_zh: "亚洲",
            country_en: "Philippines",
            country_zh: "菲律宾",
            country_code: "ph"
        },
        tr: {
            region_code: O.ASI,
            region_en: "Asia",
            region_zh: "亚洲",
            country_en: "Turkey",
            country_zh: "土耳其",
            country_code: "tr"
        },
        kz: {
            region_code: O.CIS,
            region_en: "CIS",
            region_zh: "独联体国家",
            country_en: "Kazakhstan",
            country_zh: "哈萨克斯坦",
            country_code: "kz"
        },
        kg: {
            region_code: O.CIS,
            region_en: "CIS",
            region_zh: "独联体国家",
            country_en: "Kyrgyz Republic",
            country_zh: "吉尔吉斯共和国",
            country_code: "kg"
        },
        ru: {
            region_code: O.CIS,
            region_en: "CIS",
            region_zh: "独联体国家",
            country_en: "Russian Federation",
            country_zh: "俄罗斯",
            country_code: "ru"
        },
        uz: {
            region_code: O.CIS,
            region_en: "CIS",
            region_zh: "独联体国家",
            country_en: "Uzbekistan",
            country_zh: "乌兹别克斯坦",
            country_code: "uz"
        }
    }





    const _ = { ar: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Argentina", country_zh: "闃挎牴寤�", country_code: "ar" }, bo: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Bolivia", country_zh: "鐜诲埄缁翠簹", country_code: "bo" }, br: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Brazil", country_zh: "宸磋タ", country_code: "br" }, cl: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Chile", country_zh: "鏅哄埄", country_code: "cl" }, co: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Colombia", country_zh: "鍝ヤ鸡姣斾簹", country_code: "co" }, do: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Dominican Republic", country_zh: "澶氭槑灏煎姞鍏卞拰鍥�", country_code: "do" }, ec: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Ecuador", country_zh: "鍘勭摐澶氬皵", country_code: "ec" }, gy: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Guyana", country_zh: "鍦簹閭�", country_code: "gy" }, pe: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Peru", country_zh: "绉橀瞾", country_code: "pe" }, sr: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Suriname", country_zh: "鑻忛噷鍗�", country_code: "sr" }, ve: { region_code: O.SAM, region_en: "Central & South America", region_zh: "涓編鍜屽崡缇�", country_en: "Venezuela", country_zh: "濮斿唴鐟炴媺", country_code: "ve" }, au: { region_code: O.OCE, region_en: "Oceania", region_zh: "澶ф磱娲�", country_en: "Australia", country_zh: "婢冲ぇ鍒╀簹", country_code: "au" }, nz: { region_code: O.OCE, region_en: "Oceania", region_zh: "澶ф磱娲�", country_en: "New Zealand", country_zh: "鏂拌タ鍏�", country_code: "nz" }, pg: { region_code: O.OCE, region_en: "Oceania", region_zh: "澶ф磱娲�", country_en: "Papua New Guinea", country_zh: "宸村竷浜氭柊鍑犲唴浜�", country_code: "pg" }, bg: { region_code: O.EUR, region_en: "Europe", region_zh: "娆ф床", country_en: "Bulgaria", country_zh: "淇濆姞鍒╀簹", country_code: "bg" }, fi: { region_code: O.EUR, region_en: "Europe", region_zh: "娆ф床", country_en: "Finland", country_zh: "鑺叞", country_code: "fi" }, se: { region_code: O.EUR, region_en: "Europe", region_zh: "娆ф床", country_en: "Sweden", country_zh: "鐟炲吀", country_code: "se" }, bf: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Burkina Faso", country_zh: "甯冨熀绾虫硶绱�", country_code: "bf" }, ci: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "C么te d'Ivoire", country_zh: "绉戠壒杩摝", country_code: "ci" }, cd: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Dem. Rep. of the Congo", country_zh: "鍒氭灉姘戜富鍏卞拰鍥�", country_code: "cd" }, gh: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Ghana", country_zh: "鍔犵撼", country_code: "gh" }, gn: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Guinea", country_zh: "鍑犲唴浜�", country_code: "gn" }, lr: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Liberia", country_zh: "鍒╂瘮閲屼簹", country_code: "lr" }, ml: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Mali", country_zh: "椹噷", country_code: "ml" }, mg: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Madagascar", country_zh: "椹揪鍔犳柉鍔�", country_code: "mg" }, mr: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Mauritania", country_zh: "姣涢噷濉斿凹浜�", country_code: "mr" }, ne: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Niger", country_zh: "灏兼棩鍒╀簹", country_code: "ne" }, sn: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Senegal", country_zh: "濉炲唴鍔犲皵", country_code: "sn" }, za: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "South Africa", country_zh: "鍗楅潪", country_code: "za" }, sd: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Sudan", country_zh: "鑻忎腹", country_code: "sd" }, tz: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Tanzania", country_zh: "鍧︽灏间簹", country_code: "tz" }, zw: { region_code: O.AFR, region_en: "Africa", region_zh: "闈炴床", country_en: "Zimbabwe", country_zh: "娲ュ反甯冮煢", country_code: "zw" }, ca: { region_code: O.NAM, region_en: "North America", region_zh: "鍖楃編", country_en: "Canada", country_zh: "鍔犳嬁澶�", country_code: "ca" }, mx: { region_code: O.NAM, region_en: "North America", region_zh: "鍖楃編", country_en: "Mexico", country_zh: "澧ㄨタ鍝�", country_code: "mx" }, us: { region_code: O.NAM, region_en: "North America", region_zh: "鍖楃編", country_en: "United States", country_zh: "缇庡浗", country_code: "us" }, cn: { region_code: O.ASI, region_en: "Asia", region_zh: "浜氭床", country_en: "China", country_zh: "涓浗", country_code: "cn" }, id: { region_code: O.ASI, region_en: "Asia", region_zh: "浜氭床", country_en: "Indonesia", country_zh: "鍗板凹", country_code: "id" }, la: { region_code: O.ASI, region_en: "Asia", region_zh: "浜氭床", country_en: "Laos", country_zh: "鑰佹対", country_code: "la" }, mn: { region_code: O.ASI, region_en: "Asia", region_zh: "浜氭床", country_en: "Mongolia", country_zh: "钂欏彜", country_code: "mn" }, ph: { region_code: O.ASI, region_en: "Asia", region_zh: "浜氭床", country_en: "Philippines", country_zh: "鑿插緥瀹�", country_code: "ph" }, tr: { region_code: O.ASI, region_en: "Asia", region_zh: "浜氭床", country_en: "Turkey", country_zh: "鍦熻€冲叾", country_code: "tr" }, kz: { region_code: O.CIS, region_en: "CIS", region_zh: "鐙仈浣撳浗瀹�", country_en: "Kazakhstan", country_zh: "鍝堣惃鍏嬫柉鍧�", country_code: "kz" }, kg: { region_code: O.CIS, region_en: "CIS", region_zh: "鐙仈浣撳浗瀹�", country_en: "Kyrgyz Republic", country_zh: "鍚夊皵鍚夋柉鍏卞拰鍥�", country_code: "kg" }, ru: { region_code: O.CIS, region_en: "CIS", region_zh: "鐙仈浣撳浗瀹�", country_en: "Russian Federation", country_zh: "淇勭綏鏂�", country_code: "ru" }, uz: { region_code: O.CIS, region_en: "CIS", region_zh: "鐙仈浣撳浗瀹�", country_en: "Uzbekistan", country_zh: "涔屽吂鍒厠鏂潶", country_code: "uz" } },



    var O; !function (e) { e.ALL = "all", e.SAM = "sam", e.OCE = "oce", e.EUR = "eur", e.AFR = "afr", e.NAM = "nam", e.ASI = "asi", e.CIS = "cis" }(O || (O = {}));