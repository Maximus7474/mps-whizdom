local sessionWord = {}
local availableLocales = {
    en = true,
    es = true,
    ['hi-la'] = true,
    de = true,
    it = true,
}
local currentAccounts, devices = {}, {}
local ATTEMPTS <const> = 6
local LetterState = {
    Pending = 0,
    Invalid = 1,
    Missplaced = 2,
    Correct = 3,
    Selected = 4,
}

---Obtain a word from the kushcreates random word API
---@param localeKey string
---@return string
local function getWord(localeKey)
    if not availableLocales[localeKey] then
        localeKey = Config.Locale.Code
    end

    if sessionWord[localeKey] then
        return sessionWord[localeKey]
    end

    local wordPromise = promise.new()

    PerformHttpRequest(
        string.format(
            'https://random-words-api.kushcreates.com/api?language=%s&length=%d&type=lowercase&words=1%s',
            localeKey, Config.WordSelection.Length,
            Config.WordSelection.Category and string.format('&category=%s', Config.WordSelection.Category) or ''
        ),
        function (status, body, headers, errorData)
            if status ~= 200 then
                error(string.format('Unable to find a word for locale key: %s - %s', localeKey, errorData))
            end

            local words = json.decode(body)

            wordPromise:resolve(words[1].word)
        end,
        'GET'
    )

    local word = Citizen.Await(wordPromise)

    if type(word) ~= "string" then
        error(string.format('Failed to get a word for %s locale', localeKey))
    end

    -- print(string.format('Obtained word "%s" for locale: %s', word, localeKey))

    sessionWord[localeKey] = word

    return word
end

---Create a temporary username
---@return string
local function tempUsername()
    local current_time = os.time()
    return string.format('user_%d', current_time)
end

---Get the account associated with the device
---@param source number
---@param device 'phone'|'tablet'
---@param deviceId string
---@return string
local function getAccount(source, device, deviceId)
    local account = devices[deviceId]
    if account and currentAccounts[account] then
        return account
    end

    account = account or MySQL.single.await(
        'SELECT `account` FROM `whizdom_connected_accounts` WHERE `device` = ? AND `device_id` = ?', {
        device, deviceId
    })

    local tempAccount = false
    if not account then
        account = tempUsername()
        tempAccount = true
    end

    devices[deviceId] = account

    if not currentAccounts[account] then
        currentAccounts[account] = {
            source = source,
            account = account,
            temporary = tempAccount,
            locale = Config.Locale.Code,
            attempts = {},
        }
    end

    return account
end

---@param source number
---@param device "tablet"|"phone"
---@param deviceId string
---@param payload { action: "init"|"newGuess", data?: any }
RegisterCallback("nui:game", function (source, device, deviceId, payload)
    local action, data = payload.action, payload.data
    local account = getAccount(source, device, deviceId)
    local accountData = currentAccounts[account]

    if action == "init" then
        local attempts = accountData.attempts

        return {
            attempts = attempts,
            finished = #attempts >= ATTEMPTS,
        }
    elseif action == "newGuess" then
        local guess = data.guess
        local localeKey = accountData.locale
        local wordToGuess = getWord(localeKey)
        local correction, correctLetters = {}, 0

        for i = 1, wordToGuess:len() do
            local base, guessLetter = wordToGuess:sub(i,i), guess:sub(i,i)

            if base == guessLetter then
                table.insert(correction, {
                    letter = guessLetter,
                    state = LetterState.Correct,
                })
                correctLetters += 1
            elseif string.find(wordToGuess, guessLetter, 1, true) ~= nil then
                table.insert(correction, {
                    letter = guessLetter,
                    state = LetterState.Missplaced,
                })
            else
                table.insert(correction, {
                    letter = guessLetter,
                    state = LetterState.Invalid,
                })
            end
        end

        table.insert(accountData.attempts, correction)

        return {
            attempts = accountData.attempts,
            finished = correctLetters == wordToGuess:len() or #accountData.attempts >= ATTEMPTS,
        }
    end
end)

CreateThread(function ()
    getWord(Config.Locale.Code)
end)
