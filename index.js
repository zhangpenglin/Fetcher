const Fetcher = require('./fetcher')
const cheerio = require('cheerio');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const fs = require("fs");


function gethebgc() {
    const taskName='hebgc'
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
    fetcher.fetchData()
}
function getccgp() {
    const taskName='ccgp'
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
    fetcher.fetchData()
}
function getbidding() {
    const taskName="hebeibidding"
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
    fetcher.fetchData()
}
getbidding()
getccgp()
gethebgc()