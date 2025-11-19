---@param source number
---@param device Device
---@return string?
local function GetEquippedDeviceId(source, device)
    if device == "tablet" then
        return exports["lb-tablet"]:GetEquippedTablet(source)
    elseif device == "phone" then
        return exports["lb-phone"]:GetEquippedPhoneNumber(source)
    end
end

---@param device Device
---@param message string
RegisterNetEvent("lb-combined-reactts:notification", function(device, message)
    local src = source
    local deviceId = GetEquippedDeviceId(src, device)

    if not deviceId then
        return
    end

    if device == "tablet" then
        exports["lb-tablet"]:SendNotification({
            tabletId = deviceId,
            app = Config.Identifier,
            title = Config.Name,
            content = message,
        })
    elseif device == "phone" then
        exports["lb-phone"]:SendNotification(deviceId, {
            app = Config.Identifier,
            title = Config.Name,
            content = message,
        })
    end
end)
