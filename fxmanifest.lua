fx_version "cerulean"
game "gta5"
lua54 "yes"

title "MPS WhizDom"
description "A wordle like app for LB phone & tablet."
author "Maximus7474"

shared_script "config.lua"
client_script "client/**.lua"
server_script "server/**.lua"

files {
    "ui/dist/**",
    "ui/icon.png"
}

-- ui_page "ui/dist/index.html"
ui_page "http://localhost:3000"
