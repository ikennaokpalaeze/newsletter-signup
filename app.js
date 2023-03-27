const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

//https is a native node module and so you don't need to install it 
const https = require("https");

const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/ab86d36b7b"
    const options = {
        method: "POST",
        auth: "charles1:66726b55ac06abadbf974aa5bc35272c-us10"
    }

    const request = https.request(url, options, function (response) {
        var statCode = response.statusCode;
        if (statCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));
            
        });
    });
    request.write(jsonData);
    request.end();
});

//when the sign up fails, a click on the button on the failure page will redirect us to the homepage -- thanks to this code!
app.post("/failure", function(req, res) {
    res.redirect("/");
});

//heroku decides randomly the port to listen to. Hence, to enable Heroku do this, you type in process.env.PORT
//Doing this, your app can't run locally again except you add || 3000
app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000.");
});
