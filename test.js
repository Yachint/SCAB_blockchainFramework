const obj = {};

obj['horse'] = { name : 'horse', status: 'true'};
obj['dog'] = { name : 'dog', status: 'false'};
obj['cat'] = { name : 'cat', status: null};

console.log(obj);

if(obj['horse']!==null){
    console.log('true');
}
else{
    console.log('false');
}

console.log(obj.horse);

