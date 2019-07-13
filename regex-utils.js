function getMatches(input, regexString, flags) {
    const regex = new RegExp(regexString, flags);
    let matches = regex.exec(input);
    return matches;
}

function getEntireMatch(input, regexString, flags) {
    return getMatches(input, regexString, flags)[0];
}

function getFirstCapturingGroup(input, regexString, flags) {
    return getMatches(input, regexString, flags)[1];
}

module.exports = {
    getMatches,
    getEntireMatch,
    getFirstCapturingGroup
};
