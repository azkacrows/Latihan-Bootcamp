// menangkap pilihan pemain dengan prompt
let pemain = prompt("gajah, orang, semut");

// menangkap pilihan komputer
let komputer = Math.random();

// membuat bilangan random
if (komputer < 0.34) {
    komputer = 'gajah';
} else if (komputer >= 0.34 && komputer < 0.67) {
    komputer = 'orang';
} else {
    komputer = 'semut';
}

// menentukan rules 
if ( pemain == 'semut' && komputer == 'gajah' || pemain == 'gajah' && komputer == 'orang' || pemain == 'orang' && komputer == 'semut' ) {
    alert('kamu menang');
} else if( pemain == komputer ) {
    alert('seri');
} else {
    alert('kamu kalah');
}

// menampilkan hasil ke console 
alert(`kamu memilih ${pemain}`);
alert(`komputer memilih ${komputer}`);