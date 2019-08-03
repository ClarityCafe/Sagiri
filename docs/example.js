const Sagiri = require('sagiri');
const sagiri = new Sagiri('YOUR_TOKEN');
// import Sagiri from 'sagiri' for ES6 modules

// Basic usage
sagiri.getSauce('http://i.imgur.com/YmaYT5L.png').then(console.log);

// Or with Async/Await
(async function() {
  const data = await sagiri.getSauce('http://i.imgur.com/YmaYT5L.png');
  console.log(data);
})();

// With additional options
const sagiriWithMasks = new Sagiri('YOUR_TOKEN', {
  dbMask: [ 5, 35 ],
  dbMaskI: [ 29 ],
});

sagiriWithMasks.getSauce('http://i.imgur.com/YmaYT5L.png').then(console.log);

