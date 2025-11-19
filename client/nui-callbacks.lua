RegisterNUICallback("notification", function(data, cb)
    if data.type == "gta" then
        BeginTextCommandThefeedPost("STRING")
        AddTextComponentSubstringPlayerName(data.message)
        EndTextCommandThefeedPostTicker(false, false)
    else
        TriggerServerEvent("lb-combined-reactts:notification", CURRENT_DEVICE, data.message)
    end
end)
