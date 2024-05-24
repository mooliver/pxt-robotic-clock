// Pinout
// P0 - malý ciferník (24 LED)
// P1 - velký ciferník (60 LED)
// P2 - indikátor tlačítek (4 LED, dotyková tlačítka)
// P13 - dotykové tlačítko L1 (l1)
// P14 - dotykové tlačítko L2 (l2)
// P15 - dotykové tlačítko R1 (r1)
// P16 - dotykové tlačítko R2 (r2)

// Led pasky
let velkyCif = neopixel.create(DigitalPin.P1, 60, NeoPixelMode.RGB)
let malyCif = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)
let indikatorTlacitka = neopixel.create(DigitalPin.P16, 4, NeoPixelMode.RGB)

// Dotyková tlačítka
let l1: number
let l2: number
let r1: number
let r2: number

function showLeds() { // Funkce zobrazí všechny LEDky
    malyCif.show(),
    velkyCif.show(),
    indikatorTlacitka.show()
}

basic.forever(function() {
    /* l1 = pins.digitalReadPin(DigitalPin.P13)
    l2 = pins.digitalReadPin(DigitalPin.P14)
    r1 = pins.digitalReadPin(DigitalPin.P15)
    r2 = pins.digitalReadPin(DigitalPin.P16)
    if (l1 === 1) {
        malyCif.setPixelColor(1, neopixel.hsl(0, 100, 50))
        showLeds()
    }
    if (l2 === 1) {
        malyCif.setPixelColor(2, neopixel.hsl(0, 100, 50))
        showLeds()
    }
    if (r1 === 1) {
        malyCif.setPixelColor(3, neopixel.hsl(0, 100, 50))
        showLeds()
    }
    if (r2 === 1) {
        malyCif.setPixelColor(4, neopixel.hsl(0, 100, 50))
        showLeds()
    } */
    showLeds()
})