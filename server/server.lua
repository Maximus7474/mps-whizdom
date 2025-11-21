local sessionWord = {}
local availableLocales = {
    en = true,
    es = true,
    ['hi-la'] = true,
    de = true,
    it = true,
}

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

    end
end)
