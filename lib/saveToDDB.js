/**
 * Author : @yangjs
 * Date 2018.06.29
 */

// 모듈 로드
const AWS = require('aws-sdk');
const log = require('./log');
const actionInfo = require('./actionInfo');

AWS.config.update({region: 'ap-northeast-2'});
const ddb = new AWS.DynamoDB.DocumentClient();

const saveToDDB = (event) => {
    return new Promise((resolve, reject) => {
        
        // "" -> null 치환 (에러 방지)
        let event_str = JSON.stringify(event);
        event_str = event_str.replace(/""/gi, 'null');
        event = JSON.parse(event_str);
        
        // 공격자 정보 추출
        let detail = event.detail;
        const action = actionInfo(detail);
        detail.actionIp = action.actionIp;
        detail.actionTime = action.actionTime;
        
        const putParams = {
            TableName: 'B2_GUARD_DETECT',
            Item: detail
        };
        
        log.debug('putParams: ', JSON.stringify(putParams, null, 2));
    
        // detect 정보 저장
        ddb.put(putParams, function(err, data) {
            if (err) {
                log.error(err, err.stack);
                reject(err);
            } else {
                log.debug('put result: ', data);
                resolve();
            }
        });
    });
};

module.exports = saveToDDB;