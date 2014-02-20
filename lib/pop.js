// pop client

var POP3Client = require("poplib");
var MimeParser = require("./parser").MimeParser;

function POPClient (port, host) {
  this.port = port;
  this.host = host;
  if (this.port === 995) {
    this.enabletls = true;
  } else {
    this.enabletls = false;
  }
}

exports.POPClient = POPClient;

POPClient.prototype.connect = function (callback) {
  var that = this;
  that.client = new POP3Client(
    that.port,
    that.host,
    {
      tlserrs: false,
      enabletls: that.enabletls,
      debug: false
    }
  );
  that.client.on("connect", function (status, rawdata) {
    if (status) {
      return callback(null, rawdata);
    } else {
      return callback(rawdata, null);
    }
  });
};

POPClient.prototype.login = function (username, password, callback) {
  var that = this;
  that.client.login(username, password);
  that.client.on("login", function (status, rawdata) {
    if (status) {
      return callback(null, rawdata);
    } else {
      return callback(rawdata, null);
    }
  });
};

POPClient.prototype.list = function (callback) {
  var that = this;
  that.client.list();
  that.client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
    if (status) {
      var msgs = rawdata.split("\n").slice(0, -1);
      msgs.forEach(function (ele, index, array) {
        array[index] = parseInt(ele.split(' ')[0]);
      });
      return callback(null, msgs);
    } else {
      return callback(rawdata, null);
    }
  });
};

POPClient.prototype.retr = function (msgid, callback) {
  var that = this;
  that.client.retr(msgid);
  that.client.on("retr", function (status, msgnumber, data, rawdata) {
    if (status) {
      var mimeParser = new MimeParser();
      mimeParser.parse(data, function (mail_object) {
        return callback(mail_object);
      });
    } else {
      return callback(rawdata, null);
    }
  });
};

POPClient.prototype.dele = function (msgid, callback) {
  var that = this;
  that.client.dele(msgid);
  that.client.on("dele", function (status, msgnumber, rawdata) {
    if (status) {
      return callback(null, rawdata);
    } else {
      return callback(rawdata, null);
    }
  });
};

POPClient.prototype.quit = function (callback) {
  var that = this;
  that.client.quit();
  that.client.on("quit", function (status, rawdata) {
    if (status) {
      return callback(null, rawdata);
    } else {
      return callback(rawdata, null);
    }
  });
};
