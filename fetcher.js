'use strict'
const config = require('./config.json');
const cheerio = require('cheerio');
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const fs = require("fs");
const url=require('url')
class Fetcher {
    constructor(params) {
        this.params = params
    }
    log(str){
        console.log("["+this.params.taskName+"] "+JSON.stringify(str,null,4))
    }

    fetchData() {
        this.log('正在抓取数据...')

       return Promise.all(this.params.reqs).then(r=> {
            this.log('正在解析数据...')

            return r.map(this.params.parseData).reduce((previous, item)=> previous.concat(item))
        }).then(data=> {
            var newData = this.checkUpdateData(data)
            if (newData.length > 1) {
                this.writeData(data)
                this.log('发现新数据')
                this.log(newData)
                return newData
            }
            this.log('未发现新数据')
            return []
        }).catch(()=>{
           return []
       })
    }



    checkUpdateData(dataToCheck) {
        this.log('正在比对数据...')
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
