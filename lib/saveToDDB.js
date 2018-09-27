/**
 * Author : @yangjs
 * Date 2018.06.29
 */

// 모듈 로드
const AWS = require('aws-sdk');
const log = require('./log');

AWS.config.update({region: 'ap-northeast-2'});
const ddb = new AWS.DynamoDB.DocumentClient();

const saveToDDB = (event) => {
    return new Promise((resolve, reject) => {
        
        // "" -> null 치환 (에러 방지)
        let event_str = JSON.stringify(event);
        event_str = event_str.replace(/""/gi, 'null');
        
        const params = {
            TableName: 'B2_GUARD',
            Item: JSON.parse(event_str)
        };
        
        log.debug('params: ', JSON.stringify(params));
    
        ddb.put(params, function(err, results) {
            if (err) {
                log.error(err, err.stack);
                reject(err);
            } else {
                log.debug('results: ', results);
                resolve();
            }
        });
    });
};

module.exports = saveToDDB;