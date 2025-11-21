local sessionWord = {}
local availableLocales = {
    en = true,
    es = true,
    ['hi-la'] = true,
    de = true,
    it = true,
}
local accountAttempts = {}
local currentAccounts = {}

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
    if currentAccounts[deviceId] then
        return currentAccounts[deviceId]
    end

    local account = MySQL.query.await(
        'SELECT `account` FROM `whizdom_connected_accounts` WHERE `device` = ? AND `device_id` = ?', {
        device, deviceId
    })

    local tempAccount = false
    if not account then
        account = tempUsername()
        tempAccount = true
    end

    currentAccounts[deviceId] = {
        source = source,
        account = account,
        temporary = tempAccount,
    }

    return account
end
