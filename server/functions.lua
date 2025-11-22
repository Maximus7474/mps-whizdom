---Register server callback
---@param event string
---@param handler fun(source: number, device: "tablet"|"phone", deviceId: string, ...) : any
---@param defaultReturn any
---@param antiSpam? boolean
function RegisterCallback(event, handler, defaultReturn, antiSpam)
    if IsResourceAvailable('lb-phone') then
        exports["lb-phone"]:RegisterCallback(event, function (source, ...)
            local phoneNumber = exports["lb-phone"]:GetEquippedPhoneNumber(source)
            return handler(source, "phone", phoneNumber, ...)
        end, defaultReturn, antiSpam)
    end

    if IsResourceAvailable('lb-tablet') then
        exports["lb-tablet"]:RegisterCallback(event, function (source, ...)
            local tabletId = exports["lb-tablet"]:GetEquippedTablet(source)
            return handler(source, "tablet", tabletId, ...)
        end, defaultReturn, antiSpam)
    end
end
