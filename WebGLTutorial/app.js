
var arr = [1,2,3,4];

function printArray(anArray){
	for (var i = 0; i < anArray.length; i++) {
		console.log(anArray[i]);
	}
}

printArray(arr);
arr.push(5);
printArray(arr);
var res = arr.pop();
printArray(arr);



function sayHello(name) {
	console.log("Hello " + name);
}



//console.log(module)

//sayHello("Peter");
