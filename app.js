const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const client=require("@mailchimp/mailchimp_marketing");
const app=express();
const https=require("https");
client.setConfig({apikey:"Your API Key",server:"us1"});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
  res.sendFile(__dirname +"/signup.html");
});
app.listen(process.env.PORT || 3000,function(){                 //Dynamic Port for heroku
  console.log("Server is running on port 3000");
});
app.post("/",function(req,res){
  var firstName=req.body.fname;
  var lastName=req.body.lname;
  var email=req.body.email;
  var data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData=JSON.stringify(data);
  const url="https://us1.api.mailchimp.com/3.0/lists/your ID";
  const options={
    method:"POST",
    auth:"YOur name:Your API key"
  }
  const request=https.request(url,options,function(response){
    if(response.statusCode===200){
    res.sendFile(__dirname+"/success.html");
    }
    else{
    res.sendFile(__dirname+"/failure.html");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();

});
app.post("/failure",function(req,res){
  res.redirect("/")
});
