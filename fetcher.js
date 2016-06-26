'use strict'
const config = require('./config.json');
const cheerio = require('cheerio');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const fs = require("fs");

class Fetcher {
    constructor(params) {
        this.params = params
    }

    fetchData() {
        console.log('正在抓取数据...')

        Promise.all(this.params.reqs).then(r=> {
            console.log('正在解析数据...')

            return r.map(this.params.parseData).reduce((previous, item)=> previous.concat(item))
        }).then(data=> {
            var newData = this.checkUpdateData(data)
            if (newData.length > 1) {
                this.writeData(data)
                console.log('发现新数据')
                console.log(newData)
                return this.sendMessage(newData)
            }
            console.log('未发现新数据')
            return 'noNewData'
        }).then(data=> {
            this.delayFetch()
        }).catch(data=> {
            console.log('发生错误')
            console.log(data)
            this.delayFetch()
        })
    }

    delayFetch() {
        const currentTime = new Date()
        if (currentTime.getHours() == config.stopHour) {
            //下班时间，延迟到明天上班再抓取
            const timeout = this.getNextFetchTimeout()
            console.log(timeout + '分钟后将进行下次抓取')
            setTimeout(this.fetchData.bind(this), timeout * 60 * 1000)
        } else {
            console.log(config.timeout + '分钟后将进行下次抓取')
            setTimeout(this.fetchData.bind(this), config.timeout * 60 * 1000)
        }
    }

    getNextFetchTimeout() {
        const hour = (24 - config.stopHour) + config.startHour
        return hour * 60
    }

    sendMessage(data) {
        const msg = data.map(d=>`[${d.title}|${d.url}]`)
        config.messageQuery.qs.msg = msg.join(' ')
        return request(config.messageQuery)
    }

    checkUpdateData(dataToCheck) {
        console.log('正在比对数据...')
        const newData = []
        try {
            const oldData = JSON.parse(fs.readFileSync(this.params.filePath, 'utf-8'))
            dataToCheck.forEach(data=> {
                const condition = oldData.some(od=>od.url == data.url)
                if (!condition) {
                    newData.push(data)
                }
            })
        } catch (e) {
            this.writeData(dataToCheck)
            return newData
        }

        return newData
    }

    writeData(data) {
        fs.writeFileSync(this.params.filePath, JSON.stringify(data, null, 4), 'utf-8')
    }
}
module.exports = Fetcher
