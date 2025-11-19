---@alias Device "phone" | "tablet" | nil

---@type Device
CURRENT_DEVICE = nil

local resourceName = GetCurrentResourceName()
local appOpen = false

local function SendDirection()
    Wait(500) -- allow the app to initialize

    local directions = { "N", "NE", "E", "SE", "S", "SW", "W", "NW" }
    local oldYaw, direction

    while appOpen do
        Wait(0)

        local yaw = math.floor(360.0 - ((GetFinalRenderedCamRot(0).z + 360.0) % 360.0) + 0.5)

        if yaw == 360 then
            yaw = 0
        end

        -- get closest direction
        if oldYaw ~= yaw then
            oldYaw = yaw
            direction = yaw .. "° " .. directions[math.floor((yaw + 22.5) / 45.0) % 8 + 1]

            SendAppMessage("updateDirection", direction)
        end
    end
end

local mediaUrl
local url = GetResourceMetadata(resourceName, "ui_page", 0)

if url:sub(1, 4) == "http" then
    mediaUrl = url .. "/public"
else
    mediaUrl = "https://cfx-nui-" .. resourceName .. "/ui/dist"
end

local appData = {
    identifier = Config.Identifier or "lb-combined-react-ts",
    defaultApp = Config.DefaultApp == true,

    name = Config.Name or "Phone & Tablet",
    description = Config.Description or "Racing app addon to lb-phone & lb-tablet",
    developer = "LB Scripts",

    ui = url:find("http") and url or "https://cfx-nui-" .. resourceName .. "/" .. url,
    icon = mediaUrl .. "/icon.svg",

    fixBlur = true,

    onOpen = function()
        local resource = GetInvokingResource()

        if resource == "lb-phone" then
            CURRENT_DEVICE = "phone"
        elseif resource == "lb-tablet" then
            CURRENT_DEVICE = "tablet"
        end

        appOpen = true

        Citizen.CreateThreadNow(SendDirection)
    end,

    onClose = function()
        CURRENT_DEVICE = nil

        appOpen = false
    end
}

local phoneImages = {}
local tabletImages = {}

for i = 1, #Config.Screenshots.Phone do
    phoneImages[#phoneImages+1] = mediaUrl .. "/" .. Config.Screenshots.Phone[i]
end

for i = 1, #Config.Screenshots.Tablet do
    phoneImages[#phoneImages+1] = mediaUrl .. "/" .. Config.Screenshots.Tablet[i]
end

local function AddApp()
    Wait(500) -- wait for the AddCustomApp exports to be registered

    if GetResourceState("lb-phone") == "started" and Config.LBPhone then
        appData.images = phoneImages

        exports["lb-phone"]:AddCustomApp(appData)
    end

    if GetResourceState("lb-tablet") == "started" and Config.LBTablet then
        appData.images = tabletImages

        exports["lb-tablet"]:AddCustomApp(appData)
    end
end

AddEventHandler("onResourceStart", function(resource)
    if
        (resource == "lb-phone" and Config.LBPhone)
        or (resource == "lb-tablet" and Config.LBTablet)
    then
        AddApp()
    end
end)

Citizen.CreateThreadNow(function()
    if not Config.LBPhone or GetResourceState("lb-phone") == "missing" then
        return
    end

    while GetResourceState("lb-phone") ~= "started" do
        Wait(500)
    end

    AddApp()
end)

Citizen.CreateThreadNow(function()
    if not Config.LBTablet or GetResourceState("lb-tablet") == "missing" then
        return
    end

    while GetResourceState("lb-tablet") ~= "started" do
        Wait(500)
    end

    AddApp()
end)
