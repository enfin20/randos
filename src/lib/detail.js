export function getDetail(url) {
    if (url.indexOf("detail") > 0 || url.indexOf("map") > 0 || url.indexOf("parcours") > 0 || url.indexOf("dashboard") > 0 || url.indexOf("expenses") > 0) {
      return true;
    }
    else {
        return false
    }
}