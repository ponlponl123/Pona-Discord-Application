# Pona-Discord-Application

A cute discord application character name is Pona!

Pona! can be streaming audio through twitch.tv, youtube videos, youtube music or youtube live.

![Pona Github Banner](./docs/images/Pona!%20Github%20Banner.png)

## Features

- [x] Streaming Audio from Youtube, Youtube Music, Twitch.tv, SoundCloud, Spotify
- [ ] Customize character for specific guild
- [ ] Setting specific default language for guild

- [x] Open Source
- [x] You can give me a coffee?

## Setup

> [!NOTE]
> You can host your own Lavalink server with lavalink version latest than v4.

1. Use git clone to clone this repository to your local directory

    ```bash
    git clone https://github.com/ponlponl123/Pona-Discord-Application
    ```

2. then run the following command to install node_modules requirements for application.

   ```bash
   npm install --save-dev
   ```

3. Config your environment with .env file e.g.

    ```env
    DISCORD_TOKEN="b64_bin-101101100110100_1010011011110100_1001101101000000"
    DISCORD_GUILD_ID='dec-oct_72232502555541020027'
    DISCORD_CLIENT_ID='b64_oct-25189_25189_1517_0'

    LAVALINK_SERVER='localhost'
    LAVALINK_PORT=2333
    LAVALINK_PASSWORD='youshallnotpass'
    ```

4. after setting up the config file then run the following command to build and run the application.

    ```bash
    npm run build && npm run start
    ```

### If you want to run this application on docker

i have created a docker compose file to get more easier setting up a whole application.

- Run `docker-compose.yml` to get both lavalink server and Pona discord application.

- Run `docker-compose.with-redis.yml` to get all lavalink server, redis-master, redis-replica, redis-sentinel and Pona discord application.

- Run `docker-compose.redis-only.yml` to get only redis-master, redis-replica, redis-sentinel for Pona discord application.
  
- Run `docker-compose.standalone.yml` to get only Pona discord application if u have your own lavalink server (and redis server).

- the last one is the `lavalink/docker-compose.yml` this is a standalone lavalink server on docker, if u want it.

### Troubleshooting

#### Redis can't saved, override or modified thier configuration.

Try this command to make ./conf directory can edit by any users

- Windows
    ```cmd
    start .\allow-edit-config-dir.ps1
    ```
    or
    
    ```ps1
    $acl = Get-Acl -Path ".\conf"

    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Everyone","FullControl","Allow")
    $acl.SetAccessRule($accessRule)

    Set-Acl -Path ".\conf" -AclObject $acl -Recurse
    ```


- Linux / Debian / Ubuntu
    ```bash
    chmod -R 777 ./conf
    ```


</br>

#### If u like this project, u can [buy me a coffee](https://buymeacoffee.com/ponlponl123)!
