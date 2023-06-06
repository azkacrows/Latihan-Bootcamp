const initialMemoryUsage = process.memoryUsage().heapUsed; //todo 1
const yourName = process.argv[2]; //todo 2
const environment = process.env.NODE_ENV; //todo 3

for(let i = 0; i <= 10000; i++ ) {
    // proses looping ini akan membuat penggunaan memory naik
}

const currentMemoryUsage = process.memoryUsage().heapUsed; //todo 4

console.log(`Hai, ${yourName}`);
console.log(`Mode Environment: ${environment}`);
console.log(`Penggunaan memory dari ${initialMemoryUsage} naik ke ${currentMemoryUsage}`);