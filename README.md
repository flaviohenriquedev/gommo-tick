# Gommo Tick

App mobile Expo/React Native.

## Expo Go

O projeto esta fixado no Expo SDK `56` para abrir no Expo Go disponivel publicamente na Play Store.

## Porta padrao

Este projeto usa a porta `8090` para evitar conflito com outros projetos na porta padrao do Expo (`8081`).

Use sempre os scripts do projeto:

```powershell
npm.cmd run start
npm.cmd run web
npm.cmd run debug
```

Se for usar Expo via `npx`, informe a porta manualmente:

```powershell
npx.cmd expo start --port 8090
npx.cmd expo start --web --port 8090
```

Evite rodar `npx expo start` sem `--port 8090`, porque a CLI do Expo volta para `8081`.

## Rodar no celular fisico

### Sem Expo Go, pelo navegador do celular

Este e o jeito mais simples para visualizar agora:

```powershell
npm.cmd run phone:web
```

No celular, abra o navegador em:

```text
http://192.168.1.167:8090
```

O celular precisa estar no mesmo Wi-Fi do computador.

### Via cabo USB no navegador do celular

Com Android Debug Bridge instalado e depuracao USB ativada no celular:

```powershell
npm.cmd run web
npm.cmd run phone:usb:reverse
```

Depois abra no navegador do celular:

```text
http://127.0.0.1:8090
```

### Expo Go

Para abrir no Expo Go usando o mesmo Wi-Fi do computador, rode:

```powershell
npm.cmd run phone
```

Depois escaneie o QR Code pelo app Expo Go.

Se a rede local bloquear a conexao, tente o tunel:

```powershell
npm.cmd run phone:tunnel
```

Observacao: para manter o preview no Expo Go, a persistencia rapida esta usando um adapter JS temporario. Antes de producao, a persistencia pode voltar para MMKV em um development build.

## Validacao

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build:web
```
