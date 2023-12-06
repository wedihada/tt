var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


//  update and add

 const data ={
    id:1,
     name:"karuna",
    Age:26
 }
 db.collection("Details").doc(data.id.toString()).set(data);


//Retrieve data in terminal

let customerRef = db.collection("Details");
customerRef.get().then((querySnapshot) => {
    querySnapshot.forEach(document => {
        console.log(document.data());
    })
})


//create multiple data(batch data)

const batch = db.batch();
const Details6 = db.collection("Details").doc("6");
const Details7 = db.collection("Details").doc("7");
const Details8 = db.collection("Details").doc("8");
const Details9 = db.collection("Details").doc("9");
const Details10 = db.collection("Details").doc("10");

batch.set(Details6, { id: 6, name: "Mala", Age: 22 });
batch.set(Details7, { id: 7, name: "Kamala", Age: 28 });
batch.set(Details8, { id: 8, name: "Jhon", Age: 27 });
batch.set(Details9, { id: 9, name: "Jerry", Age: 30 });
batch.set(Details10, { id: 10, name: "Nimal", Age: 29 });

batch.commit().then(res => {
    console.log("Batch data Run")
});



//delete

db.collection("Details").doc("1").delete().then(res => {
     console.log("Document deleted")
})


---------------------- mongo ---------------------

Mongoimport
mongoimport --jsonArray --db school --collection studentdetails --file data.json

filter with two columns
db.studentdetails.find({},{std_ID:1,name:1})

without _id
db.studentdetails.find({},{_id:0,std_ID:1,name:1})

first 5 data set
db.studentdetails.find({}).limit(5)

ascendinding sort by id
db.studentdetails.find({}).sort({std_ID:1}).limit(5)

ascending sort and skip
db.studentdetails.find({}).sort({std_ID:1}).skip(5)

and condition
db.studentdetails.find({$and:[{city:"Dallas"},{std_ID:9}]})

less than
db.studentdetails.find({age:{$lt:25}})

decending
db.studentdetails.find({}).sort({"std_ID":-1})

and condition filter
db.studentdetails.find({$and:[{age:20},{city:"Chicago"}]},{name:1})

update name only
db.studentdetails.update({name:"Alice Johnson"},{$set:{name:"John"}})

delete entire column
db.studentdetails.updateMany({},{$unset:{marks:1}})

> db.Book.insertMany([{Item:"Book",Quantity:25,Status:"A"},
... {Item:"Article",Quantity:18,Status:"B"},
... {Item:"NoteBook",Quantity:31,Status:"A"},
... {Item:"Journal",Quantity:19,Status:"D"},
... {Item:"Postcard",Quantity:30,Status:"A"}])

Quantity is less than 20
> db.Book.find({Quantity:{$lt:20}})

status equals A and Qunatity is greater than equal 30
> db.Book.find({$and:[{Status: {$eq:"A"}},{Quantity:{$gte:30}}]})

Qunatity is greater than 25 and whose item is PostCard
> db.Book.find({$and:[{Quantity: {$gt:25}},{Item:{$eq:"Postcard"}}]})

qunatity is not equal 18
> db.Book.find({Quantity:{$ne:18}})

getting items names start with "J"
db.Book.find({Item: /^J/})

> db.Book.find({Item:/^B/})

> db.Book.find({Item:/k$/})

> db.Book.find({$and:[{Item:/^B/},{Item:/k$/}]})

> db.Book.find({$and:[{Item:/^J/},{Item:/l$/}]})


-------------------------Aggregation-------------------------------

> db.Order.insertMany([{_id: 0,name:"Pepperoni",size:"small",price:19,quantity:10,date:ISODate("2021-03-13T08:14:30Z")},
... {_id:1, name:"Pepperoni",size:"medium",price:20,quantity:20,date:ISODate("2021-03-13T09:13:24Z")},
... {_id:2, name:"Pepperoni",size:"large",price:21,quantity:30,date:ISODate("2021-03-17T09:22:12Z")},

> db.Order.find()

filter all documents with size medium

> db.Order.aggregate({$match:{size:"medium"}})

group documents by their names

> db.Order.aggregate({$group:{_id:"$name"}})


return total of orders quantity of medium size
>
> db.Order.aggregate([
... {$match:{size:"medium"}},						// stage 1 filter size medium and get 5 outputs
... {$group:{_id:"$name",totalorderqtyt:{$sum:"$quantity"}}}		// stage 2 group by name and sum the toal of quantity
... ])


find documents with the date between 2023-01-01 -- 2021-01-01

> db.Order.aggregate({ $match:{date:{$lte:ISODate("2023-01-01"),$gt:ISODate("2021-01-01")}}})

>
> db.Order.aggregate([ {$match:{size:"medium"}}, {$group:{_id:"$name",Qty:{$sum:"$quantity"}}}])


total profit of size medium
> db.Order.aggregate([{$match:{size:"medium"}},{$group:{_id:"$name",TotalProfit:{$sum:{$multiply:["$quantity","$price"]}}}}])


total profit of everything
> db.Order.aggregate([{$group:{_id:"$name",TotalProfit:{$sum:{$multiply:["$quantity","$price"]}}}}])

print the total quantity without id field
> db.Order.aggregate([ {$match:{size:"medium"}}, {$group:{_id:"$name",totalQty:{$sum:"$quantity"}}},{$project:{_id:0}}])

print the needed fields with 1 and 0 1 means print all
> db.Order.aggregate({$project:{_id:0,name:1,price:1}})

>
displaying with name id and price
> db.Order.aggregate({$project:{name:1,price:1}})

display first 5 docs 
> db.Order.aggregate({$limit:5})

limit 2
> db.Order.aggregate([ {$match:{size:"medium"}}, {$group:{_id:"$name",totalQty:{$sum:"$quantity"}}},{$project:{_id:0}},{$limit:2}])

skip first 5 docs
> db.Order.aggregate({$skip:5})

Insert data to students database and collection name is details
db.details.insertMany([
{ name: "Jhon", age: 17, id: 1, section: "A", subject: ["Physics", "Maths"] },
{ name: "Steve", age: 37, id: 2, section: "A", subject: [""] },
{ name: "Mohamed", age: 17, id: 3, section: "B", subject: ["Physics", "English"] },
])

2. Displaying details of students whose age is less than 20.
db.details.aggregate([
 { $match: { age: { $lt: 20 } } }
]);

3. Sorting the students based on age in ascending order.
db.details.aggregate([
 { $sort: { age: 1 } }
]);

4. Displaying details of a student having the largest age in the section – B
db.details.aggregate([
 { $match: { section: 'B' } },
 { $sort: { age: -1 } },
 { $limit: 1 }
]);

5. Displaying the total number of students in section ‘B’
db.students.aggregate([
 { $match: { section: "B" } },
 { $group: { _id: null, totalStudents: { $sum: 1 } } }
]);

6. Displaying the total number of students in both the sections
db.details.aggregate([
 { $group: { _id: "$section", totalStudents: { $sum: 1 } } }
]);

7. Display the total number of students in both the sections and maximum age from both
section
db.details.aggregate([
 { $group: { _id: "$section", 
 totalStudents: { $sum: 1 },
 maxAge: { $max: "$age" } 
 } 
 }
]);

8. Display first 3 data in the dataset
db.details.aggregate({$skip:3})

9. Sort the name in to ascending order then show the last 4 data
db.details.aggregate([{$sort:{"age":1}},{$skip:3}])











