# Node.js From Scratch

Node.js version manager with support for compiling its source code from scratch with custom parameters.

## Installation

If you do not define `NFS_DIR`, NFS will try to do that for you. It is a good idea to define it for the best results. For example, you can put this at the top of your `.bashrc` (or `.zshrc`, `~/.profile`, ...) file:

```sh
NFS_DIR="${HOME}/.nfs"
export NFS_DIR
```

NFS does not aim to be a replacement of [NVM](https://nvm.sh). You should have a pre-installed version of Node.js. Install NFS using npm:

```sh
npm install -g @nfscratch/cli
nfs-js init # Create the `environment.sh` file inside `NFS_DIR`
```

If you want NFS to be loaded automatically when you open a new shell, you can add the following line after `NFS_DIR` to your shell profile:

```sh
[ -f "${NFS_DIR}/environment.sh" ] && source "${NFS_DIR}/environment.sh"
```

## Usage

```sh
nfs-js install '^22' --lts --jobs="$(nproc)"
```
