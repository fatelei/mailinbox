var POPClient = require("../lib/pop").POPClient;

var cli = new POPClient(995, "pop.gmail.com");
var test_email = "consequentxkwv@gmail.com";
var test_password = "5uag93wk37e";
var count = 0;

cli.connect(function (err, result) {
  console.log(result);
  if (!err) {
    cli.login(test_email, test_password, function (err, result) {
      console.log(result);
      if (!err) {
        cli.list(function (err, msgs) {
          if (!err) {
            for (var i = 0; i < msgs.length; i++) {
              (function (index) {
                cli.retr(msgs[index], function (mail_object) {
                  var h = {};
                  h.to = mail_object.to[0].address;
                  h.from = mail_object.from[0].address;
                  h.subject = mail_object.subject;
                  h.date = mail_object.date
                  console.log(JSON.stringify(h));
                  count += 1;
                  if (count === msgs.length) {
                    cli.quit(function (err, result) {
                      console.log(result);
                      process.exit(0);
                    });
                  }
                });
              })(i);
            }
          } else {
            console.log("some error");
          }
        });
      } 
    });
  }
});
