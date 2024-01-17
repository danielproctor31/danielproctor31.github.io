---
title: "Fedora Silverblue"
description: ""
pubDatetime: 2023-04-20
author: Daniel Proctor
featured: false
---

## What is Silverblue?

[Silverblue](https://silverblue.fedoraproject.org/) is Linux distribution created by Fedora that takes a different approach to system updates and maintenance. Unlike most traditional Linux distributions that allow system updates to be applied in-place, Silverblue is an **immutable distribution**, which means that its core operating system and applications are read-only and cannot be modified during runtime. Instead, system updates are managed through [rpm-ostree](https://coreos.github.io/rpm-ostree/), which creates a new deployment of the system with updated packages and configuration files. This allows for a more reliable and stable system, as all changes are isolated to individual deployments, with the ability to rollback to the previous deployment should anything go wrong.

## Flatpak

Another advantage of Silverblue is the use of containers for applications. Applications are installed using [Flatpak](https://flatpak.org/). Flatpak applications are sandboxed meaning they do not interfere with the core operating system and can be updated and managed independently.

## DistroBox

As a developer, having a read-only file system can become a hindrance when you need to change things at the system level. This is where Toolbox and Distrobox come in. Using these you can run a completely different distribution with its own system using podman/docker while still having access to your home directory. This gives you access to a terminal environment which a traditional package manager using the distribution of your choice which you can modify as much as you like. Any issues will not break anything in the host system and you can easily start again from scratch if needed.

Another benefit of this is you are able to setup your own pre-built images. In [this repository](https://github.com/danielproctor31/archbox) I have created my own arch based image with all the software I use pre-installed and use a github action to build the image should I make any changes to it.

Using distrobox I can pull down this and get up an running quickly by pulling the image and creating the container:
```
distrobox-create -i ghcr.io/danielproctor31/archbox:latest -n archbox
```

whenever I then want to work in the container I can run:
```
distrobox-enter archbox
```

## Overlay

In some cases there are packages which simply need to be installed at the operating system level to work. Such as Wireguard, Docker and Distrobox itself.

In these instances you can use rpm-ostree to overlay these on top on the system.

```
rpm-ostree install distrobox
```

This will install the package at the system level and will be kept and updated like all the other system packages.
To check which packages you have overlayed you can use `rpm-ostree status`.

## Custom Images

My interest in Silverblue first came about when I came across the [uBlue Project](https://github.com/ublue-os). With Silverblue you can build your own images similar to how I previously mentioned with DistroBox. Then use rpm-ostree to rebase to it.

This allows you to automate installing any packages you would always add whenever you install Linux and pre-configure anything to your liking. I have setup my own [here](https://github.com/danielproctor31/silverblue/) which builds a new image nightly with updates from Fedora.

After installing Silverblue from the official ISO you can rebase using rpm-ostree. In my case this would be:
```
sudo rpm-ostree rebase --experimental ostree-unverified-registry:ghcr.io/danielproctor31/silverblue:latest
```

After a reboot my system is setup to my liking and ready to go.


## Further Reading:

- https://silverblue.fedoraproject.org/
- https://coreos.github.io/rpm-ostree/
- https://github.com/89luca89/distrobox
- https://flatpak.org/
- https://github.com/ublue-os