---@alias Device "phone" | "tablet" | nil

---@type Device
CURRENT_DEVICE = nil

local resourceName = GetCurrentResourceName()
local appOpen = false

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
    icon = mediaUrl .. "/icon.png",

    fixBlur = true,

    onOpen = function()
        local resource = GetInvokingResource()

        if resource == "lb-phone" then
            CURRENT_DEVICE = "phone"
        elseif resource == "lb-tablet" then
            CURRENT_DEVICE = "tablet"
        end

        appOpen = true
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
