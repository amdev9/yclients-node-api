
const { YclientsApi } = require('./index')


const api = new YclientsApi({
  tokenPartner: "5uuwjsb8pfzf54ddkmdm"
})

api
  .getAuth({ "login": "socialdevteam@yandex.ru", "password": "hugwwb" })
  // { "login": "amatveevdev9@gmail.com", "password": "txxta6" }
  .then(data => console.log(data))
  .catch((error) => {
    console.log(error.stack)
  });


// api
//   .getStaff('474476') // '466816')
//   .then(data => console.log(data))
//   .catch((error) => {
//     console.log(error.stack)
//   });

// // api
//   .getBookServices('474476')
// // .getBookform('474476') // '466816')
//   .then(data => console.log(data))
//   .catch((error) => {
//     console.log(error.stack)
//   });


///// bot logic


// api
//   .getBookStaff('474476') // '466816')
//   .then(data => console.log(data))
//   .catch((error) => {
//     console.log(error.stack)
//   });

//   api
//   .getBookServices('474476') // '466816')
//   .then(data => console.log(JSON.stringify(data)))
//   .catch((error) => {
//     console.log(error.stack)
//   });


//   api
//   .getBookDates('474476') // '466816')
//   .then(data => console.log(data))
//   .catch((error) => {
//     console.log(error.stack)
//   });

  
// api
//   .getBookTimes('474476', '1385451', new Date()) // '466816')
//   .then(data => console.log(data))
//   .catch((error) => {
//     console.log(error.stack)
//   });

  


  // appointments = 

// api
// .postBookCheck('474476', {}) 
// .then(data => console.log(data))
// .catch((error) => {
//   console.log(error.stack)
// });

  

api
.postBookRecord('474476', {}) 
.then(data => console.log(data))
.catch((error) => {
  console.log(error.stack)
});