const fse = require('fse')
const fillTemplate = extCode => (`
    console.log('veil shall preveil')
    const scr = document.createElement('script')
    console.log(scr)
    scr.textContent =\`${extCode}\`
    document.body.appendChild(scr)
`)

const doubleEscape = extCode => extCode.replace(/\\/g, '\\\\')

const exec = async () => {
    const extCode = await fse.readFile('./dist/ext.js', 'utf8')
    const inline = fillTemplate(doubleEscape(extCode))
    await fse.writeFile('./Pack/inline.js', inline)

    process.exit(0)
}

exec()