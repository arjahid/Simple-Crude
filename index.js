const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://jahidhasan:jahid123@cluster0.lsdr1.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();
        

        app.get('/users',async(req,res)=>{
            const users=await client.db('practiceUser').collection('users').find({}).toArray();
            res.send(users);
        })
    app.get('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const user=await client.db('practiceUser').collection('users').findOne(query);
        res.send(user);
    })

        app.post('/users',async(req,res)=>{
            const users=req.body;
            console.log('new users',users);
            const result=await client.db('practiceUser').collection('users').insertOne(users);
            res.send(result);
        })
        app.put('/users/:id',async(req,res)=>{
            const id =req.params.id;
            const updatedUser=req.body;
            console.log('update this', updatedUser);
            const filter={_id:new ObjectId(id)};
            const options={upsert:true};
            const updateUser={
                $set:{
                    name:updatedUser.name,
                    email:updatedUser.email
                }
            }
            const result=await client.db('practiceUser').collection('users').updateOne(filter,updateUser,options);
            res.send(result);
        })
        app.delete('/users/:id',async(req,res)=>{
            const id=req.params.id;
            console.log('delete this',id);
            const query={_id:new ObjectId(id)};
            const result=await client.db('practiceUser').collection('users').deleteOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.error(e);
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World i am jahi from bangladesh');
});




app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
}
)