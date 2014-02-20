// mime parser

var MailParser = require("mailparser").MailParser;

function MimeParser () {
  this.mailparser = new MailParser();
}

exports.MimeParser = MimeParser;

MimeParser.prototype.parse = function (mime, callback) {
  var that = this;
  that.mailparser.on("end", function (mail_object) {
    return callback(mail_object);
  });
  that.mailparser.write(mime);
  that.mailparser.end();
}
