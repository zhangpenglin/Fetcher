const Fetcher = require('./fetcher')
const cheerio = require('cheerio');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const fs = require("fs");
const exec = require("child_process").exec
const config = require('./config.json');

exec('anywhere 3333 -s')

function sendMessage(data) {
    const config=JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
    const msg = config.messageQuery.qs.msg
    const now = Date.now()
    config.messageQuery.qs.msg = (new Date()).toLocaleString()+"  "+msg + 'Click [ here | ' + config.serverPort + '/index.html?ver=' + now + '] to get more info'
    return request(config.messageQuery)
}
function gethebgc() {
    const taskName = 'hebgc'
    const preUrl = 'http://www.hebgc.com/hebgc2009/index.php'
    const url = preUrl + '?a=eng-anc-list&cat_bid1=Z04&region=&title=&p=';
    const reqs = [request(url + '1'), request(url + '2')]
    const filePath = './3.json'
    const fetcher = new Fetcher({
        taskName,
        preUrl,
        reqs,
        filePath,
        parseData: function (r) {
            const returnValue = []
            const $ = cheerio.load(r.body)
            const list = $("#fl_lt_div tr a")
            list.each(function (i, data) {
                const title = $(data).text()
                const url = preUrl + $(data).attr('href')
                const id = url.split("=").pop()
                returnValue.push({
                    title,
                    url,
                    id
                })
            })
            return returnValue
        }
    })
    return fetcher
}
function getccgp() {
    const taskName = 'ccgp'
    const preUrl = 'http://ccgp-hebei.gov.cn'
    const url = preUrl + '/zfcg/web/getBidingList_';
    const reqs = [request(url + '1.html'), request(url + '2.html')]
    const filePath = './2.json'
    const fetcher = new Fetcher({
        taskName,
        preUrl,
        reqs,
        filePath,
        parseData: function (r) {
            const returnValue = []
            const $ = cheerio.load(r.body)
            const list = $("#moredingannctable tr[onclick]")
            list.each(function (i, data) {
                const title = $(data).find("a").text()
                const id = $(data).attr('onclick').split("'")[1]
                const url = preUrl + "/zfcg/1/bidingAnncDetail_" + id + ".html"
                returnValue.push({
                    title,
                    url,
                    id
                })
            })
            return returnValue
        }
    })
    return fetcher
}
function getbidding() {
    const taskName = "hebeibidding"
    const preUrl = 'http://hebeibidding.com.cn/'
    const url = preUrl + '/tender/more.aspx'

    const formData = fs.readFileSync('data.txt', 'utf-8');
    const reqs = [
        request(
            {
                uri: url,
                method: 'POST',
                form: formData + '1'
            }), request(
            {
                uri: url,
                method: 'POST',
                form: formData + '2'
            })]
    const filePath = './1.json'
    const fetcher = new Fetcher({
        taskName,
        preUrl,
        reqs,
        filePath,
        parseData: function (r) {
            const returnValue = []
            const $ = cheerio.load(r.body)
            const list = $("#DataGrid1 a")
            list.each(function (i, data) {
                const title = $(data).text()
                const url = preUrl + "tender/" + $(data).attr('href')
                const id = url.split("=")[1]

                returnValue.push({
                    title,
                    url,
                    id
                })
            })
            return returnValue
        }
    })
    return fetcher
}

function delayFetch() {
    const currentTime = new Date()
    if (currentTime.getHours() == config.stopHour) {
        //下班时间，延迟到明天上班再抓取
        const timeout = this.getNextFetchTimeout()
        console.log(timeout + '分钟后将进行下次抓取')
        setTimeout(fetchData, timeout * 60 * 1000)
    } else {
        console.log(config.timeout + '分钟后将进行下次抓取')
        setTimeout(fetchData, config.timeout * 60 * 1000)
    }
}

function getNextFetchTimeout() {
    const hour = (24 - config.stopHour) + config.startHour
    return hour * 60
}

function fetchData() {
    const req = [biddingFetcher.fetchData(), ccgpFetcher.fetchData(), hebgcFetcher.fetchData()]

    Promise.all(req).then(data=> {
        const newData = data[0].concat(data[1]).concat(data[2])
        if(newData.length>0){
            const jsonData=[{
                name:'河北招标投标网 bidding',
                data:data[0]
            },{
                name:'河北政府采购网 ccgp',
                data:data[1]
            },{
                name:'河北建设工程信息网 hebgc',
                data:data[2]
            }]
            fs.writeFileSync('newData.json',JSON.stringify(jsonData,null,4),'utf-8')
            return sendMessage(newData)
        }
        return 'noNewData'

    }).then(()=> {
        delayFetch()
    }).catch(()=> {
        console.log('发生错误')
        delayFetch()
    })
}
const biddingFetcher = getbidding()
const ccgpFetcher = getccgp()
const hebgcFetcher = gethebgc()
fetchData()