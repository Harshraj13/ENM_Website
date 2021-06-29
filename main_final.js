const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const {stderr} = require('process')
const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')

const port = process.env.port || 3000



app.use(express.static(__dirname));

//connecting to database in atlas
async function main(){
    const uri = "mongodb+srv://harshraj:sadwelkar@cluster0.infan.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    const client = new MongoClient(uri);
    try{
        await client.connect();

        //await listDatabases(client)
       

    }catch(e){
        console.error(e);
    }finally{
        await client.close();
    }
    
}
main().catch(console.error);    //connect to db 
const connection_string = 'mongodb+srv://harshraj:sadwelkar@cluster0.infan.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(connection_string);
 const db = mongoose.connection;
 db.on('error',console.log.bind(console,"Connection error"));
 //on successfull connection
 db.once('open',function(callback){
     console.log("Connected successfully to database")
 });



//setting public folder to render files
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//posting data to database
app.post('/details_entered',(req,res)=>{
   
    var name = req.body.name;
    var Std = req.body.class;
    var email = req.body.email;
    var phone = req.body.phone;
    var status = req.body.status;
    var feedback = req.body.suggestion;

    // Insert_Data(client,{
    //     "name": name,
    //     "Class": Std,
    //     "email": email,
    //     "phone": phone,
    //     "Active": status,
    //     "Suggessions": feedback
    // })
    var data = {
        "name": name,
        "Class": Std,
        "email": email,
        "phone": phone,
        "Active": status,
        "Feedback":feedback
    }
    db.collection('student_info').insertOne(data,function(err,collection){
        if (err) throw err;
        console.log("Record inserted successfully");

    })

    return res.redirect('http://www.google.com');





    //still got to write this part
})

async function Insert_Data(client,new_data){
    const result = await client.db("spk").collection("student_info").insertOne(new_data);

    console.log(`New data inserted sucessfully id: ${result.insertedId}`)
}


app.get('/',(req,res)=>{
    res.set({
        'Access-control-Allow-Origin':'*'
    });
    return res.redirect('frontend.html');
});

app.listen(port,()=>{
    console.log(`Server live at port: ${port}`)
});
