'use strict';
//node.js 文件操作对象
const fs = require('fs');
//node.js 路径操作对象
const path = require('path');
//egg.js Controller
const Controller = require('egg').Controller;
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
//当然你也可以不使用这个 哈哈 个人比较赖
//还有我们这里使用了egg-multipart
const md5 = require('md5');
const await = require('await-stream-ready/lib/await');

class UploadController extends Controller {

    async index() {
        const { ctx } = this;
     
        const stream = await ctx.getFileStream();
        //新建一个文件名
        const filename = md5(stream.filename) + path
            .extname(stream.filename)
            .toLocaleLowerCase();
       
        const paths = path.join(this.config.baseDir, 'app/public/uploads');
        await ctx.helper.dirExists(paths);
        //当然这里这样市不行的，因为你还要判断一下是否存在文件路径
        const target = path.join(this.config.baseDir, 'app/public/uploads', filename);
        
        //生成一个文件写入 文件流
        const writeStream = fs.createWriteStream(target);
        try {
            //异步把文件流 写入
            await awaitWriteStream(stream.pipe(writeStream));
        } catch (err) {
            //如果出现错误，关闭管道
            await sendToWormhole(stream);
            throw err;
        }
        // 文件响应
        ctx.body = {
            url: '/public/uploads/' + filename
        };
    }
}

module.exports = UploadController;
