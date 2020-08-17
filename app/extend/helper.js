const path = require('path');
const fs = require('fs');

module.exports = {
    async dirExists(dir){

        // 是否已存在
        const getStat =(path)=> {
            return new Promise((resolve, reject) => {
                fs.stat(path, (err, stats) => {
                    if(err){
                        resolve(false);
                    }else{
                        resolve(stats);
                    }
                })
            })
        }

        // 创建
        const mkdir =(dir)=> {
            return new Promise((resolve, reject) => {
                fs.mkdir(dir, err => {
                    if(err){
                        resolve(false);
                    }else{
                        resolve(true);
                    }
                })
            })
        }

        let isExists = await getStat(dir);

        //如果该路径且不是文件，返回true
        if(isExists && isExists.isDirectory()){
            return true;
        }
        //如果该路径存在但是文件，返回false
        else if(isExists){     
            return false;
        }
        //如果该路径不存在
        let tempDir = path.parse(dir).dir;      //拿到上级路径
        //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
        let status = await this.ctx.helper.dirExists(tempDir);
        let mkdirStatus;

        if(status){
            mkdirStatus = await mkdir(dir);
        }

        return mkdirStatus;
    }
}