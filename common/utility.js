
exports.getCompany = function _getCompany(email) {
    const e=(email||'').trim().toLowerCase();
    let i=e.indexOf('@');
    if (i===-1) {
        return null
    }

    let domain=email.substr(i+1);
    i=domain.indexOf('.');
    if (i===-1) {
        return null
    }
    return domain.substr(0,i);
}
