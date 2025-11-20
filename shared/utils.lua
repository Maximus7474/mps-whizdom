---Check if a resource is started and present
---@param resource string
---@return boolean
function IsResourceAvailable(resource)
    local state = GetResourceState(resource)

    return state == 'started' or state == 'starting'
end
