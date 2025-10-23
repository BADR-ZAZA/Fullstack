console.log(__filename);
console.log(__dirname);
console.log(module);
console.log(exports === module.exports);

exports.dirSalut = () => console.log("Salut !");
console.log(module.exports);
