---@param action string
---@param data any
function SendAppMessage(action, data)
    if CURRENT_DEVICE == "tablet" then
        exports["lb-tablet"]:SendCustomAppMessage(Config.Identifier, action, data)
    elseif CURRENT_DEVICE == "phone" then
        exports["lb-phone"]:SendCustomAppMessage(Config.Identifier, {
            action = action,
            data = data
        })
    end
end
