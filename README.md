## The frontend is not directly served from this backend. 
The frontend is instead deployed from https://github.com/senektra/fullstackopen/tree/main/part3/exercises/phonebook

# Phonebook Backend

__Deployed to https://fso-phonebook.up.railway.app__

__For info: https://fso-phonebook.up.railway.app/info__

__For API: https://fso-phonebook.up.railway.app/api/persons__

__For frontend: https://fso-phonebook-frontend.up.railway.app__

In order to serve the frontend on Railway's platform, it is deployed with Caddy.
A Caddyfile specifies hosting configuration and a nixpacks.toml is used to download
and install the Caddy server.

I realize this is not how the exercises intended for the frontend to be deployed,
but seeing as this course for me is primarily self-study, I saw no harm in
a little deviation. I'm also happy that I did, as I now know about Caddy (which
is written in Go, one of my favorite languages).