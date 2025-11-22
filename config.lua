Config = {}

Config.LBPhone = true
Config.LBTablet = true

Config.Identifier = "whizdom"
Config.DefaultApp = true

Config.Name = "WhizDom"
Config.Description = "Show your wisdom by guessing words."
Config.Developer = "Whizz" -- GTA V lore company

-- Locale used for the word generation
Config.Locale = {
    Code = 'en',
    -- If a user is using another locale, an adequate word will show.
    -- So if the Code is set to 'en' but the user has german on his phone, he'll get a german word.
    -- This is not yet implemented.
    AllowVariousLocales = false,
}

Config.WordSelection = {
    Length = 5,
    Category = nil, -- 'wordle' | 'brainrot' | 'countries' (for more refer to https://random-words-api.kushcreates.com)
}

Config.Screenshots = {
    Phone = {
        "screenshots/phone/screenshot-dark.webp",
        "screenshots/phone/screenshot-light.webp"
    },
    Tablet = {
        "screenshots/tablet/screenshot-dark.webp",
        "screenshots/tablet/screenshot-light.webp"
    }
}
