local resourceCache = {}

---Check if a resource is started and present
---@param resource string
---@return boolean
function IsResourceAvailable(resource)
    local state = resourceCache[resource]

    if not state then
        state = GetResourceState(resource)
        resourceCache[resource] = state
    end

    return state == 'started' or state == 'starting'
end

AddEventHandler('onResourceStop', function (resource)
    if resourceCache[resource] then
        resourceCache[resource] = nil
    end
end)
