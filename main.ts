// Pinout
// P8 - malý ciferník (24 LED)
// P1 - velký ciferník (60 LED)
// P2 - stavové ledky (4 LED, dotyková tlačítka)
// P13 - dotykové tlačítko L1 - led 3
// P14 - dotykové tlačítko L2 - led 2
// P15 - dotykové tlačítko R1 - led 0
// P16 - dotykové tlačítko R2 - led 1

pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
pins.setPull(DigitalPin.P16, PinPullMode.PullNone)

// Led pasky
const malyCif = neopixel.create(DigitalPin.P8, 24, NeoPixelMode.RGB)
const velkyCif = neopixel.create(DigitalPin.P1, 60, NeoPixelMode.RGB)
const stavLed = neopixel.create(DigitalPin.P2, 4, NeoPixelMode.RGB)

const barvaLed = neopixel.rgb(0, 200, 10)

// Stavy hodin
let hodiny: boolean = true // Indikuje zda jsou spuštěné hodiny nebo stopky
let stopky: boolean = false // Indikuje zda jsou spuštěné hodiny nebo stopky

let modeHodiny: boolean = true // Indikuje jaký je spuštěný mód u hodin
let modeDatum: boolean = false // Indikuje jaký je spuštěný mód u hodin

let stop: boolean = false // Identifiku zda jsou spuštěné či zastavené stopky
let sec: number = 0 // Nastaví sekundy stopek na nulu
let min: number = 0 // Nastaví minuty stopek na nulu

function showLeds() { // Zobrazí všechny LEDky
    malyCif.show(),
    velkyCif.show(),
    stavLed.show()
}

function showCif() { // Zobrazí všechny ciferníky
    malyCif.show(),
    velkyCif.show()
}

function clearCif() { // Zhasne všechny ciferníky
    malyCif.clear(),
    velkyCif.clear(),
    showLeds()
}

function clearLeds() { // Zhasne všechny LEDky
    malyCif.clear(),
    velkyCif.clear(),
    stavLed.clear(),
    showLeds()
}

function hodinyCas() { // Zobrazí aktuální čas
    clearCif()

    if (DS3231.minute() < 30) {
        malyCif.setPixelColor(20, barvaLed)
    } else {
        malyCif.setPixelColor(21, barvaLed)
    }
    malyCif.rotate(DS3231.hour() * 2 - 1)
    
    velkyCif.setPixelColor(30, barvaLed)
    velkyCif.rotate(DS3231.minute())
    
    showLeds()
}

function hodinyDatum() { // Zobrazí aktuální datum
    clearCif()

    malyCif.setPixelColor(20, barvaLed)
    malyCif.setPixelColor(21, barvaLed)
    malyCif.rotate(DS3231.month() * 2 - 1)

    velkyCif.setPixelColor(30, barvaLed)
    velkyCif.rotate(DS3231.date())

    showLeds()
}

function stopovaniCasu() { // Stopky
    if (sec !== 60 && sec < 30) {
        malyCif.clear()
        malyCif.setPixelColor(20, barvaLed)
        malyCif.rotate(min * 2)

        velkyCif.rotate(1)
        sec++

        showCif()
    } else if (sec !== 60 && sec >= 30) {
        malyCif.clear()
        malyCif.setPixelColor(20, barvaLed)
        malyCif.setPixelColor(21, barvaLed)
        malyCif.rotate(min * 2)

        velkyCif.rotate(1)
        sec++

        showCif()
    } else {
        min++
        malyCif.clear()
        malyCif.setPixelColor(20, barvaLed)
        malyCif.rotate(min * 2)

        velkyCif.rotate(1)
        sec = 1

        showCif()
    }
}

// Kód zobrazující čas po spuštění hodin (microbitu)
hodinyCas()
stavLed.setPixelColor(3, barvaLed)
stavLed.setPixelColor(1, barvaLed)
stavLed.show()

// Funkce tlačítek
pins.onPulsed(DigitalPin.P13, PulseValue.Low, function() { // Tlačítko L1
    hodiny = true // Změní stav hodin (hodiny nebo stopky)
    stopky = false

    modeHodiny = true // Zmení mód hodin (čas nebo datum)
    modeDatum = false

    stop = true // Zamkne stopky
     
    loops.everyInterval(5000, function () { // Každých 5 sekund aktualizuje čas
        if (hodiny && modeHodiny) {
            hodinyCas()
        }
    })

    stavLed.clear()
    stavLed.setPixelColor(3, barvaLed)
    stavLed.setPixelColor(1, barvaLed)
    stavLed.show()
})

pins.onPulsed(DigitalPin.P14, PulseValue.Low, function () { // Tlačítko L2    
    hodiny = false // Změní stav hodin (hodiny nebo stopky)
    stopky = true

    modeHodiny = false // Zmení mód hodina (čas nebo datum)
    modeDatum = false
    stop = true // Zamnkne stopky

    clearLeds()
    stavLed.setPixelColor(2, barvaLed)
    showLeds()
})

pins.onPulsed(DigitalPin.P15, PulseValue.Low, function () { // Tlačítko R1
    stavLed.clear()
    
    if (hodiny) { // Zjišťuje zda jsou aktivní hodiny či stopky
        modeDatum = false // Změní stav hodin (hodiny nebo stopky)
        modeHodiny = true
        stop = true // Zamnkne stopky
        stavLed.setPixelColor(3, barvaLed)
        loops.everyInterval(5000, function () { // Každých 5 sekund aktualizuje čas
            if (hodiny && modeHodiny) { 
                hodinyCas()
            }
        })
    } else if (stopky) { // Zjišťuje zda jsou aktivní hodiny či stopky
        velkyCif.clear()
        velkyCif.setPixelColor(30, barvaLed)

        stop = false // Spustí stopky
        sec = 0 // Resetuje stopky
        min = 0
        stavLed.setPixelColor(2, barvaLed)
    }
    
    stavLed.setPixelColor(1, barvaLed)
    stavLed.show()
})

pins.onPulsed(DigitalPin.P16, PulseValue.Low, function () { // Tlačítko R2
    stop = true
    stavLed.clear()

    if (hodiny) { // Zjišťuje zda jsou aktivní hodiny či stopky
        modeDatum = true // Zmení mód hodin (čas nebo datum)
        modeHodiny = false
        if (modeDatum) {
            hodinyDatum()
            stavLed.setPixelColor(3, barvaLed)
        }
    } else { // Zjišťuje zda jsou aktivní hodiny či stopky
        stavLed.setPixelColor(2, barvaLed)
        malyCif.clear()
        velkyCif.clear()
    }

    stavLed.setPixelColor(0, barvaLed)
    stavLed.show()
})

loops.everyInterval(100, function() { 
    if (stopky && !stop) { // Kontroluje zda-li jsou spuštěné stopky
        stopovaniCasu() // Stopuje Čas
        control.waitMicros(900000)
    }
})
