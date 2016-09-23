import { Injectable, Pipe, PipeTransform } from '@angular/core';

/*
  Generated class for the Common pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({ name: 'objToArray', pure: false })
export class ValuesPipe implements PipeTransform {
  transform(dict: Object): any {
    var a = [];
    for (var key in dict) {
      if (dict.hasOwnProperty(key)) {
        a.push({ "key": key, "value": dict[key] });
        //console.log(key,dict[key]);
      }
    }
    return a;
  }
}
@Pipe({ name: 'arrayByKey', pure: false })
export class arrayByKeyPipe implements PipeTransform {
  transform(collection: any, occurs: any): any {
    let a=null;
    collection.forEach((elt, key) => {
        if (key == occurs) {a=elt;}
      });
    return a;
  }
}
@Pipe({ name: 'binaryData' })
export class binaryData {
  // Transform is the new "return function(value, args)" in Angular 1.x
  transform(value, mime?) {
    var temp = value.substring(4, value.length - 1);
    //console.log(temp, mime[0]);
    var file = new Blob([value], { type: mime[0] });
    var retUrl = URL.createObjectURL(file);
    //console.log(retUrl);
    return file
  }
}
@Pipe({ name: 'groupBy' })
export class groupBy implements PipeTransform {
  transform(collection: any, getter: any, subgetter?: any, ssubgetter?: any,sub?:number): any {
    var result = {};
    var prop;
    for (var elm in collection) {
      prop = collection[elm][getter];
      if (subgetter) prop = prop[subgetter];
      if (ssubgetter) prop = prop[ssubgetter];
      if (sub) prop=prop.substring(0,sub);
      //console.log("GROUP BY:", collection, elm, getter, prop);
      if (!result[prop]) {
        result[prop] = [];
      }
      result[prop].push(collection[elm]);
    };
    return result;
  }
}
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push({ key: key, value: value[key] });
    }
    return keys;
  }
}
@Pipe({ name: 'textToDate' })
export class textToDate implements PipeTransform {
  transform(value): any {
    // 2016-07-14 02:23:03
    let ret = {};
    let d = (value.substring(0, 10));
    let t = (value.substring(11, 20));
    ret = { "date": d, "time": t };
    return ret;
  }
}
