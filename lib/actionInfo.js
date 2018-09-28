/**
 * Author : @yangjs
 * Date 2018.07.30
 */

const moment = require('moment-timezone');
const log = require('./log');

const actionInfo = (detail) => {
    let action = {};
    
    const eventLastSeen = moment(detail.service.eventLastSeen).tz('Asia/Seoul');
    action.actionTime = eventLastSeen.format('YYYY-MM-DD HH:mm:ss');
    
    log.debug('type: ', detail.type);
    const type = detail.type.split('/');
    
    switch (type[0]) {
        case 'Behavior:EC2':
        case 'Trojan:EC2':
        case 'UnauthorizedAccess:EC2':
            action.actionIp = detail.service.action.networkConnectionAction.remoteIpDetails.ipAddressV4;
            break;
            
        case 'PenTest:IAMUser':
        case 'Persistence:IAMUser':
        case 'Recon:IAMUser':
        case 'ResourceConsumption:IAMUser':
        case 'Stealth:IAMUser':
        case 'UnauthorizedAccess:IAMUser':
            action.actionIp = detail.service.action.awsApiCallAction.remoteIpDetails.ipAddressV4;
            break;
            
        case 'Recon:EC2':
            action.actionIp = detail.service.action.portProbeAction.portProbeDetails[0].remoteIpDetails.ipAddressV4;
            break;
            
        default:
            action.actionIp = '';
    }
    
    log.debug('actionInfo: ', detail.type, JSON.stringify(action, null, 2));
    
    return action;
};

module.exports = actionInfo;