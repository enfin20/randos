export function replaceText(source, thesaurus) {
    try {
        for (var i = 0; i < thesaurus.length; i++) {
            source = source.replace(thesaurus[i].shortcut, thesaurus[i].word)
        }
        return source;
    }
    catch (err) {
        console.info("err", err)
        return err.message
    }
}