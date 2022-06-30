/**
 * Classe geradora de números pseudoaleatórios
 * Fonte: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 */
class SFCRandom {
    static sfc32(a, b, c, d) {
        return function () {
            a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
            var t = (a + b) | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            d = d + 1 | 0;
            t = t + d | 0;
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        }
    }

    /**
     * Define qual é a semente a ser usada na geração dos números
     * @param {number} seed 
     */
    static seed(seed) {
        var _seed = seed ^ 0xDEADBEEF; // 32-bit seed with optional XOR value
        // Pad seed with Phi, Pi and E.
        // https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
        this.rand = this.sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, _seed);
    }

    /**
     * Obtem um número aleatório proporcional a semente fornecida
     * @returns {number} Número no intervalo [0-1)
     */
    static random() {
        return this.rand();
    }
}

module.exports = SFCRandom;