---Trigger server callback
---@param event string
---@param ... unknown
---@return unknown
function AwaitCallback(event, ...)
    if IsResourceAvailable('lb-phone') then
        return exports["lb-phone"]:AwaitCallback(event, ...)
    elseif IsResourceAvailable('lb-tablet') then
        return exports["lb-tablet"]:AwaitCallback(event, ...)
    else
        error('Nor lb-tablet or lb-phone is present, this resource will not work', 0)
    end
end
