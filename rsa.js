/*
RSA reference implementation
https://pt.wikipedia.org/wiki/RSA_(sistema_criptogr%C3%A1fico)
https://en.wikipedia.org/wiki/RSA_%28cryptosystem%29
https://www.lambda3.com.br/2012/12/entendendo-de-verdade-a-criptografia-rsa-parte-ii/?doing_wp_cron=1570063273.4798159599304199218750

https://github.com/esthefanielanza/Rsa-C/blob/master/rsa.c
https://github.com/denysdovhan/rsa-labwork

https://pt.wikipedia.org/wiki/Algoritmo_de_Euclides_estendido
https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
https://www.vivaolinux.com.br/script/Algoritmo-de-euclides-estendido-(calcula-o-D-RSA)
https://github.com/bobvanluijt/Bitcoin-explained/blob/master/RSA.js
*/

//https://github.com/peterolson/BigInteger.js
var bigInt = require("big-integer");

p = 17;
q = 41;
message = "abcdef";

if (verificaPrimo(p) == 0 || verificaPrimo(q) == 0) {
    console.log("Os números precisam ser primos");
    return 0;
}

n = p * q;
//calculando o quociente de euler
phi = (p - 1) * (q - 1);
e = escolheE(phi, p, q, n);

//chamando a função que calcula o d. Ela retorna um número que case na 
//expressão: d*e mod phi = X
//Tem-se o e e o phi. Para o RSA o X deve ser 1, pois d*e mod phi = 1
d = euclides_ext(e, phi, 1);

console.log("p: " + p + " q: " + q);
console.log("n = p * q: " + n);
console.log("phi = (p-1) * (q-1): " + phi);
console.log("e = phi(n) = mmc(p-1,q-1): " + e);
console.log("d: " + d);

const encoded_message = encode2(message);
const encrypted_message = encrypt(encoded_message, e, n);
const decrypted_message = decrypt(encrypted_message, d, n);
const decoded_message = decode2(decrypted_message);

console.log('Message:', message);
console.log('Encoded:', encoded_message.toString());
console.log('Encrypted:', encrypted_message.toString());
console.log('Decrypted:', decrypted_message.toString());
console.log('Decoded:', decoded_message.toString());
console.log();
console.log('Correct?', message === decoded_message);

function encode2(str) {
    texto = str.toLowerCase();
    var numeros = [];
    texto.split('').map(function (letra) {
        numeros.push((letra.charCodeAt(0) - 87));
    });
    return numeros;
}
function decode2(code) {
    let string = '';
    var codes = code;
    codes.map(function (letra) {
        string += String.fromCharCode(letra + 87);
    });

    return string;
}

function encrypt(encodedMsg, e, n) {
    var codes = [];
    for (let i = 0; i < encodedMsg.length; i++) {
        codes.push(bigInt(encodedMsg[i]).modPow(e, n));
    }
    return codes;
}

function decrypt(encryptedMsg, d, n) {
    var codes = [];
    for (let i = 0; i < encryptedMsg.length; i++) {
        codes.push(bigInt(encryptedMsg[i]).modPow(d, n));
    }
    return codes;
}

function euclides_ext(a, b, c) {
    var r;

    r = mod(b, a);

    if (r == 0) {
        return (mod((c / a), (b / a)));   // retorna (c/a) % (b/a)
    }

    return ((euclides_ext(r, a, -c) * b + c) / (mod(a, b)));
}

function mod(a, b) {
    var r = a % b;
    //Uma correçã é necessária se r e b não forem do mesmo sinal
    //se r for negativo e b positivo, precisa corrigir
    if ((r < 0) && (b > 0))
        return (b + r);

    //Se ra for positivo e b negativo, nova correcao
    if ((r > 0) && (b < 0))
        return (b + r);

    return (r);
}

//Escolhe o menor primo que divide o coeficiente de euler. Obs: Ele deve ser diferente de p e p2.
function escolheE(phi, p, p2, n) {
    var i;
    var e;
    for (i = 2; i < phi; i++) {

        if (phi % i != 0 && verificaPrimo(i) && i != p && i != p2) {
            e = i;
            break;
        }
    }
    return e;
}

function verificaPrimo(p) {
    var i;
    var j;

    j = Math.sqrt(p);

    for (i = 2; i <= j; i++) {
        if (p % i == 0)
            return 0; //Retorna 0 caso não seja um número primo
    }

    return 1; //Retorna 1 quando é um número primo
}