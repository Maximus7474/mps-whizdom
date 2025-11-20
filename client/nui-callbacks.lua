RegisterNUICallback("game", function(data, cb)
    cb(AwaitCallback('nui:game', data))
end)
