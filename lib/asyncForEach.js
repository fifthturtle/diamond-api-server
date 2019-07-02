

 module.exports.asyncForEach  = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  module.exports.asyncForEachAttribute  = async function (object, callback) {
    var index = 0;
    for(var propertyName in object) {
      await callback(object[propertyName], index++, object);
    }
  }




