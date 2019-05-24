const blacklist = require('metro').createBlacklist;

module.exports = {
 resolver: {
   blacklistRE: /amplify\/#.*/
 }
};