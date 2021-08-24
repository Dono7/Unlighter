![GitHub all releases](https://img.shields.io/github/downloads/Dono7/Unlighter/total?color=%23656ecf&logoColor=%23111&label=total%20downloads)
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/Dono7/Unlighter?include_prereleases&label=lastest%20release&color=%23656ecf)


# Unlighter

Unlighter is a small and free software made to reduce the screens brightness lower than the minimum possible. It works with every type of screens. It can also provides some Shortcuts to controll your brightness.

![Unlighter App Screenshot](doc/img/unlighter-screenshot.png)

## Download

*For the moment, Unlighter is only available on Windows.*

**The app may show several warning while downloading and installing the app since we did not buy the developer Microsoft certificate yet.** This will be fixed when the first "public release" will be published.

You can download the latest version of Unlighter in the [Github Release tab](https://github.com/Dono7/Unlighter/releases) since the dedicated website is not released yet. Choose your version (preferably the latest), then click on "Assets 5" to display all the assets. Then click on the setup link (the file named `Unlighter-Setup-X.X.X.exe`) to download it.



## Contributors

- [Donovan T.](https://github.com/Dono7/) : Software Developer & Web Weveloper
- [Walid B.](https://www.behance.net/bourhanewac933) : UI/UX Designer

If you are a 3D artist and want to contribute to Unlighter, please send us a message and attach a portfolio.

## Report a bug

If you encounter any problem, first of all, make sure you have the latest version. You can easily update the app from the About tab.

If you are already up to date, then please [open an issue](https://github.com/Dono7/Unlighter/issues) on the Github section, if you want to report a bug. Provide as many details as you can, including the app version (displayed when the app starts).

---

## Development Setup

*This may not work properly on iOs or Linux*

### Compiles and hot-reloads for development

First, clone the project :

```bash
git clone https://github.com/Dono7/Unlighter.git
cd unlighter
```

Then with Yarn (recommanded) : 

```bash
yarn install
yarn electron:serve
```

### Compiles and minifies for production

```bash
yarn electron:build
# Installelr built into unlighter/dist_electron foldler
```

